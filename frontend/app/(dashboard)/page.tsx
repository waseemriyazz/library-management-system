'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui';
import { fetchBooks } from '@/lib/api/books';
import { fetchAuthors } from '@/lib/api/authors';
import { fetchCategories } from '@/lib/api/categories';
import { fetchMembers } from '@/lib/api/members';

interface StatCard {
  label: string;
  value: number;
  href: string;
  color: string;
  icon: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Total Books', value: 0, href: '/books', color: 'bg-indigo-500', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { label: 'Total Authors', value: 0, href: '/authors', color: 'bg-emerald-500', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Total Categories', value: 0, href: '/categories', color: 'bg-amber-500', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { label: 'Total Members', value: 0, href: '/members', color: 'bg-rose-500', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [books, authors, categories, members] = await Promise.all([
          fetchBooks(),
          fetchAuthors(),
          fetchCategories(),
          fetchMembers(),
        ]);
        setStats((prev) =>
          prev.map((s) => {
            if (s.label === 'Total Books') return { ...s, value: books.length };
            if (s.label === 'Total Authors') return { ...s, value: authors.length };
            if (s.label === 'Total Categories') return { ...s, value: categories.length };
            if (s.label === 'Total Members') return { ...s, value: members.length };
            return s;
          })
        );
      } catch {
        // silently fail — stats stay at 0
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your library management system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1" />
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/books/new"
                className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700"
              >
                ➕ Add a New Book
              </Link>
              <Link
                href="/authors/new"
                className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-sm font-medium text-gray-700"
              >
                ➕ Add a New Author
              </Link>
              <Link
                href="/members/new"
                className="block w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors text-sm font-medium text-gray-700"
              >
                ➕ Register a New Member
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Application</span>
                <span className="font-medium text-gray-900">Library Management System</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Frontend</span>
                <span className="font-medium text-gray-900">Next.js 16</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span>Backend</span>
                <span className="font-medium text-gray-900">NestJS + SQLite</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Version</span>
                <span className="font-medium text-gray-900">1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}