'use client';

import { useState, useEffect, useCallback } from 'react';
import Modal from '@/components/Modal';
import SaleForm from '@/components/SaleForm';
import { fetchFeedOptions, fetchTodaySales, createSale, deleteSale } from '@/lib/api';
import type { SaleEntry, FeedOptions, SaleFormPayload } from '@/lib/types';
import { dummySaleOrders } from '@/lib/dummyData';

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const loadSales = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      // Using dummy data for testing - replace with real API later
      setEntries(dummySaleOrders);
      setTotal(dummySaleOrders.length);
      
      // Real API call (commented out for testing)
      // const today = new Date().toISOString().slice(0, 10);
      // const data = await fetchTodaySales(today, targetPage, LIMIT);
      // setEntries(data.rows ?? []);
      // setTotal(data.total ?? 0);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  }, [LIMIT]);

  useEffect(() => {
    fetchFeedOptions().then(setFeedOptions).catch(() => {});
    loadSales(page);
  }, [loadSales, page]);

  const handleSubmitSale = async (payload: SaleFormPayload) => {
    const data = await createSale(payload);
    setIsCreateModalOpen(false);
    setPage(1);
    await loadSales(1);
    return data;
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Delete sale #${id}?`)) return;
    try {
      await deleteSale(id);
      await loadSales(page);
    } catch (error) {
      console.error('Failed to delete sale:', error);
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
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Sales Orders</h1>
          <p style={{ color: 'var(--gray)', fontSize: '14px' }}>
            Manage and track all sales orders and transactions
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
            Loading sales orders...
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
              No sales orders yet
            </h3>
            <p style={{ color: 'var(--gray)', marginBottom: '24px' }}>
              Create your first sales order to get started
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
              borderRadius: '12px',
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--navy-light)',
                  }}
                >
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    Company
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      color: 'var(--gray)',
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((sale) => (
                  <tr
                    key={sale.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      #{sale.id}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: 'var(--gray)' }}>
                      {sale.date}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', fontWeight: '500' }}>
                      {sale.product}
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: 'var(--gray)' }}>
                      {sale.company}
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '13px',
                        textAlign: 'right',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {sale.quantity} MT
                    </td>
                    <td
                      style={{
                        padding: '16px',
                        fontSize: '13px',
                        textAlign: 'right',
                        fontWeight: '600',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      ₹{sale.price_inr?.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: '1px solid var(--red)',
                          borderRadius: '6px',
                          color: 'var(--red)',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--red)';
                          e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--red)';
                        }}
                      >
                        Delete
                      </button>
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
        title="Create Sales Order"
        size="xlarge"
      >
        <SaleForm 
          feedOptions={feedOptions} 
          onSubmit={handleSubmitSale}
        />
      </Modal>
    </div>
  );
}
