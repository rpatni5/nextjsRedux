// /app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">NextJs</div>
      <div className="space-x-6">
        <Link href="/home">Home</Link>
        <Link href="/about">About</Link>
        <button
          onClick={() => router.push('/register')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
        <button
          onClick={() => router.push('/login')}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </div>
    </nav>
  );
}
