'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import SaleEntryCard from '@/components/SaleEntryCard';
import TodayPunches from '@/components/TodayPunches';
import { fetchFeedOptions, fetchTodayPunches, createPunch, deletePunch } from '@/lib/api';
import type { PunchEntry, FeedOptions, SalePunchPayload } from '@/lib/types';

interface ToastState {
  message: string;
  ok: boolean;
  visible: boolean;
}

const EMPTY_OPTIONS: FeedOptions = {
  products: [],
  ports: [],
  companies: [],
  makes: [],
  packagings: [],
  origins: [],
  payments: [],
  shipments: [],
};

export default function HomePage() {
  const [feedOptions, setFeedOptions] = useState<FeedOptions>(EMPTY_OPTIONS);
  const [entries, setEntries] = useState<PunchEntry[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: '', ok: true, visible: false });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const showToast = useCallback((message: string, ok = true) => {
    setToast({ message, ok, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
  }, []);

  const loadPunches = useCallback(async (targetPage = 1) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const data = await fetchTodayPunches(today, targetPage, LIMIT);
      setEntries(data.rows ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
    } catch {
      /* API may not be ready yet */
    }
  }, [LIMIT]);

  useEffect(() => {
    fetchFeedOptions().then(setFeedOptions).catch(() => {});
    loadPunches(page);
  }, [loadPunches, page]);

  const handleSubmitPunch = async (payload: SalePunchPayload) => {
    const data = await createPunch(payload);
    showToast(`Sale #${data.id} recorded`, true);
    setPage(1);
    await loadPunches(1);
    return data;
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePunch(id);
      showToast(`#${id} deleted`, true);
      await loadPunches(page);
    } catch {
      showToast('Delete failed', false);
    }
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <>
      <Header />
      <main className="container">
        <div className="page-head">
          <div className="title-block">
            <div className="crumb"></div>
            <h1>Purchase Form</h1>
            
          </div>
        </div>

        <SaleEntryCard feedOptions={feedOptions} onSubmit={handleSubmitPunch} />
        <TodayPunches
          entries={entries}
          onDelete={handleDelete}
          page={page}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
        />
      </main>
      <Toast message={toast.message} ok={toast.ok} visible={toast.visible} />
    </>
  );
}
