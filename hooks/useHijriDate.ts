import { useState, useEffect } from 'react';

interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  monthNameEn: string;
}

const HIJRI_MONTHS_AR = [
  'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی',
  'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان',
  'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ',
];

const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhul Qadah', 'Dhul Hijjah',
];

function gregorianToHijri(gDate: Date): HijriDate {
  try {
    const gYear = gDate.getFullYear();
    const gMonth = gDate.getMonth() + 1;
    const gDay = gDate.getDate();

    const jd = Math.floor((14 - gMonth) / 12);
    const y = gYear + 4800 - jd;
    const m = gMonth + 12 * jd - 3;
    const jdn = gDay + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    let l = jdn - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const hYear = 30 * n + j - 30;
    const hMonth = Math.floor((24 * l) / 709);
    const hDay = l - Math.floor((709 * hMonth) / 24);

    // Clamp month index to valid range 1–12
    const safeMonth = Math.max(1, Math.min(12, hMonth));
    const safeDay = Math.max(1, Math.min(30, hDay));

    return {
      day: safeDay,
      month: safeMonth,
      year: hYear,
      monthName: HIJRI_MONTHS_AR[safeMonth - 1] || 'محرم',
      monthNameEn: HIJRI_MONTHS_EN[safeMonth - 1] || 'Muharram',
    };
  } catch {
    return {
      day: 1,
      month: 1,
      year: 1446,
      monthName: 'محرم',
      monthNameEn: 'Muharram',
    };
  }
}

export function useHijriDate() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hijri = gregorianToHijri(now);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const gregorianStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const hijriStr = `${hijri.day} ${hijri.monthNameEn} ${hijri.year} AH`;
  const hijriUrdu = `${hijri.day} ${hijri.monthName} ${hijri.year} ہجری`;

  return { now, timeStr, gregorianStr, hijriStr, hijriUrdu, hijri };
}
