import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // セッションの交換
    await supabase.auth.exchangeCodeForSession(code);

    // 認証成功後はダッシュボードにリダイレクト
    return NextResponse.redirect(new URL('/videos', request.url));
  }

  // codeがない場合はログインページにリダイレクト
  return NextResponse.redirect(new URL('/login', request.url));
}
