// app/api/manga/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Manga from '@/models/Manga';

// ----------------------------------------------------------------------
// دالة POST (لإضافة مانجا جديدة) - هذه الدالة تم تقديمها مسبقاً
// ----------------------------------------------------------------------
/*
export async function POST(request: Request) { ... }
*/

// ----------------------------------------------------------------------
// 🆕 دالة GET (لجلب قائمة المانجا وصفحة البداية)
// ----------------------------------------------------------------------
export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort'); // لاستقبال معامل الفرز (مثل: latest, views)
    const type = searchParams.get('type'); // لاستقبال معامل التصفية (مثل: Manhwa, Manga)
    const search = searchParams.get('search'); // لاستقبال كلمة البحث

    // بناء كائن الشروط (Query Criteria)
    const criteria: any = {};
    if (type) {
      criteria.type = type;
    }
    if (search) {
        // البحث باستخدام تعبير عادي (Case-insensitive search)
        criteria.$or = [
            { title_ar: { $regex: search, $options: 'i' } },
            { title_en: { $regex: search, $options: 'i' } },
        ];
    }

    // بناء كائن الفرز (Sort Criteria)
    let sortCriteria: any = { createdAt: -1 }; // الافتراضي: حسب الأحدث إنشاءً
    if (sort === 'views') {
      sortCriteria = { views: -1 }; // الأكثر مشاهدة
    } else if (sort === 'chapters') {
        // الفرز حسب آخر تحديث للفصل
        sortCriteria = { 'chapters.releaseDate': -1 };
    }
    
    // جلب البيانات:
    // نستخدم .find() مع الشروط، ثم .sort() للفرز.
    // نستخدم .limit(30) للحد من عدد العناصر في الصفحة الواحدة (يمكن تطبيق Pagination لاحقاً).
    const mangas = await Manga.find(criteria)
      .sort(sortCriteria)
      .limit(30)
      // نختار فقط الحقول الضرورية للقائمة لتقليل حجم البيانات المنقولة
      .select('title_ar title_en slug cover_url status type author views chapters.number chapters.releaseDate') 
      .lean(); // لتحويل مستندات Mongoose إلى كائنات JavaScript عادية أسرع

    // تنسيق قائمة الفصول (نظهر فقط أحدث فصل في كل عمل)
    const formattedMangas = mangas.map(manga => {
        // فرز الفصول داخل كل مانجا حسب رقم الفصل للحصول على الأحدث
        const latestChapter = manga.chapters.sort((a, b) => b.number - a.number)[0];

        return {
            ...manga,
            chapters: undefined, // إزالة قائمة الفصول الأصلية
            latest_chapter: latestChapter ? latestChapter.number : 0,
            latest_chapter_date: latestChapter ? latestChapter.releaseDate : manga.createdAt,
        };
    });


    return NextResponse.json({ 
      success: true, 
      count: formattedMangas.length,
      data: formattedMangas 
    }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ 
      success: false, 
      message: 'فشل في جلب قائمة المانجا', 
      error: error.message 
    }, { status: 500 });
  }
}
