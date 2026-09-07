import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { defaultProposalConfig } from '@/config/proposalContent';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ansar@123';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('proposal_config')
      .select('config')
      .eq('id', 'default')
      .maybeSingle();

    if (error) {
      console.warn('Supabase query returned error (falling back to default template):', error.message);
      return NextResponse.json({
        success: true,
        config: defaultProposalConfig,
        fallback: true,
        error: error.message,
      });
    }

    if (data && data.config) {
      return NextResponse.json({
        success: true,
        config: data.config,
        fromDb: true,
      });
    }

    return NextResponse.json({
      success: true,
      config: defaultProposalConfig,
      fallback: true,
    });
  } catch (err: any) {
    console.error('API GET /api/config error:', err);
    return NextResponse.json({
      success: true,
      config: defaultProposalConfig,
      fallback: true,
      error: err?.message || 'Unknown error',
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { config, password } = body;

    // Verify static password with trimming and backward-compatibility
    const trimmedPass = (password || '').trim();
    const validPasswords = [
      'Ansar@123',
      'ansar@123',
      'borahae2026',
      process.env.ADMIN_PASSWORD
    ].filter(Boolean);

    const isAuthorized = validPasswords.some(
      (p) => p && p.trim() === trimmedPass
    );

    if (!isAuthorized) {
      console.warn(`[AUTH] Failed password attempt: "${trimmedPass}"`);
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Incorrect password. Use Ansar@123' },
        { status: 401 }
      );
    }

    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Missing configuration payload' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('proposal_config')
      .upsert({
        id: 'default',
        config,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        tableMissing: error.code === '42P01', // relation "proposal_config" does not exist
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API POST /api/config error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
