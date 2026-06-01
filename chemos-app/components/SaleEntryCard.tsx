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
}

type ResultState = { msg: string; ok: boolean; detail?: string } | null;

const DELIVERY_TERMS = ['CIF', 'CFR', 'FOB'];


export default function SaleEntryCard({ feedOptions, onSubmit }: SaleEntryCardProps) {
  // Form state
  const [companyTo, setCompanyTo] = useState('');
  // Only allow these three companies for Company To
  const COMPANY_TO_OPTIONS = [
    'KLJ Resources',
    'Sidhe Petrochemical',
    'Sidhgun Technologies',
  ];
  const [companyFrom, setCompanyFrom] = useState('');
  const [product, setProduct] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [shipment, setShipment] = useState('');
  const [quantity, setQuantity] = useState('');
  const [priceFc, setPriceFc] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [offerUsd, setOfferUsd] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [deliveryTerm, setDeliveryTerm] = useState('');
  const [paymentDays, setPaymentDays] = useState('');
  const [port, setPort] = useState('');
  const [marketPrice, setMarketPrice] = useState('');
  const [marketStatus, setMarketStatus] = useState<MarketStatusType>('');
  const [costPrice, setCostPrice] = useState('');
  const [replacementCost, setReplacementCost] = useState('');

  // New columns
  const [expense, setExpense] = useState(''); // Freight & Insurance
  const [customDuty, setCustomDuty] = useState(''); // BCD
  const [sws, setSws] = useState(''); // SWS
  const [add, setAdd] = useState(''); // ADD
  const [otherExpense, setOtherExpense] = useState('');

  const [make, setMake] = useState('');
  const [packaging, setPackaging] = useState('');
  const [origin, setOrigin] = useState('');

  // Price (₹/kg) = Price(FC) × Exchange Rate / 1000
  const computedPriceInr =
    ((parseFloat(priceFc) || 0) * (parseFloat(exchangeRate) || 0)) / 1000;
  const priceDisplay =
    computedPriceInr > 0
      ? computedPriceInr.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '';

  // Total Price = Price(₹/kg) + BCD_amount + SWS_amount + ADD(₹) + OtherExpense(₹)
  // BCD_amount  = (BCD% / 100) × Price(₹/kg)
  // SWS_amount  = (BCD% / 100) × Price(₹/kg) × (SWS% / 100)  =  BCD_amount × (SWS% / 100)
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

  const clearForm = () => {
    setCompanyTo(''); setCompanyFrom(''); setProduct(''); setVesselName('');
    setShipment(''); setQuantity(''); setPriceFc(''); setCurrency('USD'); setOfferUsd(''); setExchangeRate('');
    setDeliveryTerm(''); setPaymentDays(''); setPort(''); setMarketPrice('');
    setMarketStatus(''); setCostPrice(''); setReplacementCost(''); setMake('');
    setExpense(''); setCustomDuty(''); setSws(''); setAdd(''); setOtherExpense('');
    setPackaging(''); setOrigin(''); setResult(null);
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
        company_from: companyFrom,
        product,
        vessel_name: vesselName,
        shipment,
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
      });
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

        <div className="form-grid">
          {/* Row 1: Company To, Date */}
          <div className="fg">
            <label className="fl">Company To <span className="req">*</span></label>
            <AutocompleteInput id="f-company-to" value={companyTo} onChange={setCompanyTo}
              options={COMPANY_TO_OPTIONS} placeholder="Buyer / customer name" />
          </div>
          

           <div className="fg">
            <label className="fl">Company From <span className="req">*</span></label>
            <AutocompleteInput id="f-company-from" value={companyFrom} onChange={setCompanyFrom}
              options={feedOptions.companies} placeholder="Seller / supplier name" />
          </div>

          {/* Row 2: Company From */}
         <div className="fg">
            <label className="fl">Date</label>
            <input className="fi locked" value={dateValue} readOnly />
          </div>

          {/* Row 3: Product, Origin, Make */}
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

          {/* Row 4: Vessel Name, Shipment, Port */}
          <div className="fg">
            <label className="fl">Vessel Name</label>
            <input className="fi" value={vesselName} onChange={e => setVesselName(e.target.value)}
              placeholder="Ship / vessel name" />
          </div>
          <div className="fg">
            <label className="fl">Shipment</label>
            <AutocompleteInput id="f-shipment" value={shipment} onChange={setShipment}
              options={feedOptions.shipments} placeholder="e.g. June Loading" />
          </div>
          <div className="fg">
            <label className="fl">Port <span className="req">*</span></label>
            <select className="fi" value={port} onChange={e => setPort(e.target.value)}>
              <option value="">Select port…</option>
              {feedOptions.ports.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Row 5: Packaging, Quantity, Price(FC), Currency, Exchange Rate, Price (₹/kg) */}
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

          {/* Row 6: Delivery Term, Payment, Expense (Freight & Insurance) */}
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
            <label className="fl">Payment</label>
            <AutocompleteInput id="f-payment" value={paymentDays} onChange={setPaymentDays}
              options={feedOptions.payments} placeholder="e.g. 60 Days" />
          </div>
          <div className="fg">
            <label className="fl">Expense (Freight & Insurance)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={expense} onChange={e => setExpense(e.target.value)} />
          </div>

          {/* Row 7: Custom Duty (BCD), SWS, ADD, Other Expense */}
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
            <label className="fl">ADD (₹)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={add} onChange={e => setAdd(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Other Expense (₹/kg)</label>
            <input className="fi" type="number" min={0} step={0.01} placeholder="0.00"
              value={otherExpense} onChange={e => setOtherExpense(e.target.value)} />
          </div>


          {/* Row 8: Total Price (computed) */}
          <div className="fg">
            <label className="fl">Total Price (₹/kg)</label>
            <input className="fi locked price-computed" value={totalPriceDisplay} readOnly placeholder="" />
          </div>

          {/* Row 9: Replacement Cost(₹), Market Price(₹), Market Status */}
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
