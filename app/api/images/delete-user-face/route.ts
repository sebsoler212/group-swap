import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: Request): Promise<NextResponse> {
    try {
        // Get the user's token from Authorization header
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json({ error: 'Missing auth token' }, { status: 401 });
        }

        const { faceRowId }: { faceRowId: string } = await request.json();

        if (!faceRowId) {
            return NextResponse.json({ error: 'Missing face row id' }, { status: 400 });
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
    
        const { error: deleteError } = await supabase
            .from("faces")
            .delete()
            .match({ id: faceRowId, user_id: userId });

        if (deleteError) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error in detect-faces POST route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}