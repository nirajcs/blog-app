import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Our Blog Platform
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Share your thoughts, read amazing stories, and connect with writers from around the world.
          </p>
          <div className="space-x-4">
            <Link 
              href="/posts" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Read Posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
