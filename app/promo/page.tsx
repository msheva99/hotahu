'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function PromoKuchKuch() {
  const [status, setStatus] = useState<'loading' | 'success' | 'already' | 'soldout'>('loading');
  const [remaining, setRemaining] = useState<number>(20);

  useEffect(() => {
    const checkPromo = async () => {
      try {
        const res = await fetch('/api/promo');
        const data = await res.json();
        setRemaining(data.remaining ?? 0);
        if (data.success) {
          setStatus('success');
        } else if (data.already) {
          setStatus('already');
        } else {
          setStatus('soldout');
        }
      } catch (e) {
        setStatus('soldout');
      }
    };
    checkPromo();
  }, []);

  const BackgroundWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 font-sans text-[#1a1a1a] overflow-hidden">
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image 
          src="/images/tampilan_diskonn.png" 
          alt="Background" 
          fill 
          priority 
          className="object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-yellow-500 font-bold text-sm">
        Memuat Penawaran Spesial...
      </div>
    );
  }

  if (status === 'success' || status === 'already') {
    return (
      <BackgroundWrapper>
        {/* p-6 diubah jadi pt-2 untuk menaikkan isi konten ke atas kotak */}
        <div className="w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(220,38,38,0.3)] text-center p-6 pt-7 animate-in fade-in zoom-in duration-500">
          
          {/* Logo dengan negative margin agar lebih naik */}
          <div className="relative w-28 h-14 mx-auto -mt-6 mb-0">
            <Image 
              src="/images/logo.png" 
              alt="Kuch-Kuch Hotahu" 
              fill 
              className="object-contain" 
            />
          </div>

          <div className="space-y-0">
            <h2 className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none">
              SELAMAT!
            </h2>
            <p className="text-[12px] font-bold text-gray-700 uppercase leading-tight">
              Kamu mendapatkan
            </p>
          </div>

          <div className="my-2">
            <h1 className="text-4xl font-black text-red-500 leading-none tracking-tighter">
              DISKON 15%
            </h1>
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter whitespace-nowrap mt-1">
              UNTUK SEMUA MENU KUCH KUCH HOTAHU
            </p>
          </div>

          <div className="bg-red-50 py-1 px-4 rounded-full inline-block mb-3">
            <p className="text-[10px] font-bold text-red-600">
              *Minimal pembelian Rp30.000
            </p>
          </div>

          {/* Lokasi Outlet */}
<div className="mb-2"> {/* Margin bawah dikurangi dari mb-3 ke mb-2 */}
  <a 
    href="https://maps.google.com" 
    target="_blank" 
    rel="noopener noreferrer"
    // py-2 diubah menjadi py-1.5 untuk menipiskan strip
    className="inline-flex items-center gap-2 border-2 border-yellow-100 bg-white rounded-2xl px-3 py-1.5 w-full shadow-sm hover:border-yellow-400 transition-all text-left"
  >
    {/* Ukuran ikon disesuaikan */}
    <span className="text-lg">📍</span> 
    <div>
      <p className="text-[10px] font-black text-gray-800 leading-none">Datang ke Outlet Kuch-Kuch</p>
      <p className="text-[8px] text-gray-500 font-medium">Cek lokasi terdekatmu di sini</p>
    </div>
  </a>
</div>

          {/* Kuota */}
          <div className="bg-yellow-400 rounded-2xl py-2.5 mb-3 text-black-700 shadow-inner">
            <div className="flex justify-center items-baseline gap-1">
              <span className="text-4xl font-black tabular-nums leading-none">
                {String(remaining).padStart(2, '0')}
              </span>
              <span className="text-xs font-black">ORANG LAGI</span>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-tight opacity-90">
              Promo Terbatas 20 Orang Pertama
            </p>
          </div>

          {/* Instruksi Utama */}
          <div className="bg-red-600 rounded-xl p-3 text-white shadow-lg shadow-red-600/30">
            <p className="font-black text-[11px] leading-tight uppercase">
              Tunjukkan halaman ini ke kasir<br/>dan nikmati diskonnya sekarang!
            </p>
            <div className="mt-2 flex items-center justify-center gap-1.5 border-t border-white/20 pt-1.5 text-[9px] font-black animate-pulse text-white-300">
              📸 JANGAN LUPA SCREENSHOT
            </div>
          </div>

          <div className="mt-3 space-y-0.5">
            <p className="text-[8px] text-gray-400 font-medium leading-none">
              *Promo berlaku 1x per orang | Tidak dapat digabung promo lain
            </p>
          </div>
          
          {status === 'already' && (
             <div className="mt-2 inline-block px-3 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold rounded-full border border-green-100">
               ✓ Voucher Sudah Diklaim
             </div>
          )}
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-[280px] w-full text-center border-4 border-gray-100">
        <h1 className="text-xl font-black text-gray-400 uppercase">YAH, PROMO HABIS!</h1>
        <p className="text-gray-500 text-[10px] mt-2 leading-relaxed">
          Jangan sedih! Pantau terus Instagram kami untuk promo Kuch-Kuch Hotahu selanjutnya.
        </p>
      </div>
    </BackgroundWrapper>
  );
}