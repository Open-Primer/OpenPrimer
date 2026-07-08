import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

async function handleLoginInitiation(request: Request) {
  const url = new URL(request.url);
  let iss = url.searchParams.get('iss');
  let login_hint = url.searchParams.get('login_hint');
  let target_link_uri = url.searchParams.get('target_link_uri');
  let lti_message_hint = url.searchParams.get('lti_message_hint');
  let client_id = url.searchParams.get('client_id');

  if (request.method === 'POST') {
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        iss = (formData.get('iss') as string) || iss || '';
        login_hint = (formData.get('login_hint') as string) || login_hint || '';
        target_link_uri = (formData.get('target_link_uri') as string) || target_link_uri || '';
        lti_message_hint = (formData.get('lti_message_hint') as string) || lti_message_hint || '';
        client_id = (formData.get('client_id') as string) || client_id || '';
      } else if (contentType.includes('application/json')) {
        const body = await request.json();
        iss = body.iss || iss || '';
        login_hint = body.login_hint || login_hint || '';
        target_link_uri = body.target_link_uri || target_link_uri || '';
        lti_message_hint = body.lti_message_hint || lti_message_hint || '';
        client_id = body.client_id || client_id || '';
      }
    } catch (e) {
      console.error('[LTI-LOGIN] Failed to parse POST body in LTI login initiation:', e);
    }
  }

  if (!iss || !login_hint || !target_link_uri) {
    return new Response('Missing required parameters: iss, login_hint, or target_link_uri', { status: 400 });
  }

  // Lookup trust relationship in database
  let query = supabaseAdmin
    .from('lti_platforms')
    .select('issuer, client_id, auth_login_url, key_set_url')
    .eq('issuer', iss);
  
  if (client_id) {
    query = query.eq('client_id', client_id);
  }

  const { data: platform, error } = await query.maybeSingle();

  if (error || !platform) {
    console.error('[LTI-LOGIN] Platform trust relationship not found for:', { iss, client_id }, error);
    return new Response(`LTI Platform registration not found for issuer: ${iss}`, { status: 404 });
  }

  const state = crypto.randomUUID();
  const nonce = crypto.randomUUID();

  // Store state and nonce in secure SameSite=None HTTP-only cookies for iframe compatibility
  const cookieStore = await cookies();
  cookieStore.set('lti_state', state, {
    path: '/',
    maxAge: 300, // 5 minutes
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  });
  cookieStore.set('lti_nonce', nonce, {
    path: '/',
    maxAge: 300,
    secure: true,
    httpOnly: true,
    sameSite: 'none'
  });

  const authUrl = new URL(platform.auth_login_url);
  authUrl.searchParams.set('scope', 'openid');
  authUrl.searchParams.set('response_type', 'id_token');
  authUrl.searchParams.set('response_mode', 'form_post');
  authUrl.searchParams.set('client_id', platform.client_id);
  authUrl.searchParams.set('redirect_uri', `${url.origin}/api/lti/launch`);
  authUrl.searchParams.set('login_hint', login_hint);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('nonce', nonce);
  if (lti_message_hint) {
    authUrl.searchParams.set('lti_message_hint', lti_message_hint);
  }

  return NextResponse.redirect(authUrl.href);
}

export async function GET(request: Request) {
  return handleLoginInitiation(request);
}

export async function POST(request: Request) {
  return handleLoginInitiation(request);
}
