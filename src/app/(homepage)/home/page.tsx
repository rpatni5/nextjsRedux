// /app/home/page.tsx
import Navbar from "../navbarlinks/navbarlinks";

export const metadata = {
  title: 'NextJs - Secure Password Manager',
  description: 'Safely manage and store your passwords with NextJs.',
  openGraph: {
    title: 'NextJs',
    description: 'Safely manage and store your passwords with NextJs.',
    url: 'https://yourdomain.com/home',
    siteName: 'NextJs',
    images: [
      {
        url: 'https://yourdomain.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">Next Js Project</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl">
          Securely store and manage your passwords and sensitive information.
          Redux is very powerful as a state management solution. It’s been around for a while and has excellent community support.

        </p>
        <div className="space-x-4">
          <a
            href="/register"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="/about"
            className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </main>
    </div>
  );
}

