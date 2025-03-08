import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // Supabase Functionsをビルドプロセスから除外
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'supabase'];

    // Supabaseディレクトリを無視
    config.module.rules.push({
      test: /supabase\/functions\/.*/,
      use: 'ignore-loader',
    });

    return config;
  },
};

export default nextConfig;
