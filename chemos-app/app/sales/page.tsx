'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Toast from '@/components/Toast';
import SaleForm from '@/components/SaleForm';
import TodaySales from '@/components/TodaySales';
import { fetchFeedOptions, fetchTodaySales, createSale, deleteSale } from '@/lib/api';
import type { SaleEntry, FeedOptions, SaleFormPayload } from '@/lib/types';

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

export default function SalesPage() {
  const [feedOptions, setFeedOptions] = useState<FeedOptions>(EMPTY_OPTIONS);
  const [entries, setEntries] = useState<SaleEntry[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: '', ok: true, visible: false });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const showToast = useCallback((message: string, ok = true) => {
    setToast({ message, ok, visible: true });
    setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
  }, []);

  const loadSales = useCallback(async (targetPage = 1) => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const data = await fetchTodaySales(today, targetPage, LIMIT);
      setEntries(data.rows ?? []);
      setTotalPages(data.totalPages ?? 1);
      setTotal(data.total ?? 0);
    } catch {
      /* API may not be ready yet */
    }
  }, [LIMIT]);

  useEffect(() => {
    fetchFeedOptions().then(setFeedOptions).catch(() => {});
    loadSales(page);
  }, [loadSales, page]);

  const handleSubmitSale = async (payload: SaleFormPayload) => {
    const data = await createSale(payload);
    showToast(`Sale #${data.id} recorded`, true);
    setPage(1);
    await loadSales(1);
    return data;
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSale(id);
      showToast(`#${id} deleted`, true);
      await loadSales(page);
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
            <h1>Sale Form</h1>
          </div>
        </div>

        <SaleForm feedOptions={feedOptions} onSubmit={handleSubmitSale} />
        <TodaySales
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
