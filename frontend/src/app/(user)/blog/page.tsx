'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useBlogPosts } from '@/lib/api';
import { useState, useMemo } from 'react';

export default function BlogPage() {
  const { data: blogPosts = [], isLoading } = useBlogPosts();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  // Build topics list dynamically from real data
  const topics = useMemo(() => {
    const topicMap = new Map<string, string>();
    blogPosts.forEach((p) => {
      if (p.topicSlug && p.topic) topicMap.set(p.topicSlug, p.topic);
    });
    return [
      { slug: 'all', name: 'Tất cả' },
      ...Array.from(topicMap.entries()).map(([slug, name]) => ({ slug, name })),
    ];
  }, [blogPosts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8954A]" />
        <p className="mt-4 text-[#030213] font-medium animate-pulse text-sm">Đang tải cảm hứng thiết kế...</p>
      </div>
    );
  }

  const filteredPosts =
    selectedTopic === 'all' ? blogPosts : blogPosts.filter((p) => p.topicSlug === selectedTopic);

  const featuredPost = blogPosts.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <div className="bg-[#FAF7F2] pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="heading text-4xl text-[#1E3A5F] mb-4">Cảm hứng & Phong cách sống</h1>
          <p className="text-[#888888] mb-8">
            Khám phá các bài viết về xu hướng nội thất, cách bày trí và phong cách sống hiện đại
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {topics.map((topic) => (
              <button
                key={topic.slug}
                onClick={() => setSelectedTopic(topic.slug)}
                className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer ${
                  selectedTopic === topic.slug
                    ? 'bg-[#C8954A] text-white'
                    : 'bg-white text-[#1E3A5F] hover:bg-[#E8E0D5]'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        {/* Featured Post */}
        {featuredPost && selectedTopic === 'all' && (
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="grid md:grid-cols-11 gap-8 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-12 group"
          >
            <div className="md:col-span-6 overflow-hidden">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
            </div>
            <div className="md:col-span-5 p-8 flex flex-col justify-center">
              <span className="inline-block bg-[#E07B54] text-white text-xs px-3 py-1 rounded-full mb-4 w-fit">
                {featuredPost.topic}
              </span>
              <h2 className="heading text-3xl text-[#1E3A5F] mb-4 group-hover:text-[#C8954A] transition-colors">{featuredPost.title}</h2>
              <p className="text-[#888888] mb-6 line-clamp-3 leading-relaxed">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-[#888888] border-t border-[#E8E0D5]/50 pt-4">
                <span>{featuredPost.date}</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <div className="text-[#C8954A] flex items-center gap-2 mt-4 font-medium">
                Đọc thêm <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <span className="inline-block bg-[#E07B54] text-white text-xs px-3 py-1 rounded-full mb-3">
                  {post.topic}
                </span>
                <h3 className="heading text-lg text-[#1E3A5F] mb-2 group-hover:text-[#C8954A] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-[#888888] mb-4 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                <p className="text-xs text-[#888888]">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
