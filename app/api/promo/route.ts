import { Redis } from '@upstash/redis';
import { NextResponse, NextRequest } from 'next/server';

// Inisialisasi Redis Upstash
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(req: NextRequest) {
  try {
    const quotaKey = 'kuota_hotahu';
    
    // 1. Ambil IP Address user untuk deteksi duplikasi
    // Mengambil dari header 'x-forwarded-for' (untuk Vercel) atau fallback ke IP standar
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';
    const claimKey = `user_claimed_hotahu:${ip}`;

    // 2. Cek apakah IP ini sudah pernah klaim sebelumnya
    const hasClaimed = await redis.get(claimKey);
    
    // Ambil sisa kuota terbaru
    let remaining = await redis.get<number>(quotaKey);

    // Inisialisasi kuota jika key belum ada di Redis
    if (remaining === null) {
      await redis.set(quotaKey, 20);
      remaining = 20;
    }

    // Jika sudah pernah klaim, beri tahu frontend (status: 'already')
    if (hasClaimed) {
      return NextResponse.json({
        success: false,
        already: true,
        remaining: remaining
      });
    }

    // 3. Cek apakah kuota masih tersedia (> 0)
    if (remaining > 0) {
      // --- LOGIKA PENGURANGAN OTOMATIS ---
      // Aktifkan baris di bawah ini jika ingin kuota langsung berkurang saat halaman dibuka
      // await redis.decr(quotaKey); 
      // await redis.set(claimKey, "true", { ex: 86400 }); // Catat IP selama 24 jam
      // remaining = remaining - 1; 

      return NextResponse.json({
        success: true,
        remaining: remaining
      });
    }

    // Jika kuota sudah 0
    return NextResponse.json({
      success: false,
      already: false,
      remaining: 0
    });

  } catch (error) {
    console.error("Redis Error:", error);
    return NextResponse.json({ success: false, remaining: 0 }, { status: 500 });
  }
}