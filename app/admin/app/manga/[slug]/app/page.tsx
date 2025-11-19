// app/manga/[slug]/[chapterNumber]/page.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Home, List, ChevronDown } from 'lucide-react';

// تعريف واجهة البيانات التي يتوقعها المكون
interface ChapterData {
    mangaTitle: string;
    chapterNumber: number;
    chapterTitle: string;
    pages: string[]; // قائمة بروابط صور الصفحات
    navigation: {
        prevChapter: number | null;
        nextChapter: number | null;
    };
}

// ----------------------------------------------------
// 1. دالة جلب البيانات (تنفذ على الخادم)
// ----------------------------------------------------
async function fetchChapterContent(slug: string, chapterNumber: string): Promise<ChapterData | null> {
    const API_URL = process.g.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    try {
        // الاتصال بنقطة الوصول: /api/manga/[slug]/[chapterNumber]
        const response = await fetch(`${API_URL}/api/manga/${slug}/${chapterNumber}`, { 
            cache: 'no-store' 
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error('فشل جلب محتوى الفصل من الـ API');
        }

        const data = await response.json();
        return data.data || null;
        
    } catch (error) {
        console.error(`Error fetching chapter ${chapterNumber} for ${slug}:`, error);
        return null; 
    }
}


// ----------------------------------------------------
// 2. شريط التنقل (Navigation Bar)
// ----------------------------------------------------
interface ReaderNavProps {
    mangaSlug: string;
    data: ChapterData;
}

const ReaderNavigationBar: React.FC<ReaderNavProps> = ({ mangaSlug, data }) => (
    <div className="sticky top-0 z-10 bg-[#1a1c23] border-b border-gray-700 py-3 shadow-md" dir="rtl">
        <div className="container mx-auto px-4 flex justify-between items-center max-w-4xl">
            
            {/* 1. زر الفصل السابق */}
            <Link 
                href={data.navigation.prevChapter ? `/manga/${mangaSlug}/${data.navigation.prevChapter}` : '#'}
                className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm ${
                    data.navigation.prevChapter 
                        ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                <ArrowRight className="w-4 h-4" />
                السابق
            </Link>

            {/* 2. معلومات الفصل */}
            <div className="text-white text-center flex-1 mx-4">
                <p className="text-base font-bold text-yellow-400 truncate">{data.mangaTitle}</p>
                <p className="text-sm font-light text-gray-400 truncate">فصل {data.chapterNumber} {data.chapterTitle && `- ${data.chapterTitle}`}</p>
            </div>
            
            {/* 3. زر الفصل التالي */}
            <Link 
                href={data.navigation.nextChapter ? `/manga/${mangaSlug}/${data.navigation.nextChapter}` : '#'}
                className={`flex items-center gap-1 px-3 py-1 rounded transition-colors text-sm ${
                    data.navigation.nextChapter 
                        ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
            >
                التالي
                <ArrowLeft className="w-4 h-4" />
            </Link>
            
            {/* 4. قائمة الفصول */}
            <Link 
                href={`/manga/${mangaSlug}`}
                title="العودة لصفحة التفاصيل"
                className="hidden sm:flex items-center ml-4 p-2 rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
            >
                <List className="w-5 h-5" />
            </Link>
        </div>
    </div>
);


// ----------------------------------------------------
// 3. المكون الرئيسي لصفحة القارئ (Server Component)
// ----------------------------------------------------
export default async function ChapterReaderPage({ params }: { params: { slug: string, chapterNumber: string } }) {
    const mangaSlug = params.slug;
    const chapterNumber = params.chapterNumber;
    
    const chapterData = await fetchChapterContent(mangaSlug, chapterNumber);

    // إذا لم يتم العثور على الفصل أو المانجا
    if (!chapterData) {
        return (
            <div className="min-h-screen bg-[#1a1c23] flex items-center justify-center p-8" dir="rtl">
                <div className="text-center bg-[#292c35] p-10 rounded-xl shadow-2xl text-white">
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h1 className="text-2xl font-bold mb-2">عذراً، لم يتم العثور على الفصل</h1>
                    <p className="text-gray-400">الفصل **{chapterNumber}** للعمل **{mangaSlug}** غير موجود.</p>
                    <Link href="/manga-list" className="mt-6 inline-block text-yellow-500 hover:underline">
                        العودة إلى قائمة الأعمال
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-[#111111]" dir="rtl">
            
            {/* شريط التنقل العلوي */}
            <ReaderNavigationBar mangaSlug={mangaSlug} data={chapterData} />

            {/* محتوى الفصل (صور الصفحات) */}
            <div className="container mx-auto px-1 md:px-0 max-w-4xl pt-4 pb-16">
                
                {chapterData.pages.length === 0 ? (
                    <p className="text-gray-400 text-center py-20">لا توجد صور لهذا الفصل حالياً.</p>
                ) : (
                    <div className="space-y-1">
                        {chapterData.pages.map((url, index) => (
                            <div key={index} className="relative w-full shadow-lg">
                                {/* استخدام Image من Next.js ضروري لتحسين الأداء */}
                                <Image 
                                    src={url} 
                                    alt={`صفحة ${index + 1}`} 
                                    // يجب إضافة 'unoptimized' في حال استخدام روابط خارجية غير موثوقة
                                    // إذا كنت تستخدم منصة مثل Cloudinary، يمكنك إزالتها
                                    unoptimized
                                    width={800} // قيمة افتراضية للعرض
                                    height={1200} // قيمة افتراضية للارتفاع
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* شريط التنقل السفلي (نسخة مكررة لتسهيل التنقل بعد الانتهاء من القراءة) */}
            <div className="fixed bottom-0 left-0 right-0">
                <ReaderNavigationBar mangaSlug={mangaSlug} data={chapterData} />
            </div>

        </div>
    );
}
