export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const UPLOADCARE_BASE = 'https://ucarecdn.com';
const UPLOADCARE_UPLOAD_URL = 'https://upload.uploadcare.com/base/';
const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface FaceResponse {
  faces: number[][];
}

async function uploadImageToUploadcare(
  imageUrl: string,
  group: string,
  userId: string,
  supabase: SupabaseClient<any, any, any>
): Promise<string | null> {
  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch image.');

    const blob = await imageResponse.blob();
    const formData = new FormData();
    formData.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUBLIC_KEY);
    formData.append('store', '1');
    formData.append('file', blob, 'face.jpg');

    const response = await fetch(UPLOADCARE_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    if (!result.file) throw new Error('Uploadcare failed');

    const uploadedUrl = `${UPLOADCARE_BASE}/${result.file}/face.jpg`;

    const { error } = await supabase.from('faces').insert({
      id: uuidv4(),
      user_id: userId,
      imgurl: uploadedUrl,
      group: group
    });

    if (error) {
      console.error('Error inserting into faces table:', error);
      return null;
    }

    return uploadedUrl;
  } catch (error) {
    console.error('uploadImageToUploadcare error:', error);
    return null;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Get the user's token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
    }

    // Authenticated Supabase client for the current user
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const userId = user.id;

    // Parse incoming JSON with the image UUID
    const { imageUuid, group }: { imageUuid: string, group: string } = await request.json();
    if (!imageUuid) {
      return NextResponse.json({ error: 'Missing imageUuid' }, { status: 400 });
    }

    // Run Uploadcare's face detection
    const detectFacesUrl = `${UPLOADCARE_BASE}/${imageUuid}/detect_faces/`;
    const detectResponse = await fetch(detectFacesUrl);
    const { faces }: FaceResponse = await detectResponse.json();

    if (!faces || faces.length === 0) {
      return NextResponse.json({ message: 'No faces detected' }, { status: 200 });
    }

    const PADDING = 150;
    const supabaseService = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Upload all cropped face images and save to DB
    const uploadedFaces = await Promise.all(
      faces.map(async ([x, y, width, height], index) => {
        const paddedX = Math.max(x - PADDING, 0);
        const paddedY = Math.max(y - PADDING, 0);
        const paddedWidth = width + 2 * PADDING;
        const paddedHeight = height + 2 * PADDING;

        const faceUrl = `${UPLOADCARE_BASE}/${imageUuid}/-/crop/${paddedWidth}x${paddedHeight}/${paddedX},${paddedY}/`;
        const uploadedUrl = await uploadImageToUploadcare(faceUrl, group, userId, supabaseService);

        return {
          faceIndex: index + 1,
          faceUrl: uploadedUrl,
        };
      })
    );

    return NextResponse.json({ faces: uploadedFaces });
  } catch (error) {
    console.error('Error in detect-faces POST route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
