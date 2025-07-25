import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  images: {
    domains: [
      'static.vecteezy.com',
      'cdni.iconscout.com',
      'www.pngall.com',
      'ouch-cdn2.icons8.com',
    ],
  },
};

export default withAnalyzer(nextConfig);