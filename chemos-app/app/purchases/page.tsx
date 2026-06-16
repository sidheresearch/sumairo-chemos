'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import SaleEntryCard from '@/components/SaleEntryCard';
import { fetchFeedOptions, fetchTodayPunches, createPunch, deletePunch } from '@/lib/api';
import type { PunchEntry, FeedOptions, SalePunchPayload } from '@/lib/types';
import { dummyPurchaseOrders } from '@/lib/dummyData';

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

export default function PurchasesPage() {
  const [feedOptions, setFeedOptions] = useState<FeedOptions>(EMPTY_OPTIONS);
  const [entries, setEntries] = useState<PunchEntry[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const loadPunches = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      // Using dummy data for testing - replace with real API later
      setEntries(dummyPurchaseOrders);
      setTotal(dummyPurchaseOrders.length);
      
      // Real API call (commented out for testing)
      // const today = new Date().toISOString().slice(0, 10);
      // const data = await fetchTodayPunches(today, targetPage, LIMIT);
      // setEntries(data.rows ?? []);
      // setTotal(data.total ?? 0);
    } catch (error) {
      console.error('Failed to load purchases:', error);
    } finally {
      setLoading(false);
    }
  }, [LIMIT]);

  useEffect(() => {
    fetchFeedOptions().then(setFeedOptions).catch(() => {});
    loadPunches(page);
  }, [loadPunches, page]);

  const handleSubmitPunch = async (payload: SalePunchPayload) => {
    const data = await createPunch(payload);
    setIsCreateModalOpen(false);
    setPage(1);
    await loadPunches(1);
    return data;
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Delete purchase #${id}?`)) return;
    try {
      await deletePunch(id);
      await loadPunches(page);
    } catch (error) {
      console.error('Failed to delete purchase:', error);
    }
  };

  return (
    <div style={{ padding: '0', height: '100%' }}>
      {/* Page Header */}
      <div
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Purchase Orders</h1>
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
            Manage and track all purchase orders and transactions
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, var(--blue), var(--teal))',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(66, 153, 225, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(66, 153, 225, 0.3)';
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          Create Order
        </button>
      </div>

      {/* Content Area */}
      <div style={{ padding: '32px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--gray)' }}>
            Loading purchase orders...
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px',
              background: 'var(--navy-light)',
              borderRadius: '12px',
              border: '2px dashed var(--border)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
              No purchase orders yet
            </h3>
            <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
              Create your first purchase order to get started
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                padding: '10px 20px',
                background: 'var(--blue)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Create Order
            </button>
          </div>
        ) : (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--navy-light)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>ID</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Product</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Seller</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Quantity</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Price</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: 'var(--gray)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '16px', fontSize: '14px' }}>#{entry.id}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--gray)' }}>
                      {new Date(entry.ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>{entry.product}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{entry.company_from}</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{entry.quantity.toLocaleString('en-IN')} MT</td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>
                      {entry.currency} {entry.price_fc.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: 'var(--blue)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          View
                        </button>
                        <button
                          style={{
                            padding: '6px 12px',
                            background: 'var(--green)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--red)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        title="Create Purchase Order"
        size="xlarge"
      >
        <SaleEntryCard 
          feedOptions={feedOptions} 
          onSubmit={handleSubmitPunch}
        />
      </Modal>
    </div>
  );
}
