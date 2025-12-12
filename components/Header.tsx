"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen, Code, GraduationCap, LogOut, User } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ 
      redirect: false,
      callbackUrl: "/auth/signin" 
    });
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-slate-900">
              Knowledge Hub
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/articles"
                className="flex items-center space-x-1 text-gray-700 hover:text-slate-900 transition"
              >
                <BookOpen size={18} />
                <span>Articles</span>
              </Link>
              <Link
                href="/code-snippets"
                className="flex items-center space-x-1 text-gray-700 hover:text-slate-900 transition"
              >
                <Code size={18} />
                <span>Code Snippets</span>
              </Link>
              <Link
                href="/learning-resources"
                className="flex items-center space-x-1 text-gray-700 hover:text-slate-900 transition"
              >
                <GraduationCap size={18} />
                <span>Resources</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User size={18} />
                  <span>{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
