'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useBlogPostBySlug } from '@/lib/api';

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { data: post, isLoading } = useBlogPostBySlug(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C8954A]" />
        <p className="mt-4 text-[#030213] font-medium animate-pulse text-sm">Đang tải nội dung bài viết...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <p className="text-[#030213] font-medium text-lg mb-4">Không tìm thấy bài viết</p>
          <Link href="/blog" className="px-6 py-2.5 bg-[#C8954A] text-white rounded-xl hover:bg-[#B8854A] transition-colors font-semibold text-sm">
            Quay lại trang Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-850">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#717182] mb-8 font-medium">
          <Link href="/" className="hover:text-[#C8954A] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-[#C8954A] transition-colors">
            Blog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#030213] truncate max-w-[200px] sm:max-w-[400px]">{post.title}</span>
        </div>

        {/* Post Header */}
        <div className="mb-8">
          <span className="inline-block bg-[#E07B54] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
            {post.topic}
          </span>
          <h1 className="heading text-3xl sm:text-4xl text-[#030213] font-extrabold mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#717182] font-semibold border-y border-[#E8E0D5]/50 py-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C8954A]" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C8954A]" />
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* Post Image */}
        <div className="rounded-2xl overflow-hidden shadow-md aspect-[16/9] mb-10 bg-gray-50 border border-gray-100">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Post Content */}
        <article className="prose prose-lg max-w-none bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E8E0D5]/30 leading-relaxed text-[#49495A] mb-12">
          {/* Excerpt */}
          <p className="text-lg font-medium text-[#030213] italic border-l-4 border-[#C8954A] pl-4 mb-6 leading-relaxed bg-[#FAF7F2]/40 py-2.5 rounded-r">
            {post.excerpt}
          </p>
          
          {/* Detail content */}
          <div 
            className="space-y-4 text-justify"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </article>

        {/* Back Link */}
        <div className="border-t border-[#E8E0D5]/40 pt-8 flex">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-[#C8954A] hover:text-[#B8854A] font-bold transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang cảm hứng
          </Link>
        </div>
      </div>
    </div>
  );
}
