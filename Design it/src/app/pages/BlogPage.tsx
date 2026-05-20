import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/mockData';
import { useState } from 'react';

export function BlogPage() {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const topics = [
    { slug: 'all', name: 'Tất cả' },
    { slug: 'phong-cach-song', name: 'Phong cách sống' },
    { slug: 'huong-dan-bay-tri', name: 'Hướng dẫn bày trí' },
    { slug: 'tin-tuc', name: 'Tin tức' },
  ];

  const filteredPosts =
    selectedTopic === 'all' ? blogPosts : blogPosts.filter((p) => p.topicSlug === selectedTopic);

  const featuredPost = blogPosts.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero */}
      <div className="bg-[#FAF7F2] py-16">
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
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        {featuredPost && selectedTopic === 'all' && (
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="grid md:grid-cols-11 gap-8 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow mb-12"
          >
            <div className="md:col-span-6">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-5 p-8 flex flex-col justify-center">
              <span className="inline-block bg-[#E07B54] text-white text-xs px-3 py-1 rounded-full mb-4 w-fit">
                {featuredPost.topic}
              </span>
              <h2 className="heading text-3xl text-[#1E3A5F] mb-4">{featuredPost.title}</h2>
              <p className="text-[#888888] mb-6 line-clamp-3">{featuredPost.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-[#888888]">
                <span>{featuredPost.date}</span>
                <span>{featuredPost.readTime}</span>
              </div>
              <div className="text-[#C8954A] flex items-center gap-2 mt-4">
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
              to={`/blog/${post.slug}`}
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
                <p className="text-sm text-[#888888] mb-4 line-clamp-2">{post.excerpt}</p>
                <p className="text-xs text-[#888888]">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
