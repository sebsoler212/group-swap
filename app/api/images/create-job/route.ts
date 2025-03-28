import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

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

        const { faceObjs: faces, templateId, type }: { faceObjs: any[]; templateId: string; type: string } = await request.json();

        if (!templateId) {
            return NextResponse.json({ error: 'Missing template' }, { status: 400 });
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

        const { data, error } = await supabase.from('jobs').insert({
            id: uuidv4(),
            user_id: userId,
            type: type,
            template_id: templateId,
            status: 'pending'
        })
        .select();
    
        if (error) {
            console.error('Error inserting into faces table:', error);
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        } else {
            const insertedId = data?.[0]?.id;
            console.log('Inserted job ID:', insertedId);
        }

        
        

        //TODO:
        // Create Job
        // For each face in faces, create facesjob row
        
        /*
        const { error: updateError } = await supabase
            .from("faces")
            .update({ display: false })
            .match({ id: faceRowId, user_id: userId });

        if (updateError) {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
        }
        */

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error('Error in detect-faces POST route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}