import fetch from "node-fetch";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import sharp from "sharp";

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });
const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY!;
const UPLOADCARE_UPLOAD_URL = "https://upload.uploadcare.com/base/";

let HARDCODED_IMAGES: string[] = [];

interface UploadcareResponse {
    file?: string;
}

// Uploads a binary image stream to Uploadcare
async function uploadBinaryToUploadcare(response: ReadableStream): Promise<string | null> {
    try {
        const reader = response.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        // Convert to buffer
        const imageBuffer = Buffer.concat(chunks);

        // Upload image to Uploadcare
        const fileName = "blob.jpg";

        const formData = new FormData();
        formData.append("UPLOADCARE_PUB_KEY", UPLOADCARE_PUBLIC_KEY);
        formData.append("store", "1");
        formData.append("file", new Blob([imageBuffer], { type: "image/jpeg" }), fileName);

        const uploadResponse = await fetch(UPLOADCARE_UPLOAD_URL, { method: "POST", body: formData });
        const data: unknown = await uploadResponse.json();

        if (typeof data !== "object" || data === null || !("file" in data)) {
            console.error("Uploadcare upload failed:", data);
            return null;
        }

        return `https://ucarecdn.com/${(data as UploadcareResponse).file}/blob.jpg`;
    } catch (error) {
        console.error("Error uploading Replicate image to Uploadcare:", error);
        return null;
    }
}

// Creates a composite image from swapped faces
async function createCompositeImage(imageUrls: string[]): Promise<string | null> {
    try {
        if (imageUrls.length === 0) {
            console.error("No valid images to create composite.");
            return null;
        }

        const imageBuffers = await Promise.all(
            imageUrls.map(async (url) => {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
                return Buffer.from(await response.arrayBuffer()); // ✅ Use arrayBuffer() instead of buffer()
            })
        );

        const metadataList = await Promise.all(imageBuffers.map(async (img, index) => {
            try {
                const metadata = await sharp(img).metadata();
                if (!metadata) {
                    console.error(`Metadata for image ${index} is null`);
                    return { width: 0, height: 0 }; // Default values to prevent errors
                }
                console.log(`Image ${index} metadata:`, metadata);
                return metadata;
            } catch (error) {
                console.error(`Error reading image ${index}:`, error);
                return { width: 0, height: 0 }; // Prevents crashing if an image fails
            }
        }));
        const totalWidth = metadataList.reduce((sum, meta) => sum + (meta.width || 0), 0);
        const maxHeight = Math.max(...metadataList.map(meta => meta.height || 0));

        if (totalWidth === 0 || maxHeight === 0) {
            console.error("Composite image creation failed: Invalid image dimensions.");
            return null;
        }

        const compositeImage = sharp({
            create: {
                width: totalWidth,
                height: maxHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        });

        const compositeArray = imageBuffers.map((img, index) => ({
            input: img,
            top: 0,
            left: metadataList.slice(0, index).reduce((sum, meta) => sum + (meta.width || 0), 0) // Ensure images are positioned correctly
        }));
        const compositeBuffer = await compositeImage.composite(compositeArray).jpeg().toBuffer();
        return uploadBinaryToUploadcare(new Response(compositeBuffer).body as ReadableStream);
    } catch (error) {
        console.error("Composite image creation failed:", error);
        return null;
    }
}

// API Route: Face Swap & Composite Image Creation
export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { faces, selectedOption } = await req.json();

        switch(selectedOption) {
            case 'formula1':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/d62ca2ca-562d-47ab-a738-34136bd17091/f1left.png",
                    "https://ucarecdn.com/34b73ee1-8cba-4abe-95b7-20dc3183a2c1/f1leftcenter.png",
                    "https://ucarecdn.com/9eacd2e7-b6de-47fa-bd60-d5e61021067b/f1rightcenter.png",
                    "https://ucarecdn.com/e93d8b4c-eac8-4895-b956-5d198378dc1e/f1right.png"
                ];
            break;

            case 'pirates':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/8a629caf-2083-49ee-8325-c5fa9f345938/piratesleft.jpg",
                    "https://ucarecdn.com/7c4713e3-593d-4c47-9235-1e67ce377719/piratesleftcenter.jpg",
                    "https://ucarecdn.com/853153ce-6115-4d8e-8781-f1acc2ae862e/piratesrightcenter.jpg",
                    "https://ucarecdn.com/34b235a1-75d0-47ac-a844-8e4fc5b57958/piratesright.jpg"
                ];
            break;

            case 'knights':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/834e998c-d3b7-4d43-98cd-16e135e0dca4/knightsleft.jpeg",
                    "https://ucarecdn.com/131566b6-60ac-46d1-a85e-215c88024093/knightsleftcenter.jpeg",
                    "https://ucarecdn.com/9e6652a9-6bdd-4c1d-92f1-b7c8e1590290/knightsrightcenter.jpeg",
                    "https://ucarecdn.com/3d822e7f-9d14-4925-8034-d432e4dddd9c/knightsright.jpeg"
                ];
            break;

            case 'samurai':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/27b2bb3a-5ef4-45aa-9c37-edd03eba2f6d/samuraileft.jpeg",
                    "https://ucarecdn.com/f01769df-cd28-4a48-8f56-a1416033c75b/samuraileftcenter.jpeg",
                    "https://ucarecdn.com/0e18d0dc-5e50-4d09-9437-76f738bb12c4/samurairightcenter.jpeg",
                    "https://ucarecdn.com/af231490-c081-4bb7-ae1b-d8edbcdf83a4/samurairight.jpeg"
                ];
            break;

            case 'vikings':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/de8bd4cf-e79b-4810-97e7-67abf7709a28/vikingsleft.jpeg",
                    "https://ucarecdn.com/8bcd3395-31c6-4338-9d6c-c40bfd4025f4/vikingsleftcenter.jpeg",
                    "https://ucarecdn.com/10ef03bb-b1a9-41ec-9107-a434c52a955b/vikingsrightcenter.jpeg",
                    "https://ucarecdn.com/04db747b-7d23-4a3a-ba46-2908a9f03df1/vikingsright.jpeg"
                ];
            break;

            case 'cowboys':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/386ae627-58c9-45c3-87f0-14fa23f7e56f/cowboysleft.jpeg",
                    "https://ucarecdn.com/4a558ab8-75a3-472e-b62d-275cd6bb60b5/cowboysleftcenter.jpeg",
                    "https://ucarecdn.com/ab74ac04-7b61-4f61-b0dd-90ffc55c9858/cowboysrightcenter.jpeg",
                    "https://ucarecdn.com/79e6b6c9-250d-4a7d-9659-a10830f5bbbd/cowboysright.jpeg"
                ];
            break;

            case 'france':
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/092c98dd-e15c-4e92-8a3c-58d79ad4e297/ladoizquierdo.jpeg",
                    "https://ucarecdn.com/9fe290de-ad4f-4ed1-b9ad-e9aecd9b0a67/ladoizquierdocentral.jpeg",
                    "https://ucarecdn.com/59e30843-06da-44e6-81ae-1545cc4663a8/ladoderechocentral.jpeg",
                    "https://ucarecdn.com/5acf6372-edd0-47e4-a35b-2df8364c9299/ladoderecho.jpeg"
                ];
            break;

            /* TEMPLATE
            case '':
                HARDCODED_IMAGES = [
                    "",
                    "",
                    "",
                    ""
                ];
            break;
            */

            default: //beatles
                HARDCODED_IMAGES = [
                    "https://ucarecdn.com/22576899-c50d-4bf7-8302-948e2f16612c/beatlesleft.png",
                    "https://ucarecdn.com/6824e359-0404-4408-a60d-e173fe3f88cc/beatlesleftcenter.png",
                    "https://ucarecdn.com/d6a17dce-73a1-42e0-b83a-d714bd0da711/beatlesrightcenter.png",
                    "https://ucarecdn.com/1b5760fb-5858-4254-a829-68e2072ff191/beatlesright.png"
                ];
            break;
        }

        if (!faces || faces.length === 0) {
            return NextResponse.json({ error: "No faces provided" }, { status: 400 });
        }

        const swappedImages = await Promise.all(
            faces.map(async (faceUrl: string, index: number) => {
                const inputImage = HARDCODED_IMAGES[index % HARDCODED_IMAGES.length];
                const input = { swap_image: faceUrl, input_image: inputImage };

                try {
                    const response = await replicate.run(
                        "cdingram/face-swap:d1d6ea8c8be89d664a07a457526f7128109dee7030fdac424788d762c71ed111",
                        { input }
                    );

                    console.log("Raw Replicate Response:", response);

                    if (response instanceof ReadableStream) {
                        return await uploadBinaryToUploadcare(response); // ✅ Upload binary directly
                    }

                    if (typeof response === "string") {
                        return response; // ✅ If Replicate returns a direct URL, use it
                    }

                    console.error("Unexpected Replicate API response format:", response);
                    return null;
                } catch (error) {
                    console.error(`Replicate API error for face ${index}:`, error);
                    return null;
                }
            })
        );

        const validSwappedImages = swappedImages.filter((img): img is string => img !== null);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Add a 2-second delay
        const compositeImageUrl = await createCompositeImage(validSwappedImages);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Add a 2-second delay
        return NextResponse.json({ images: validSwappedImages, compositeImageUrl });
    } catch (error) {
        console.error("Face swap API error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
