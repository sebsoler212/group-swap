import { NextResponse } from 'next/server';

const UPLOADCARE_BASE = 'https://ucarecdn.com';
const UPLOADCARE_UPLOAD_URL = 'https://upload.uploadcare.com/base/';
const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY!;

interface FaceResponse {
    faces: number[][];
}

async function uploadImageToUploadcare(imageUrl: string): Promise<string | null> {
    try {
        console.log('Fetching image from:', imageUrl);
        
        // Fetch the image as a Blob
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) throw new Error('Failed to fetch image.');

        const blob = await imageResponse.blob();
        const formData = new FormData();
        formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
        formData.append('store', '1');
        formData.append('file', blob, 'face.jpg'); // Upload as a file

        console.log('Uploading image blob to Uploadcare...');

        const response = await fetch(UPLOADCARE_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        const responseText = await response.text();
        console.log('Uploadcare Response:', responseText);

        try {
            const data = JSON.parse(responseText);
            return data.file ? `https://ucarecdn.com/${data.file}/face.jpg` : null;
        } catch (jsonError) {
            console.error('Uploadcare response is not valid JSON:', responseText);
            return null;
        }
    } catch (error) {
        console.error('Error uploading to Uploadcare:', error);
        return null;
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { imageUuid }: { imageUuid: string } = await request.json();
        if (!imageUuid) {
            return NextResponse.json({ error: 'Image UUID is required' }, { status: 400 });
        }

        // Detect faces (simple GET request, no headers required)
        const detectFacesUrl = `${UPLOADCARE_BASE}/${imageUuid}/detect_faces/`;
        const detectResponse = await fetch(detectFacesUrl);

        // Validate response type
        const contentType = detectResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await detectResponse.text();
            console.error('Unexpected response:', errorText);
            return NextResponse.json({ error: 'Invalid API response', details: errorText }, { status: 500 });
        }

        const { faces }: FaceResponse = await detectResponse.json();
        if (!faces || faces.length === 0) {
            return NextResponse.json({ message: 'No faces detected' }, { status: 200 });
        }

        // Define padding
        const PADDING = 150;

        // Generate cropped face URLs and upload them
        const uploadedFaces = await Promise.all(
            faces.map(async ([x, y, width, height]: number[], index: number) => {
                // Calculate expanded bounding box with padding
                const paddedX = Math.max(x - PADDING, 0);
                const paddedY = Math.max(y - PADDING, 0);
                const paddedWidth = width + 2 * PADDING;
                const paddedHeight = height + 2 * PADDING;
        
                // Construct the padded face URL
                const faceUrl = `${UPLOADCARE_BASE}/${imageUuid}/-/crop/${paddedWidth}x${paddedHeight}/${paddedX},${paddedY}/`;
                
                console.log('Uploading image to Uploadcare:', faceUrl);
        
                // Upload the cropped face image
                const uploadedUrl = await uploadImageToUploadcare(faceUrl);
        
                return { faceIndex: index + 1, faceUrl: uploadedUrl };
            })
        );

        await new Promise(resolve => setTimeout(resolve, 2000)); // Add a 2-second delay
        return NextResponse.json({ faces: uploadedFaces });
    } catch (error) {
        console.error('Error processing face detection:', error);
        return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
    }
}
