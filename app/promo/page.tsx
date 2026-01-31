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
          src="/images/tampilan_diskon.png" 
          alt="Background" 
          fill 
          priority 
          className="object-cover object-center" 
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 w-full flex justify-center scale-[0.9] xs:scale-95 sm:scale-100 transition-transform">
        {children}
      </div>
    </div>
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-600 font-bold text-sm">
        Memuat Penawaran Spesial...
      </div>
    );
  }

  if (status === 'success' || status === 'already') {
    return (
      <BackgroundWrapper>
        <div className="w-full max-w-[320px] bg-white rounded-[2.5rem] shadow-2xl text-center p-6 border-4 border-yellow-400 animate-in fade-in zoom-in duration-500">
          
          {/* Logo Kuch-Kuch */}
          <div className="relative w-20 h-16 mx-auto mb-2">
            <Image 
              src="/images/logo.png" 
              alt="Kuch-Kuch Hotahu" 
              fill 
              className="object-contain" 
            />
          </div>

          <div className="space-y-1">
            <h2 className="text-[14px] font-black text-red-600 tracking-tight uppercase leading-none">
              SELAMAT!
            </h2>
            <p className="text-[11px] font-bold text-gray-700 uppercase">
              Kamu mendapatkan
            </p>
          </div>

          <div className="my-4">
            <h1 className="text-4xl font-black text-red-600 leading-tight">
              DISKON 15%
            </h1>
            <p className="text-[12px] font-black text-gray-900 uppercase tracking-tighter">
              UNTUK SEMUA MENU<br/>KUCH KUCH HOTAHU
            </p>
          </div>

          <div className="bg-yellow-100 py-1 px-3 rounded-full inline-block mb-4">
            <p className="text-[9px] font-bold text-yellow-800">
              *Minimal pembelian Rp30.000
            </p>
          </div>

          {/* Lokasi Outlet */}
          <div className="mb-4">
            <p className="text-[8px] font-bold text-gray-400 uppercase italic mb-2">
              Klik tag lokasi untuk menemukan kami
            </p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border-2 border-red-50 bg-white rounded-2xl px-3 py-2 w-full shadow-sm hover:border-red-200 transition-all text-left"
            >
              <span className="text-red-500 text-xl">📍</span>
              <div>
                <p className="text-[10px] font-black text-gray-800 leading-none">Datang ke Outlet Kuch-Kuch</p>
                <p className="text-[8px] text-gray-500 font-medium">Cek lokasi terdekatmu di sini</p>
              </div>
            </a>
          </div>

          {/* Kuota */}
          <div className="bg-red-600 rounded-2xl py-3 mb-4 text-white">
            <div className="flex justify-center items-baseline gap-1.5">
              <span className="text-3xl font-black tabular-nums">
                {String(remaining).padStart(2, '0')}
              </span>
              <span className="text-xs font-bold">ORANG LAGI</span>
            </div>
            <p className="text-[8px] font-bold uppercase tracking-widest opacity-80">
              Promo Terbatas 20 Orang Pertama
            </p>
          </div>

          {/* Instruksi */}
          <div className="bg-yellow-400 rounded-xl p-3 text-red-700 shadow-md">
            <p className="font-black text-[10px] leading-tight uppercase">
              Tunjukkan halaman ini ke kasir<br/>dan nikmati diskonnya sekarang!
            </p>
            <div className="mt-2 flex items-center justify-center gap-1.5 border-t border-red-700/10 pt-1.5 text-[8px] font-black animate-pulse">
              📸 JANGAN LUPA SCREENSHOT
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-[8px] text-gray-400 font-medium leading-none">
              *Promo berlaku 1x per orang
            </p>
            <p className="text-[8px] text-gray-400 font-medium leading-none">
              *Tidak dapat digabung promo lain
            </p>
          </div>
          
          {status === 'already' && (
             <div className="mt-3 inline-block px-3 py-0.5 bg-green-50 text-green-600 text-[8px] font-bold rounded-full border border-green-100">
               ✓ Voucher Sudah Diklaim
             </div>
          )}
        </div>
      </BackgroundWrapper>
    );
  }

  return (
    <BackgroundWrapper>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl max-w-[280px] w-full text-center border-4 border-gray-200">
        <h1 className="text-xl font-black text-gray-400 uppercase">YAH, PROMO HABIS!</h1>
        <p className="text-gray-500 text-[10px] mt-2 leading-relaxed">
          Jangan sedih! Pantau terus Instagram kami untuk promo Kuch-Kuch Hotahu selanjutnya.
        </p>
      </div>
    </BackgroundWrapper>
  );
}