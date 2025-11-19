// app/api/manga/[slug]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Manga from '@/models/Manga';

// ----------------------------------------------------------------------
// 🆕 دالة GET (لجلب تفاصيل مانجا محددة)
// ----------------------------------------------------------------------
export async function GET(
  request: Request,
  { params }: { params: { slug: string } } // استلام الـ slug من الرابط
) {
  await dbConnect();

  try {
    const slug = params.slug;

    // 1. البحث عن المانجا باستخدام الـ slug
    // نستخدم .select('-chapters.pages') لكي لا نجلب روابط صور الصفحات
    // (حتى لا تكون البيانات ضخمة جداً في صفحة التفاصيل)
    const manga = await Manga.findOne({ slug })
      .select('-chapters.pages') // استبعاد روابط الصفحات
      .lean();

    if (!manga) {
      return NextResponse.json({ 
        success: false, 
        message: `لم يتم العثور على مانجا بالرابط المختصر: ${slug}` 
      }, { status: 404 });
    }

    // 2. فرز الفصول تصاعدياً أو تنازلياً حسب رقم الفصل (لتسهيل عرضها)
    // هنا نفرز تنازلياً (الأحدث أولاً)
    manga.chapters.sort((a, b) => b.number - a.number); 

    // 3. إرجاع بيانات المانجا كاملة
    return NextResponse.json({ 
      success: true, 
      data: manga 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching manga details:", error);
    return NextResponse.json({ 
      success: false, 
      message: 'فشل في جلب تفاصيل المانجا', 
      error: error.message 
    }, { status: 500 });
  }
}
