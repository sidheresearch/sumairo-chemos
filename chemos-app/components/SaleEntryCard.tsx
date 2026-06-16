'use client';

import { useState, useEffect } from 'react';
import AutocompleteInput from './AutocompleteInput';
import type {
  FeedOptions,
  SalePunchPayload,
  MarketStatusType,
  CreatePunchResponse,
} from '@/lib/types';

interface SaleEntryCardProps {
  feedOptions: FeedOptions;
  onSubmit: (payload: SalePunchPayload) => Promise<CreatePunchResponse>;
  initialData?: any;
}

type ResultState = { msg: string; ok: boolean; detail?: string } | null;

const DELIVERY_TERMS = ['CIF', 'CFR', 'FOB'];
const PURCHASE_TYPES = ['Import', 'HSS', 'Local', 'Tow'];


export default function SaleEntryCard({ feedOptions, onSubmit, initialData }: SaleEntryCardProps) {
  // Form state
  const [companyTo, setCompanyTo] = useState('');
  const COMPANY_TO_OPTIONS = [
    'KLJ Resources',
    'Sidhe Petrochemical',
    'Sidhgun Technologies',
  ];
  const [purchaseType, setPurchaseType] = useState(initialData?.purchase_type || '');
  const [companyFrom, setCompanyFrom] = useState(initialData?.company_from || '');
  const [product, setProduct] = useState(initialData?.product || '');
  const [vesselName, setVesselName] = useState('');
  const [shipmentStart, setShipmentStart] = useState('');
  const [shipmentEnd, setShipmentEnd] = useState('');
  const [quantity, setQuantity] = useState(initialData?.quantity ? String(initialData.quantity) : '');
  const [priceFc, setPriceFc] = useState(initialData?.price_fc ? String(initialData.price_fc) : '');
  const [currency, setCurrency] = useState(initialData?.currency || 'USD');
  const [offerUsd, setOfferUsd] = useState('');
  const [exchangeRate, setExchangeRate] = useState(initialData?.exchange_rate ? String(initialData.exchange_rate) : '');
  const [deliveryTerm, setDeliveryTerm] = useState('');
  const [paymentDays, setPaymentDays] = useState('');
  const [port, setPort] = useState(initialData?.port || '');
  const [dischargePorts, setDischargePorts] = useState<string[]>(initialData?.discharge_ports || []);
  const [dischargePortsOpen, setDischargePortsOpen] = useState(false); // dropdown open state
  const [marketPrice, setMarketPrice] = useState(initialData?.market_price ? String(initialData.market_price) : '');
  const [marketStatus, setMarketStatus] = useState<MarketStatusType>('');
  const [costPrice, setCostPrice] = useState('');
  const [replacementCost, setReplacementCost] = useState('');

  const [expense, setExpense] = useState('');
  const [customDuty, setCustomDuty] = useState('');
  const [sws, setSws] = useState('');
  const [add, setAdd] = useState('');
  const [otherExpense, setOtherExpense] = useState('');
  const [addUsd, setAddUsd] = useState(initialData?.add_usd ? String(initialData.add_usd) : '');

  const [make, setMake] = useState('');
  const [packaging, setPackaging] = useState('');
  const [origin, setOrigin] = useState(initialData?.origin || '');
  const [priceType, setPriceType] = useState(initialData?.price_type || 'Fixed Price');
  const [paymentTerm, setPaymentTerm] = useState(initialData?.payment_term || '');
  const [etd, setEtd] = useState(initialData?.etd || '');
  const [eta, setEta] = useState(initialData?.eta || '');

  // Price (₹/kg) = Price(FC) × Exchange Rate / 1000
  const computedPriceInr =
    ((parseFloat(priceFc) || 0) * (parseFloat(exchangeRate) || 0)) / 1000;
  const priceDisplay =
    computedPriceInr > 0
      ? computedPriceInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '';

  const bcdAmount = (parseFloat(customDuty) || 0) / 100 * computedPriceInr;
  const swsAmount = bcdAmount * (parseFloat(sws) || 0) / 100;
  const computedTotalPrice =
    computedPriceInr + bcdAmount + swsAmount + (parseFloat(add) || 0) + (parseFloat(otherExpense) || 0);
  const totalPriceDisplay =
    computedTotalPrice > 0
      ? computedTotalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '';

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ResultState>(null);
  const [dateValue, setDateValue] = useState('');
  const [dateStamp, setDateStamp] = useState('');

  // Date/time updater
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const d = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const t = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
      setDateValue(d);
      setDateStamp(`${d}  ·  ${t}`);
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  // Close discharge ports dropdown on outside click
  useEffect(() => {
    if (!dischargePortsOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#discharge-ports-wrapper')) setDischargePortsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dischargePortsOpen]);

  const clearForm = () => {
    setCompanyTo(''); setCompanyFrom(''); setProduct(''); setVesselName('');
    setShipmentStart(''); setShipmentEnd(''); setQuantity(''); setPriceFc(''); setCurrency('USD'); setOfferUsd(''); setExchangeRate('');
    setDeliveryTerm(''); setPaymentDays(''); setPort(''); setMarketPrice('');
    setMarketStatus(''); setCostPrice(''); setReplacementCost(''); setMake('');
    setExpense(''); setCustomDuty(''); setSws(''); setAdd(''); setOtherExpense('');
    setPurchaseType('');
    setPackaging(''); setOrigin(''); setResult(null);
    setDischargePorts([]);
    setPriceType('Fixed Price');
    setPaymentTerm('');
    setEtd('');
    setEta('');
    setAddUsd('');
  };

  const handleSubmit = async () => {
    setResult(null);
    const qty = parseFloat(quantity);
    const fc = parseFloat(priceFc);
    const exRate = parseFloat(exchangeRate);

    const missing: string[] = [];
    if (!companyTo) missing.push('Company To');
    if (!companyFrom) missing.push('Company From');
    if (!product) missing.push('Product');
    if (!Number.isFinite(qty) || qty <= 0) missing.push('Quantity');
    if (!Number.isFinite(fc) || fc <= 0) missing.push('Price (FC)');
    if (!Number.isFinite(exRate) || exRate <= 0) missing.push('Exchange Rate');
    if (!port) missing.push('Port');
    if (missing.length) {
      setResult({ msg: 'Please fill: ' + missing.join(', '), ok: false });
      return;
    }

    setSubmitting(true);
    try {
      const data = await onSubmit({
        company_to: companyTo,
        purchase_type: purchaseType,
        company_from: companyFrom,
        product,
        vessel_name: vesselName,
        shipment: shipmentStart && shipmentEnd ? `${shipmentStart} to ${shipmentEnd}` : '',
        quantity: qty,
        price_fc: fc,
        currency,
        offer_usd: fc,
        exchange_rate: exRate,
        price_inr: computedPriceInr,
        delivery_term: deliveryTerm,
        payment_days: paymentDays,
        port,
        market_price: parseFloat(marketPrice) || 0,
        market_status: marketStatus,
        cost_price: parseFloat(costPrice) || 0,
        replacement_cost: parseFloat(replacementCost) || 0,
        make,
        packaging,
        origin,
        expense: parseFloat(expense) || 0,
        custom_duty: parseFloat(customDuty) || 0,
        sws: parseFloat(sws) || 0,
        add: parseFloat(add) || 0,
        other_expense: parseFloat(otherExpense) || 0,
        add_usd: parseFloat(addUsd) || 0,
        discharge_ports: dischargePorts,
        price_type: priceType,
        payment_term: paymentTerm,
        etd: etd || undefined,
        eta: eta || undefined,
      } as any);
      setResult({
        msg: `Punched in #${data.id} — ${qty.toLocaleString('en-IN')} MT · ${currency} ${fc.toLocaleString('en-IN')} × ₹${exRate} = ₹${computedPriceInr.toLocaleString('en-IN', { maximumFractionDigits: 2 })}/kg`,
        ok: true,
        detail: `${product} · ${companyTo} ← ${companyFrom} · Port: ${port}${deliveryTerm ? ' · ' + deliveryTerm : ''}`,
      });
      clearForm();
    } catch (err: unknown) {
      setResult({ msg: err instanceof Error ? err.message : 'Submission failed', ok: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-t"> New Purchase</div>
        <div className="card-meta">{dateStamp}</div>
      </div>
      <div className="card-body">

        <div className="form-grid top-row">
          <div className="fg">
            <label className="fl">Purchase Type</label>
            <select className="fi" value={purchaseType} onChange={e => setPurchaseType(e.target.value)}>
              <option value="">Select…</option>
              {PURCHASE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Date</label>
            <input className="fi locked" value={dateValue} readOnly />
          </div>
        </div>

        <div className="form-grid">
          {/* Buyer */}
          <div className="fg">
            <label className="fl">Buyer <span className="req">*</span></label>
            <AutocompleteInput id="f-company-to" value={companyTo} onChange={setCompanyTo}
              options={COMPANY_TO_OPTIONS} placeholder="Buyer / customer name" />
          </div>

          {/* Seller */}
          <div className="fg">
            <label className="fl">Seller <span className="req">*</span></label>
            <AutocompleteInput id="f-company-from" value={companyFrom} onChange={setCompanyFrom}
              options={feedOptions.companies} placeholder="Seller / supplier name" />
          </div>

          {/* Product, Origin, Make */}
          <div className="fg">
            <label className="fl">Product <span className="req">*</span></label>
            <AutocompleteInput id="f-product" value={product} onChange={setProduct}
              options={feedOptions.products} placeholder="e.g. VAM (Carbide Base)" />
          </div>
          <div className="fg">
            <label className="fl">Origin</label>
            <AutocompleteInput id="f-origin" value={origin} onChange={setOrigin}
              options={feedOptions.origins} placeholder="Country of origin" />
          </div>
          <div className="fg">
            <label className="fl">Make</label>
            <AutocompleteInput id="f-make" value={make} onChange={setMake}
              options={feedOptions.makes} placeholder="Manufacturer" />
          </div>

          {/* Vessel, Shipment, Load Port */}
          <div className="fg">
            <label className="fl">Vessel Name</label>
            <input className="fi" value={vesselName} onChange={e => setVesselName(e.target.value)}
              placeholder="Ship / vessel name" />
          </div>
          <div className="fg">
            <label className="fl">Shipment Start</label>
            <input className="fi" type="date" value={shipmentStart} onChange={e => setShipmentStart(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Shipment End</label>
            <input className="fi" type="date" value={shipmentEnd} onChange={e => setShipmentEnd(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Load Port <span className="req">*</span></label>
            <select className="fi" value={port} onChange={e => setPort(e.target.value)}>
              <option value="">Select port…</option>
              {feedOptions.ports.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Discharge Ports — multi-select dropdown */}
          <div className="fg">
            <label className="fl">Discharge Ports</label>
            <div id="discharge-ports-wrapper" style={{ position: 'relative' }}>
              {/* Trigger box */}
              <div
                className="fi"
                onClick={() => setDischargePortsOpen(v => !v)}
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '4px',
                  minHeight: '38px',
                  paddingTop: dischargePorts.length ? '5px' : undefined,
                  paddingBottom: dischargePorts.length ? '5px' : undefined,
                }}
              >
                {dischargePorts.length === 0 ? (
                  <span style={{ color: 'var(--placeholder, #999)', flex: 1 }}>Select ports…</span>
                ) : (
                  dischargePorts.map(p => (
                    <span
                      key={p}
                      style={{
                        background: 'var(--accent, #3b82f6)',
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {p}
                      <span
                        onClick={e => {
                          e.stopPropagation();
                          setDischargePorts(dischargePorts.filter(x => x !== p));
                        }}
                        style={{ cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}
                      >
                        ×
                      </span>
                    </span>
                  ))
                )}
                {/* Chevron */}
                <span style={{ marginLeft: 'auto', paddingLeft: '6px', color: 'var(--muted, #888)' }}>
                  {dischargePortsOpen ? '▴' : '▾'}
                </span>
              </div>

              {/* Dropdown list */}
              {dischargePortsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 50,
                    background: 'var(--bg-input, #fff)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    marginTop: '2px',
                  }}
                >
                  {feedOptions.ports.map(p => (
                    <label
                      key={p}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        background: dischargePorts.includes(p) ? 'var(--accent-light, #eff6ff)' : 'transparent',
                        transition: 'background 0.1s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={dischargePorts.includes(p)}
                        onChange={e => {
                          setDischargePorts(e.target.checked
                            ? [...dischargePorts, p]
                            : dischargePorts.filter(x => x !== p));
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Packaging, Market Status, Quantity, Price */}
          <div className="fg">
            <label className="fl">Packaging</label>
            <AutocompleteInput id="f-packaging" value={packaging} onChange={setPackaging}
              options={feedOptions.packagings} placeholder="e.g. Bulk, IBC, Drum" />
          </div>
          <div className="fg">
            <label className="fl">Market Status</label>
            <select className="fi" value={marketStatus} onChange={e => setMarketStatus(e.target.value as MarketStatusType)}>
              <option value="">Select…</option>
              <option value="Ready Market">Ready Market</option>
              <option value="Incoming">Incoming</option>
              <option value="Spot">Spot</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Quantity (MT) <span className="req">*</span></label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="500"
              value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Price (FC)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={priceFc} onChange={e => setPriceFc(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Price Type</label>
            <select className="fi" value={priceType} onChange={e => setPriceType(e.target.value)}>
              <option value="Formula Price">Formula Price</option>
              <option value="Fixed Price">Fixed Price</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Currency</label>
            <select className="fi" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="INR">INR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
              <option value="AED">AED</option>
              <option value="SGD">SGD</option>
              <option value="AUD">AUD</option>
              <option value="CAD">CAD</option>
              <option value="CHF">CHF</option>
              <option value="ZAR">ZAR</option>
              <option value="THB">THB</option>
              <option value="HKD">HKD</option>
              <option value="KRW">KRW</option>
              <option value="MYR">MYR</option>
              <option value="NZD">NZD</option>
              <option value="SEK">SEK</option>
              <option value="NOK">NOK</option>
              <option value="DKK">DKK</option>
              <option value="RUB">RUB</option>
              <option value="BRL">BRL</option>
              <option value="MXN">MXN</option>
              <option value="IDR">IDR</option>
              <option value="TRY">TRY</option>
              <option value="SAR">SAR</option>
              <option value="PLN">PLN</option>
              <option value="TWD">TWD</option>
              <option value="VND">VND</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Exchange Rate (₹/$) <span className="req">*</span></label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="84.50"
              value={exchangeRate} onChange={e => setExchangeRate(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Price (₹/kg)</label>
            <input className="fi locked price-computed" value={priceDisplay} readOnly placeholder="" />
          </div>

          {/* Delivery, Payment */}
          <div className="fg">
            <label className="fl">Inco Term</label>
            <select className="fi" value={deliveryTerm} onChange={e => setDeliveryTerm(e.target.value)}>
              <option value="">Select…</option>
              {DELIVERY_TERMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Payment Term</label>
            <select className="fi" value={paymentTerm} onChange={e => setPaymentTerm(e.target.value)}>
              <option value="">Select…</option>
              <option value="DA">DA</option>
              <option value="CAD">CAD</option>
              <option value="LC">LC</option>
            </select>
          </div>
          <div className="fg">
            <label className="fl">Payment</label>
            <AutocompleteInput id="f-payment" value={paymentDays} onChange={setPaymentDays}
              options={feedOptions.payments} placeholder="e.g. 60 Days" />
          </div>
          <div className="fg">
            <label className="fl">Expense (Freight & Insurance)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={expense} onChange={e => setExpense(e.target.value)} />
          </div>

          {/* Duties */}
          <div className="fg">
            <label className="fl">Custom Duty BCD (%/kg)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="e.g. 7.5"
              value={customDuty} onChange={e => setCustomDuty(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">SWS (%)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="e.g. 10"
              value={sws} onChange={e => setSws(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">ADD ($/MT)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={addUsd} onChange={e => setAddUsd(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">ADD (₹)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={add} onChange={e => setAdd(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Other Expense (₹/kg)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={otherExpense} onChange={e => setOtherExpense(e.target.value)} />
          </div>

          {/* Total Price */}
          <div className="fg">
            <label className="fl">Total Price (₹/kg)</label>
            <input className="fi locked price-computed" value={totalPriceDisplay} readOnly placeholder="" />
          </div>

          {/* Market */}
          <div className="fg">
            <label className="fl">Replacement Cost (₹/kg)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={replacementCost} onChange={e => setReplacementCost(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Market Price (₹/kg)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={marketPrice} onChange={e => setMarketPrice(e.target.value)} />
          </div>
        </div>

        <div className="form-grid">
          <div className="fg">
            <label className="fl">ETD</label>
            <input className="fi" type="date" value={etd} onChange={e => setEtd(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">ETA</label>
            <input className="fi" type="date" value={eta} onChange={e => setEta(e.target.value)} />
          </div>
        </div>

        <div className="btn-row">
          <button className="btn btn-red" disabled={submitting} onClick={handleSubmit}>
            {submitting ? '⏳ Saving…' : '💾 Submit'}
          </button>
          <button className="btn btn-ghost" onClick={clearForm}>Clear</button>
        </div>

        {result && (
          <div className={`result ${result.ok ? 'ok' : 'err'}`}>
            {result.ok ? '✓ ' : '✗ '}
            {result.msg}
            {result.detail && <div className="result-detail">{result.detail}</div>}
          </div>
        )}
      </div>
    </div>
  );
}
