// app/manga-list/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ListFilter, SortAsc, BookOpen, Clock, BarChart, ChevronDown, CheckCircle } from 'lucide-react';

// بيانات وهمية لقائمة المانجا
const MOCK_MANGA_LIST = [
    { id: 1, title: 'سولو ليفلينج', slug: 'solo-leveling', cover: '/images/covers/solo-leveling.jpg', latest_chapter: 201, status: 'مكتمل', type: 'مانهوا', views: 4500000, genres: ['أكشن', 'خيال'] },
    { id: 2, title: 'ون بيس', slug: 'one-piece', cover: '/images/covers/one-piece.jpg', latest_chapter: 1100, status: 'مستمر', type: 'مانجا', views: 3200000, genres: ['مغامرات', 'أكشن'] },
    { id: 3, title: 'هجوم العمالقة', slug: 'aot', cover: '/images/covers/aot.jpg', latest_chapter: 139, status: 'مكتمل', type: 'مانجا', views: 5100000, genres: ['دراما', 'أكشن'] },
    { id: 4, title: 'برج الإله', slug: 'tower-of-god', cover: '/images/covers/tower-of-god.jpg', latest_chapter: 570, status: 'مستمر', type: 'مانهوا', views: 2800000, genres: ['خيال', 'مغامرات'] },
    { id: 5, title: 'قاتل الشياطين', slug: 'demon-slayer', cover: '/images/covers/demon-slayer.jpg', latest_chapter: 205, status: 'مكتمل', type: 'مانجا', views: 4000000, genres: ['أكشن', 'خيال'] },
    { id: 6, title: 'المشعوذة', slug: 'witch-hat', cover: '/images/covers/witch-hat.jpg', latest_chapter: 55, status: 'مستمر', type: 'مانجا', views: 1500000, genres: ['خيال', 'دراما'] },
    // تكرار البيانات الوهمية لعرض المزيد من العناصر
    ...Array(10).fill(MOCK_MANGA_LIST[1]).map((m, i) => ({...m, id: 10 + i, title: `ون بيس - وهمي ${i+1}`})),
];

const GENRES = ['أكشن', 'مغامرات', 'دراما', 'رومانسي', 'خيال', 'إيسيكاي', 'كوميدي', 'غموض'];

// المكون الفرعي لبطاقة المانجا في القائمة
const MangaCard = ({ manga }: { manga: typeof MOCK_MANGA_LIST[0] }) => (
    <Link href={`/manga/${manga.slug}`} className="flex gap-4 p-4 bg-[#292c35] rounded-xl hover:bg-[#343743] transition-colors shadow-lg group">
        
        {/* الغلاف */}
        <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
            <Image src={manga.cover} alt={manga.title} fill className="object-cover" />
        </div>

        {/* التفاصيل */}
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">{manga.title}</h3>
            
            {/* الأيقونات والمعلومات */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1 text-sm text-gray-400">
                <p className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> نوع العمل: <span className="text-white">{manga.type}</span></p>
                <p className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-400" /> الحالة: <span className="text-white">{manga.status}</span></p>
                <p className="flex items-center gap-1"><BarChart className="w-4 h-4 text-red-400" /> المشاهدات: <span className="text-white">{(manga.views / 1000000).toFixed(1)}M</span></p>
                <p className="flex items-center gap-1"><Clock className="w-4 h-4" /> آخر فصل: <span className="text-white">{manga.latest_chapter}</span></p>
            </div>
            
            {/* التصنيفات */}
            <div className="flex flex-wrap gap-1 mt-2">
                {manga.genres.slice(0, 3).map(genre => (
                    <span key={genre} className="px-2 py-0.5 bg-gray-700 text-xs text-gray-300 rounded-full">{genre}</span>
                ))}
            </div>
        </div>
    </Link>
);


export default function MangaListPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [sortBy, setSortBy] = useState('views'); // الافتراضي: حسب المشاهدات

    // 1. التصفية (Filtering)
    const filteredList = MOCK_MANGA_LIST.filter(manga => {
        const matchesSearch = manga.title.includes(searchTerm);
        const matchesGenre = selectedGenre ? manga.genres.includes(selectedGenre) : true;
        const matchesType = selectedType ? manga.type === selectedType : true;
        return matchesSearch && matchesGenre && matchesType;
    });

    // 2. الفرز (Sorting)
    const sortedList = filteredList.sort((a, b) => {
        if (sortBy === 'latest_chapter') {
            return b.latest_chapter - a.latest_chapter; // الأحدث أولاً
        } else if (sortBy === 'views') {
            return b.views - a.views; // الأكثر مشاهدة أولاً
        }
        return 0;
    });

    return (
        <div className="min-h-screen bg-[#1a1c23] text-white py-8" dir="rtl">
            <div className="container mx-auto px-4 max-w-6xl">
                
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                    <ListFilter className="w-7 h-7 text-yellow-400" />
                    قائمة تصفح المانجا والمانهوا
                </h1>

                {/* --- شريط البحث والفلترة --- */}
                <div className="bg-[#292c35] p-6 rounded-xl shadow-xl mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        
                        {/* 1. خانة البحث */}
                        <div className="md:col-span-2 relative">
                            <input
                                type="text"
                                placeholder="اكتب اسم المانجا للبحث..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pr-10 pl-4 bg-[#1a1c23] border border-gray-600 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-white"
                            />
                            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                        </div>
                        
                        {/* 2. تصفية حسب النوع */}
                        <div className="relative">
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full py-2 px-3 bg-[#1a1c23] border border-gray-600 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-white appearance-none"
                            >
                                <option value="">كل الأنواع</option>
                                <option value="مانهوا">مانهوا (Webtoon)</option>
                                <option value="مانجا">مانجا (M
