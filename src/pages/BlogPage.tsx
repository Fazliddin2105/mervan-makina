import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/mockData';
import { BlogPost } from '../types';
import { X, Clock, User, Tag, ArrowLeft } from 'lucide-react';
import { PageBanner } from '../components/PageBanner';

export const BlogPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-sans space-y-10">
      
      <PageBanner
        eyebrow="MAQOLALAR VA MASLAHATLAR"
        title="Texnik xizmat qo'llanmalari va obyekt boshqaruvi"
        subtitle="Pol yuvish va supurish texnikasini tanlash, batareyaga qarash va kundalik parvarish bo'yicha texnik maqolalar."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <div 
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="surface-interactive overflow-hidden flex flex-col justify-between group"
          >
            <div className="h-52 overflow-hidden bg-slate-100">
              <img 
                src={post.image} 
                alt={post.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200 uppercase font-bold">{post.category}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> <span className="tabular">{post.readTime}</span></span>
                </div>

                <h3 className="font-extrabold text-[#0B1D3F] text-base group-hover:text-blue-600 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-blue-700 flex items-center justify-between">
                <span className="group-hover:translate-x-1 transition-transform">Maqolani o'qish →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Drawer Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative surface shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 p-6 sm:p-10 space-y-6">
            
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="space-y-2">
              <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-full border border-blue-200 uppercase">
                {selectedPost.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1D3F]">
                {selectedPost.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                <span>Muallif: {selectedPost.author} ({selectedPost.authorRole})</span>
                <span>•</span>
                <span className="tabular">{selectedPost.date}</span>
              </div>
            </div>

            <img 
              src={selectedPost.image} 
              alt="" 
              className="w-full h-64 object-cover rounded-2xl border border-slate-200" 
              referrerPolicy="no-referrer"
            />

            <div className="prose prose-slate text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
              {selectedPost.content}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="btn-secondary"
              >
                Maqolani yopish
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
