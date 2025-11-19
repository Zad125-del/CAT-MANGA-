// app/admin/upload-chapter/page.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { Upload, Trash2, BookOpen, X, ChevronDown, Check } from 'lucide-react';

// بيانات وهمية للمانجا (في الواقع ستجلبها من قاعدة البيانات)
const MANGAS_OPTIONS = [
    { id: '1', title_ar: 'سولو ليفلينج', title_en: 'Solo Leveling' },
    { id: '2', title_ar: 'ون بيس', title_en: 'One Piece' },
    { id: '3', title_ar: 'قاتل الشياطين', title_en: 'Demon Slayer' },
];

export default function UploadChapterPage() {
    const [selectedMangaId, setSelectedMangaId] = useState(MANGAS_OPTIONS[0].id);
    const [chapterNumber, setChapterNumber] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // دالة للتعامل مع اختيار الملفات
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    // دالة لإزالة ملف معين
    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // دوال التعامل مع السحب والإفلات (Drag and Drop)
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
            e.dataTransfer.clearData();
        }
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("الرجاء إضافة صور صفحات الفصل!");
            return;
        }
        // في الوضع الفعلي: هنا سيتم إرسال كل الملفات والبيانات إلى الـ API
        console.log("Chapter Data:", { selectedMangaId, chapterNumber, chapterTitle, files });
        alert(`جاري رفع ${files.length} صفحة للفصل رقم ${chapterNumber}... (راجع الكونسول)`);
        // يمكن هنا إضافة كود تنظيف النموذج وإعادة التوجيه
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="min-h-screen bg-[#1a1c23] p-8" dir="rtl">
            <div className="max-w-4xl mx-auto bg-[#292c35] p-6 md:p-10 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-gray-600 pb-3">
                    رفع فصل جديد للعمل 
                </h1>

                <form onSubmit={handleSubmit}>
                    
                    {/* معلومات الفصل الأساسية */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* اختيار المانجا */}
                        <div className="relative">
                            <label htmlFor="manga" className="block text-sm font-medium text-gray-300 mb-1">
                                اختيار العمل <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="manga"
                                value={selectedMangaId}
                                onChange={(e) => setSelectedMangaId(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-[#1a1c23] border border-gray-600 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-white transition-colors appearance-none"
                            >
                                {MANGAS_OPTIONS.map(m => (
                                    <option key={m.id} value={m.id}>{m.title_ar} ({m.title_en})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute left-3 top-9 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                        
                        {/* رقم الفصل */}
                        <div>
                            <label htmlFor="number" className="block text-sm font-medium text-gray-300 mb-1">
                                رقم الفصل <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="number"
                                value={chapterNumber}
                                onChange={(e) => setChapterNumber(e.target.value)}
                                required
                                className="w-full px-3 py-2 bg-[#1a1c23] border border-gray-600 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-white transition-colors"
                            />
                        </div>

                        {/* عنوان الفصل (اختياري) */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                                عنوان الفصل (اختياري)
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={chapterTitle}
                                onChange={(e) => setChapterTitle(e.target.value)}
                                className="w-full px-3 py-2 bg-[#1a1c23] border border-gray-600 rounded-lg focus:ring-yellow-400 focus:border-yellow-400 text-white transition-colors"
                            />
                        </div>
                    </div>
                    
                    {/* منطقة سحب وإفلات الملفات */}
                    <div 
                        className={`
                            border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 mb-6
                            ${isDragging 
                                ? 'border-yellow-500 bg-[#2f323c] shadow-lg' 
                                : 'border-gray-600 bg-[#23262e] hover:border-yellow-500/50'
                            }
                        `}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer block">
                            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-300 font-bold mb-1">
                                اسحب صور صفحات الفصل وأفلتها هنا
                            </p>
                            <p className="text-gray-400 text-sm">
                                أو اضغط للاختيار (JPG, PNG, WEBP)
                            </p>
                        </label>
                    </div>

                    {/* قائمة الملفات المضافة */}
                    <h3 className="text-xl text-white font-semibold mb-3">
                        صفحات الفصل ({files.length} صورة)
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {files.length === 0 ? (
                            <p className="text-gray-500">
                                لم يتم اختيار أي ملف بعد.
                            </p>
                        ) : (
                            files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-[#1a1c23] rounded-lg border border-gray-700 hover:border-yellow-500/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <BookOpen className="w-5 h-5 text-yellow-400" />
                                        <div>
                                            <p className="text-sm font-medium text-white truncate max-w-xs">{file.name}</p>
                                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-500/10 transition-colors"
                                        aria-label={`Remove file ${file.name}`}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {/* زر الرفع */}
                    <button
                        type="submit"
                        disabled={files.length === 0}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-400 text-white font-extrabold py-3 rounded-lg text-lg transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center gap-2 mt-6"
                    >
                        <Upload className="w-5 h-5" />
                        رفع الفصل والصفحات
                    </button>
                </form>
            </div>
        </div>
    );
}
