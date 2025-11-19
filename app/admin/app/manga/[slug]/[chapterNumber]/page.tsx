// app/manga/[slug]/page.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, BarChart, Hash, CheckCircle, Tag, TrendingUp } from 'lucide-react';

// بيانات وهمية للمانجا (في الواقع ستجلب البيانات من الـ API باستخدام الـ slug)
const MOCK_MANGA_DATA = {
  title_ar: 'سولو ليفلينج',
  title_en: 'Solo Leveling',
  cover_url: '/images/solo-leveling/cover.jpg', // ضع رابط الغلاف هنا
  slug: 'solo-leveling',
  description: "اكتشف ما سيحدث عندما يتحول أضعف صياد في العالم إلى الأقوى، ويحارب وحوش الأبعاد الأخرى ليحمي البشرية. تبدأ القصة عندما يكتسب البطل نظاماً غامضاً يسمح له برفع مستواه دون حدود، مما يضعه على مسار لا عودة فيه.",
  status: 'مكتمل',
  type: 'مانهوا (Webtoon)',
  author: 'Chugong',
  rating: 4.8,
  views: '4.5M',
  genres: ['أكشن', 'خيال', 'إيسيكاي', 'مغامرات', 'قوى خارقة'],
  // قائمة الفصول (مرتبة عكسياً لعرض الأحدث أولاً)
  chapters: [
    { number: 200, title: 'النهاية العظيمة', date: '2023-01-15' },
    { number: 199, title: 'اللقاء الأخير', date: '2023-01-08' },
    { number: 198, title: 'صعود الملك', date: '2023-01-01' },
    { number: 197, title: 'الظلال تهاجم', date: '2022-12-25' },
    { number: 1, title: 'البداية', date: '2019-03-01' },
  ],
};

export default function MangaDetailPage() {
  const { title_ar, title_en, cover_url, description, status, type, author, rating, views, genres, chapters, slug } = MOCK_MANGA_DATA;

  // دالة لعرض تاريخ نشر بسيط
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#1a1c23] text-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* --- قسم الغلاف والمعلومات الأساسية --- */}
        <div className="flex flex-col md:flex-row gap-8 bg-[#292c35] p-6 rounded-xl shadow-xl">
          
          {/* الغلاف */}
          <div className="w-full md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              {/* يجب استبدال الرابط الفعلي ليعمل */}
              <Image 
                src={cover_url} 
                alt={title_ar} 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          </div>
          
          {/* التفاصيل والوصف */}
          <div className="flex-grow">
            <h1 className="text-4xl font-extrabold text-yellow-400 mb-2">{title_ar}</h1>
            <p className="text-gray-400 text-lg mb-4 italic">{title_en}</p>

            {/* الإحصائيات والأيقونات */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-sm">
                <p className="flex items-center gap-2 text-green-400"><CheckCircle className="w-4 h-4" /> الحالة: <span>{status}</span></p>
                <p className="flex items-center gap-2 text-blue-400"><BookOpen className="w-4 h-4" /> النوع: <span>{type}</span></p>
                <p className="flex items-center gap-2 text-purple-400"><Tag className="w-4 h-4" /> المؤلف: <span>{author}</span></p>
                <p className="flex items-center gap-2 text-red-400"><BarChart className="w-4 h-4" /> المشاهدات: <span>{views}</span></p>
            </div>

            {/* الملخص */}
            <h2 className="text-xl font-semibold border-b border-gray-600 pb-2 mb-3 text-yellow-400">
              القصة والملخص
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              {description}
            </p>

            {/* التصنيفات */}
            <div className="flex flex-wrap gap-2 mb-6">
              {genres.map(genre => (
                <span 
                  key={genre}
                  className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-xs font-medium hover:bg-yellow-500 hover:text-black transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>

             {/* زر القراءة الفوري */}
            {chapters.length > 0 && (
                <Link
                    href={`/manga/${slug}/${chapters[0].number}`}
                    className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-extrabold py-3 rounded-lg text-lg transition-colors shadow-lg shadow-yellow-500/50 mt-4"
                >
                    <BookOpen className="w-5 h-5" />
                    ابدأ القراءة من الفصل الأحدث (فصل {chapters[0].number})
                </Link>
            )}
            
          </div>
        </div>

        {/* --- قسم قائمة الفصول --- */}
        <div className="mt-10 bg-[#292c35] p-6 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-600 pb-2">
            جميع الفصول ({chapters.length})
          </h2>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {chapters.map((chapter) => (
              <Link 
                key={chapter.number}
                href={`/manga/${slug}/${chapter.number}`}
                className="flex items-center justify-between p-4 bg-[#1a1c23] rounded-lg hover:bg-[#23262e] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <BookOpen className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-medium text-white group-hover:text-yellow-400">
                    فصل {chapter.number} {chapter.title && `- ${chapter.title}`}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                   <Calendar className="w-4 h-4" />
                   <span>{formatDate(chapter.date)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
