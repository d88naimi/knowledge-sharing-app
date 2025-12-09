import Link from "next/link";
import { BookOpen, Code, GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Knowledge Hub
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover, share, and learn from a community of developers. Access
          articles, code snippets, and curated learning resources.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/articles"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            Get Started
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/auth/signin"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-20">
        <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Articles</h3>
          <p className="text-gray-600 mb-4">
            Read and share in-depth articles on various programming topics and
            best practices.
          </p>
          <Link
            href="/articles"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            Browse Articles
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Code className="text-green-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Code Snippets</h3>
          <p className="text-gray-600 mb-4">
            Find and share useful code snippets with syntax highlighting in
            multiple languages.
          </p>
          <Link
            href="/code-snippets"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            View Snippets
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <GraduationCap className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-3">Learning Resources</h3>
          <p className="text-gray-600 mb-4">
            Discover curated learning materials including courses, tutorials,
            and documentation.
          </p>
          <Link
            href="/learning-resources"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            Explore Resources
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
