'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import AdminRoute from '../../../components/AdminRoute';
import styles from '../../../styles/AdminList.module.css';

type StatsRow = {
  id: string;
  title: string;
  totalUsers: number;
  approve: number;
  reserve: number;
  reject: number;
};

function clampPercent(value: number) {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function ProgressCell({
  count,
  total,
  colorClassName,
}: {
  count: number;
  total: number;
  colorClassName: string;
}) {
  const percent = clampPercent((count / total) * 100);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center text-center text-slate-700">
        <div className=" text-sm font-semibold text-slate-500 tabular-nums">
          {count.toLocaleString('en-US')}/{total.toLocaleString('en-US')}
        </div>
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${colorClassName}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function AdminVotingDashboardPage() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();

  const [statsRows, setStatsRows] = useState<StatsRow[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isAdmin()) {
      router.push('/');
      return;
    }

    (async () => {
      setStatsLoading(true);
      setStatsError('');
      try {
        const res = await fetch('/api/GeneralAssembly/GetFiles', {
          method: 'GET',
          headers: {
            ...(localStorage.getItem('auth_token')
              ? { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }
              : {}),
          },
          cache: 'no-store',
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'فشل تحميل البيانات');

        const stats: StatsRow[] = (data || []).map((v: any) => ({
          id: String(v.fileId),
          title: v.fileName || '',
          totalUsers: v.totalUsers || 0,
          approve: parseInt((v.approve || '').split('/')[0], 10) || 0,
          reserve: parseInt((v.save || '').split('/')[0], 10) || 0,
          reject: parseInt((v.reject || '').split('/')[0], 10) || 0,
        }));

        setStatsRows(stats);
      } catch (e) {
        setStatsRows([]);
        setStatsError(e instanceof Error ? e.message : 'حدث خطأ غير متوقع');
      } finally {
        setStatsLoading(false);
      }
    })();
  }, [user, isAdmin, router]);

  return (
    <AdminRoute>
      <div dir="rtl" className="min-h-screen bg-slate-50 py-6">
        <div className="mx-auto w-full max-w-[1400px] px-4">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-teal-500 px-4 py-2 text-sm font-bold text-white">
                  إحصائيات أصوات الاجتماع : إجتماع الجمعية العمومية 2023
                </span>
              </div>
              <p className="text-sm text-slate-600">
                عرض ملخص للأصوات حسب كل مرفق، مع شريط تقدّم يوضح عدد الأصوات من إجمالي المشاركين.
              </p>
            </div>

            {statsLoading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>جاري التحميل...</p>
              </div>
            ) : statsError ? (
              <div className={styles.errorMessage}>{statsError}</div>
            ) : statsRows.length === 0 ? (
              <div className={styles.noResults}>لا توجد بيانات</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-right">
                  <thead>
                    <tr className="bg-slate-50 text-sm font-bold text-slate-700">
                      <th className="px-6 py-4">اسم المرفق</th>
                      <th className="px-6 py-4 text-[#16a34a]">موافق</th>
                      <th className="px-6 py-4 text-[#ca8a04]">تحفظ</th>
                      <th className="px-6 py-4 text-red-600">رفض</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statsRows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-5 text-base font-bold text-slate-900">{row.title}</td>
                        <td className="px-6 py-5 align-top">
                          <ProgressCell
                            count={row.approve}
                            total={row.totalUsers}
                            colorClassName="bg-[#22c55e]"
                          />
                        </td>
                        <td className="px-6 py-5 align-top">
                          <ProgressCell
                            count={row.reserve}
                            total={row.totalUsers}
                            colorClassName="bg-[#eab308]"
                          />
                        </td>
                        <td className="px-6 py-5 align-top">
                          <ProgressCell
                            count={row.reject}
                            total={row.totalUsers}
                            colorClassName="bg-red-600"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminRoute>
  );
}