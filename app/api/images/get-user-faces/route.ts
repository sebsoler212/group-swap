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
    
        const { data: faces, error } = await supabase
            .from("faces")
            .select("*")
            .eq("user_id", userId);

        if (error) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }

        const cleanFaces = faces.map(({ id, user_id, imgurl, created_at, group }) => ({
            faceIndex: id,
            faceUrl: imgurl,
            user_id,
            created_at,
            group
            
        }));

        return NextResponse.json({ cleanFaces });

    } catch (error) {
        console.error('Error in detect-faces POST route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}