// WashOps v2.1 - mobile responsive build
import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  app: { display: 'flex', height: '100vh', background: '#f5f7fa', color: '#1a1a2e', fontFamily: "'Inter', sans-serif", overflow: 'hidden' },
  sidebar: { width: 210, background: '#ffffff', borderRight: '1px solid #2a2a3a', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarLogo: { padding: '18px 18px 14px', fontWeight: 800, fontSize: 20, borderBottom: '1px solid #e2e4e8', color: '#1a1a2e' },
  sidebarUser: { padding: '12px 18px', borderBottom: '1px solid #e2e4e8', display: 'flex', alignItems: 'center', gap: 10 },
  sidebarNav: { padding: '10px 8px', flex: 1, background: '#ffffff' },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: active ? '#378add' : '#6b7280', background: active ? 'rgba(55,138,221,0.1)' : 'transparent', border: 'none', width: '100%', textAlign: 'left', marginBottom: 2 }),
  sidebarBottom: { padding: '10px 8px', borderTop: '1px solid #e2e4e8' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { background: '#ffffff', borderBottom: '1px solid #2a2a3a', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarTitle: { fontWeight: 700, fontSize: 15 },
  page: { flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: 20, WebkitOverflowScrolling: 'touch', background: '#f5f7fa' },
  card: (extra = {}) => ({ background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 8, padding: 18, ...extra }),
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }, // desktop only - use inline for mobile
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  input: { width: '100%', background: '#f8f9fb', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 12px', color: '#1a1a2e', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  select: { width: '100%', background: '#f8f9fb', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 12px', color: '#1a1a2e', fontSize: 13, outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' },
  btnPrimary: { width: '100%', padding: '11px', background: '#378add', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' },
  btnGhost: { padding: '8px 14px', background: '#f8f9fb', border: '1px solid #2a2a3a', borderRadius: 8, color: '#6b7280', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
  btnAccent: { padding: '8px 14px', background: '#378add', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
  btnGreen: { padding: '8px 14px', background: '#10b981', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
  modal: { background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 10, padding: 24, width: 460, maxHeight: '85vh', overflowY: 'auto' },
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: (status) => { const c = STATUS_CONFIG[status] || { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' }; return { background: c.bg, color: c.color, padding: '3px 9px', borderRadius: 8, fontSize: 11, fontWeight: 600 }; },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '9px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #2a2a3a', background: '#f8f9fb' },
  td: { padding: '11px 16px', fontSize: 13, borderBottom: '1px solid #f0f2f5' },
  planOption: (sel) => ({ flex: 1, padding: '10px 8px', borderRadius: 8, border: `1px solid ${sel ? '#378add' : '#e2e4e8'}`, background: sel ? 'rgba(55,138,221,0.1)' : '#f8f9fb', cursor: 'pointer', textAlign: 'center' }),
  techSlot: (rec) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: rec ? 'rgba(16,185,129,0.05)' : '#f8f9fb', borderRadius: 8, border: `1px solid ${rec ? '#10b981' : '#e2e4e8'}`, marginBottom: 6, cursor: 'pointer' }),
};

const STATUS_CONFIG = {
  'not-interested': { label: 'Not Interested', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  'not-home': { label: 'Not Home', color: '#9ca3af', bg: 'rgba(156,163,175,0.15)' },
  'follow-up': { label: 'Follow Up', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  'gave-pitch': { label: 'Gave Pitch', color: '#185fa5', bg: 'rgba(24,95,165,0.12)' },
  appointment: { label: 'Appt Set', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  closed: { label: 'Closed', color: '#378add', bg: 'rgba(55,138,221,0.15)' },
  scheduled: { label: 'Scheduled', color: '#378add', bg: 'rgba(55,138,221,0.15)' },
  serviced: { label: 'Serviced', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  complete: { label: '⭐ Complete ⭐', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  paid: { label: '⭐ Complete ⭐', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const PIN_COLORS = { 'not-interested': '#ef4444', 'not-home': '#9ca3af', 'follow-up': '#f59e0b', 'gave-pitch': '#185fa5', appointment: '#10b981', closed: '#378add', paid: '#7c3aed' };

// Mobile styles injected into head
if (!document.getElementById('washops-mobile-styles')) {
  const style = document.createElement('style');
  style.id = 'washops-mobile-styles';
  style.textContent = `
    * { -webkit-tap-highlight-color: transparent; }
    input, select, textarea { font-size: 16px !important; }
  `;
  document.head.appendChild(style);
}

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const AGREEMENT_ONETIME = `ONE-TIME WINDOW CLEANING SERVICE AGREEMENT — RAIDER WASHING

SERVICE: Raider Washing agrees to perform a one-time professional window cleaning service at the address provided. Our team will arrive at the scheduled date and time to complete the service.

PAYMENT: Your card on file will be charged only after the service has been fully completed to your satisfaction. You will not be charged until the job is done.

SATISFACTION GUARANTEE: If for any reason you are not satisfied with the quality of our work, contact Raider Washing and we will return to re-service your home at absolutely no additional charge.

NO COMMITMENT: This is a one-time service with no recurring charges, subscriptions, or obligations of any kind.

By agreeing, you authorize Raider Washing to perform the described service and charge your card on file upon completion.

Contact: raiderwashing.com | Lubbock, TX`;

const AGREEMENT_QUARTERLY = `QUARTERLY WINDOW CLEANING SERVICE AGREEMENT — RAIDER WASHING

SERVICE PLAN: You are enrolling in Raider Washing's Quarterly Recurring Service. Our team will professionally clean your windows every 3 months at the address provided.

BILLING: You will be billed monthly at 1/3 of the quarterly service rate. Your card on file will be charged each month automatically. You will not be charged until after each service is completed.

12-MONTH COMMITMENT: This plan has a minimum term of 12 months. After 12 months, you may cancel at any time with no penalty or cancellation fee.

EARLY CANCELLATION: You may cancel before 12 months at any time. Monthly payments already collected are non-refundable as they represent services rendered or scheduled.

SATISFACTION GUARANTEE: If you are ever unsatisfied with a service, contact Raider Washing before canceling and we will return to re-service your home completely free of charge.

By agreeing, you authorize Raider Washing to perform quarterly window cleaning services and charge your card on file monthly as described above.

Contact: raiderwashing.com | Lubbock, TX`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ name, role, size = 32 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const bg = { admin: '#1a3a6e', rep: '#0a3328', tech: '#3d2800' }[role] || '#222';
  const color = { admin: '#378add', rep: '#10b981', tech: '#f59e0b' }[role] || '#888';
  return <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>{initials}</div>;
}

function Badge({ status }) {
  return <span style={s.badge(status)}>{STATUS_CONFIG[status]?.label || status}</span>;
}

function Spinner() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f5f7fa', color: '#378add', fontSize: 14 }}>Loading WashOps...</div>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('admin@raiderwashing.com');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setErr('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setLoading(false); return; }
    const { data: userData } = await supabase.from('users').select('*').eq('email', email).single();
    onLogin(userData);
    setLoading(false);
  };

  return (
    <div style={{ height: '100vh', background: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 8, padding: 44, width: 400, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Wash<span style={{ color: '#378add' }}>Ops</span></div>
        <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 32 }}>Field Sales & Job Management · Raider Washing</div>
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Email</label>
          <input style={s.input} value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} placeholder="••••••••" />
        </div>
        {err && <div style={{ color: '#ef4444', fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <button style={s.btnPrimary} onClick={login} disabled={loading}>{loading ? 'Signing in...' : 'Sign In →'}</button>
      </div>
    </div>
  );
}

// ─── Door Log Modal ───────────────────────────────────────────────────────────
// ─── Signature Pad ───────────────────────────────────────────────────────────
function SignaturePad({ onSign, signature }) {
  const canvasRef = React.useRef(null);
  const drawing = React.useRef(false);
  const [hasSignature, setHasSignature] = React.useState(!!signature);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    // If existing signature, draw it
    if (signature) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
      img.src = signature;
    }
  }, []);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    drawing.current = false;
    const canvas = canvasRef.current;
    setHasSignature(true);
    onSign(canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSign(null);
  };

  return (
    <div>
      <div style={{ position: 'relative', background: '#ffffff', border: `2px solid ${hasSignature ? '#10b981' : '#e2e4e8'}`, borderRadius: 8, overflow: 'hidden', transition: 'border-color 0.2s' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: 120, display: 'block', touchAction: 'none', cursor: 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasSignature && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>Customer signs here with finger</span>
          </div>
        )}
        <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, borderTop: '1px solid #e2e4e8', margin: '0 12px', pointerEvents: 'none' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
        <span style={{ fontSize: 11, color: hasSignature ? '#10b981' : '#9ca3af', fontWeight: 600 }}>
          {hasSignature ? '✅ Signed' : 'Not signed yet'}
        </span>
        {hasSignature && (
          <button onClick={clear} style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Clear & Redo</button>
        )}
      </div>
    </div>
  );
}

function DoorLogModal({ pin, onClose, onSave, onDelete, techs, allJobs }) {
  const [form, setForm] = useState({
    address: pin?.address || '',
    name: pin?.name || '',
    status: pin?.status || 'follow-up',
    service: pin?.service || 'one-time',
    price: pin?.price || '',
    notes: pin?.notes || '',
    follow_up_date: pin?.follow_up_date || new Date().toISOString().split('T')[0],
    scheduled_time: pin?.scheduled_time || new Date().toTimeString().slice(0,5),
    tech_id: pin?.tech_id || '',
    agreed: false,
    signature: pin?.signature || null,
  });
  const [showTechPicker, setShowTechPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const showPlan = form.status === 'appointment' || form.status === 'closed';

  const getBookedTimes = (techId, date) => {
    if (!allJobs || !date) return [];
    return allJobs.filter(j => j.tech_id === techId && j.scheduled_date === date && j.scheduled_time).map(j => j.scheduled_time);
  };

  const getAvailableSlots = (techId, date) => {
    const booked = getBookedTimes(techId, date);
    const slots = [];
    for (let h = 8; h <= 17; h++) {
      const time = `${h.toString().padStart(2,'0')}:00`;
      const label = h === 12 ? '12:00 PM' : h > 12 ? `${h-12}:00 PM` : `${h}:00 AM`;
      slots.push({ time, label, booked: booked.includes(time) });
    }
    return slots;
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...pin, ...form, price: Number(form.price) || 0 });
    setSaving(false);
    onClose();
  };

  return (
    <div style={isMobile ? { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'flex-end' } : s.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{pin?.id ? 'Edit Door Log' : 'New Door Log'}</div>
          <button onClick={onClose} style={{ background: '#f8f9fb', border: 'none', color: '#6b7280', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={s.label}>Address (auto-filled from pin)</label>
          <input style={s.input} value={form.address} onChange={e => set('address', e.target.value)} />
        </div>
        <div style={s.twoCol}>
          <div><label style={s.label}>Homeowner Name</label><input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Smith" /></div>
          <div><label style={s.label}>Status</label>
            <select style={s.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="follow-up">🟡 Follow Up</option>
              <option value="not-home">🟣 Not Home</option>
              <option value="gave-pitch">🟤 Gave Pitch</option>
              <option value="not-interested">🔴 Not Interested</option>
              <option value="appointment">🟢 Appt Set</option>
              <option value="closed">🔵 Closed</option>
            </select>
          </div>
        </div>
        {showPlan && (
          <>
            <label style={s.label}>Service Plan</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <div style={s.planOption(form.service === 'one-time')} onClick={() => set('service', 'one-time')}><div style={{ fontWeight: 700, fontSize: 13 }}>One-Time</div><div style={{ fontSize: 11, color: '#6b7280' }}>Pay once</div></div>
              <div style={s.planOption(form.service === 'quarterly')} onClick={() => set('service', 'quarterly')}><div style={{ fontWeight: 700, fontSize: 13 }}>Quarterly</div><div style={{ fontSize: 11, color: '#6b7280' }}>Monthly billing · visit every 3mo</div></div>
            </div>
            <div style={s.twoCol}>
              <div><label style={s.label}>{form.service === 'quarterly' ? 'Quarterly Price ($)' : 'Job Price ($)'}</label><input style={s.input} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="150" /></div>
              {form.service === 'quarterly' && form.price && <div><label style={s.label}>Monthly Charge</label><div style={{ ...s.input, color: '#10b981', fontWeight: 700 }}>${(Number(form.price) / 3).toFixed(2)}/mo</div></div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Scheduled Date</label>
              <input style={s.input} type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)} />
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Assign Technician</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {techs.map(t => {
                  const slots = getAvailableSlots(t.id, form.follow_up_date);
                  const available = slots.filter(sl => !sl.booked).length;
                  const isSelected = form.tech_id === t.id;
                  return (
                    <div key={t.id}>
                      <div
                        onClick={() => { set('tech_id', t.id); setShowTechPicker(isSelected ? null : t.id); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: isSelected ? 'rgba(55,138,221,0.1)' : '#f8f9fb', border: `1px solid ${isSelected ? '#378add' : '#e2e4e8'}`, borderRadius: 8, cursor: 'pointer' }}
                      >
                        <Avatar name={t.name} role="tech" size={28} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: available > 0 ? '#10b981' : '#ef4444' }}>{available} slots open {form.follow_up_date ? 'this day' : '— pick a date first'}</div>
                        </div>
                        <span style={{ fontSize: 11, color: '#6b7280' }}>{isSelected ? '▲ Hide slots' : '▼ View slots'}</span>
                      </div>
                      {isSelected && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 6, padding: '8px 0' }}>
                          {slots.map(sl => (
                            <div
                              key={sl.time}
                              onClick={() => !sl.booked && set('scheduled_time', sl.time)}
                              style={{
                                padding: '7px 6px',
                                borderRadius: 7,
                                textAlign: 'center',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: sl.booked ? 'not-allowed' : 'pointer',
                                background: form.scheduled_time === sl.time ? '#378add' : sl.booked ? '#f8f9fb' : '#f0f4f8',
                                color: form.scheduled_time === sl.time ? 'white' : sl.booked ? '#d1d5db' : '#1a1a2e',
                                border: `1px solid ${form.scheduled_time === sl.time ? '#378add' : sl.booked ? '#222' : '#e2e4e8'}`,
                                textDecoration: sl.booked ? 'line-through' : 'none',
                              }}
                            >
                              {sl.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {form.tech_id && form.scheduled_time && (
                <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, fontSize: 12, color: '#10b981' }}>
                  ✅ {techs.find(t => t.id === form.tech_id)?.name} · {form.scheduled_time} on {form.follow_up_date}
                </div>
              )}
            </div>
            <div style={{ background: '#f8f9fb', border: '1px solid #e2e4e8', borderRadius: 8, padding: 12, fontSize: 11, color: '#6b7280', lineHeight: 1.7, maxHeight: 90, overflowY: 'auto', marginBottom: 12 }}>{form.service === 'quarterly' ? AGREEMENT_QUARTERLY : AGREEMENT_ONETIME}</div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Customer Signature</label>
              <SignaturePad onSign={(sig) => set('signature', sig)} signature={form.signature} />
            </div>
          </>
        )}
        {form.status === 'follow-up' && <div style={{ marginBottom: 12 }}><label style={s.label}>Follow-Up Date</label><input style={s.input} type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)} /></div>}
        <div style={{ marginBottom: 12 }}><label style={s.label}>Notes</label><textarea style={{ ...s.input, resize: 'vertical' }} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Gate code, dog, # of windows, best time..." /></div>
        <div style={{ border: '2px dashed #2a2a3a', borderRadius: 8, padding: 16, textAlign: 'center', color: '#6b7280', fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>📷 Add Before/After Photos (coming soon)</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pin?.id && (
            <button style={{ ...s.btnGhost, color: '#ef4444', borderColor: '#ef4444' }} onClick={() => { onDelete(pin.id); onClose(); }}>🗑</button>
          )}
          <button style={{ ...s.btnGhost, flex: 1 }} onClick={onClose}>Cancel</button>
          <button style={{ ...s.btnAccent, flex: 2, padding: '10px' }} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Door Log'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Map View ─────────────────────────────────────────────────────────────────
const GOOGLE_MAPS_API_KEY = 'AIzaSyC9Ht86RatKeP8grKML8gzWmDts5Z0J0NM';
const LUBBOCK_CENTER = { lat: 33.5779, lng: -101.8552 };

function loadGoogleMaps() {
  return new Promise((resolve) => {
    if (window.google && window.google.maps) { resolve(); return; }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function MapView({ pins, setPins, currentUser, allUsers, jobs, setJobs, zones, setZones }) {
  const [modal, setModal] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const [zoneModal, setZoneModal] = useState(false);
  const [pendingZone, setPendingZone] = useState(null);
  const [zoneForm, setZoneForm] = useState({ name: '', repId: '' });
  const mapDivRef = React.useRef(null);
  const googleMapRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const locationMarkerRef = React.useRef(null);
  const locationWatchRef = React.useRef(null);
  const drawingPointsRef = React.useRef([]);
  const tempMarkersRef = React.useRef([]);
  const tempPolylineRef = React.useRef(null);
  const zonePolygonsRef = React.useRef([]);
  const finishDrawingRef = React.useRef(null);
  const techs = allUsers.filter(u => u.role === 'tech');
  const reps = allUsers.filter(u => u.role === 'rep' || u.role === 'admin');
  const visiblePins = currentUser.role === 'admin' ? pins : pins.filter(p => p.rep_id === currentUser.id);

  useEffect(() => {
    loadGoogleMaps().then(() => {
      if (!mapDivRef.current) return;
      const map = new window.google.maps.Map(mapDivRef.current, {
        center: LUBBOCK_CENTER,
        zoom: 18,
        mapTypeId: 'hybrid',
        tilt: 0,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
          mapTypeIds: ['hybrid', 'roadmap'],
          style: window.google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        },
        streetViewControl: false,
        fullscreenControl: true,
      });
      googleMapRef.current = map;

      // Live location tracking
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          map.panTo(loc);
          map.setZoom(18);
        });
        locationWatchRef.current = navigator.geolocation.watchPosition(pos => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          if (locationMarkerRef.current) {
            locationMarkerRef.current.setPosition(loc);
          } else {
            locationMarkerRef.current = new window.google.maps.Marker({
              position: loc,
              map,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#378add',
                fillOpacity: 1,
                strokeColor: 'white',
                strokeWeight: 3,
              },
              title: 'You are here',
              zIndex: 999,
            });
          }
        }, null, { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 });
      }

      // Single unified click handler — drawing mode + pin drop
      map.addListener('click', async (e) => {
        if (window._drawingActive) {
          const pt = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          drawingPointsRef.current = [...drawingPointsRef.current, pt];
          setDrawingPoints(prev => [...prev, pt]);
          const m = new window.google.maps.Marker({
            position: pt, map,
            icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: '#378add', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 },
            zIndex: 10,
          });
          tempMarkersRef.current.push(m);
          if (tempPolylineRef.current) tempPolylineRef.current.setMap(null);
          tempPolylineRef.current = new window.google.maps.Polyline({
            path: [...drawingPointsRef.current, drawingPointsRef.current[0]],
            strokeColor: '#378add', strokeWeight: 2, strokeOpacity: 0.8, map,
          });
          return;
        }
        if (currentUser.role === 'tech') return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        const tempMarker = new window.google.maps.Marker({
          position: { lat, lng }, map,
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 12, fillColor: '#f59e0b', fillOpacity: 0.8, strokeColor: 'white', strokeWeight: 2 },
          title: 'Loading address...', animation: window.google.maps.Animation.BOUNCE,
        });
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          tempMarker.setMap(null);
          const address = status === 'OK' && results[0] ? results[0].formatted_address : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setModal({ lat, lng, address, rep_id: currentUser.id, rep_name: currentUser.name });
        });
      });

      map.addListener('dblclick', () => {
        if (!window._drawingActive) return;
        if (drawingPointsRef.current.length < 3) { alert('Click at least 3 points first'); return; }
        if (finishDrawingRef.current) finishDrawingRef.current();
      });
      setMapReady(true);
    });
    return () => {
      if (locationWatchRef.current) navigator.geolocation.clearWatch(locationWatchRef.current);
    };
  }, []);

  // Render pins as markers on the map
  useEffect(() => {
    if (!googleMapRef.current || !mapReady) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    visiblePins.forEach(pin => {
      if (!pin.lat || !pin.lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat: pin.lat, lng: pin.lng },
        map: googleMapRef.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: PIN_COLORS[pin.status] || '#888',
          fillOpacity: 1,
          strokeColor: 'rgba(255,255,255,0.5)',
          strokeWeight: 2,
        },
        title: pin.address,
      });
      marker.addListener('click', () => { if (!drawingPointsRef.current.length) setModal(pin); });
      markersRef.current.push(marker);
    });
  }, [visiblePins, mapReady]);

  // Render gold star overlays for serviced pins - visible to everyone
  const starOverlaysRef = React.useRef([]);
  useEffect(() => {
    if (!googleMapRef.current || !mapReady) return;
    // Clear old star overlays
    starOverlaysRef.current.forEach(o => o.setMap(null));
    starOverlaysRef.current = [];

    // Show gold star on all serviced/closed pins that have been cleaned
    const servicedPins = pins.filter(p => p.status === 'closed' || p.status === 'paid');
    servicedPins.forEach(pin => {
      if (!pin.lat || !pin.lng) return;
      const starEl = document.createElement('div');
      starEl.style.cssText = [
        'position: absolute',
        'font-size: 18px',
        'cursor: pointer',
        'user-select: none',
        'filter: drop-shadow(0 1px 3px rgba(0,0,0,0.4))',
        'transform: translate(-50%, -100%)',
        'margin-top: -8px',
      ].join(';');
      starEl.textContent = '⭐';
      starEl.title = `${pin.name || 'Customer'} · $${pin.price || 0} · Previously serviced`;

      // Click to show info
      starEl.onclick = () => {
        window._starInfo = pin;
        const info = new window.google.maps.InfoWindow({
          content: `<div style="font-family:Inter,sans-serif;padding:4px;min-width:180px">
            <div style="font-weight:700;font-size:14px;margin-bottom:4px">⭐ ${pin.name || 'Customer'}</div>
            <div style="font-size:12px;color:#6b7280;margin-bottom:2px">📍 ${pin.address?.split(',')[0] || ''}</div>
            <div style="font-size:12px;margin-bottom:2px"><b>Sold:</b> $${pin.price || 0} · ${pin.service || ''}</div>
            <div style="font-size:11px;color:#9ca3af">Previously serviced — potential re-sell</div>
          </div>`,
          position: { lat: pin.lat, lng: pin.lng },
        });
        info.open(googleMapRef.current);
      };

      const overlay = new window.google.maps.OverlayView();
      overlay.onAdd = function() {
        this.getPanes().floatPane.appendChild(starEl);
      };
      overlay.draw = function() {
        const pos = this.getProjection().fromLatLngToDivPixel({ lat: pin.lat, lng: pin.lng });
        if (pos) {
          starEl.style.left = pos.x + 'px';
          starEl.style.top = (pos.y - 20) + 'px';
        }
      };
      overlay.onRemove = function() {
        if (starEl.parentNode) starEl.parentNode.removeChild(starEl);
      };
      overlay.setMap(googleMapRef.current);
      starOverlaysRef.current.push(overlay);
    });
  }, [pins, mapReady]);

  // Render zone polygons on the map - visible to all roles
  useEffect(() => {
    if (!googleMapRef.current || !mapReady || !zones) return;
    zonePolygonsRef.current.forEach(p => p.setMap(null));
    zonePolygonsRef.current = [];
    // Show all zones to admin, only assigned zones to reps
    const visibleZones = currentUser.role === 'admin' 
      ? zones 
      : zones.filter(z => !z.rep_id || z.rep_id === currentUser.id);
    visibleZones.forEach(zone => {
      const rep = allUsers.find(u => u.id === zone.rep_id);
      const isMyZone = zone.rep_id === currentUser.id;
      const polygon = new window.google.maps.Polygon({
        paths: zone.points,
        strokeColor: isMyZone ? '#10b981' : '#378add',
        strokeOpacity: 0.9,
        strokeWeight: isMyZone ? 3 : 2,
        fillColor: isMyZone ? '#0a3328' : '#1a3a6e',
        fillOpacity: 0.2,
        clickable: false,
        map: googleMapRef.current,
      });
      // Zone label - avatar circle with initials
      const bounds = new window.google.maps.LatLngBounds();
      zone.points.forEach(p => bounds.extend(p));
      const center = bounds.getCenter();
      const initials = rep ? rep.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '?';
      const labelEl = document.createElement('div');
      labelEl.style.cssText = [
        'background: #185fa5',
        'color: white',
        'width: 42px',
        'height: 42px',
        'border-radius: 50%',
        'display: flex',
        'align-items: center',
        'justify-content: center',
        'font-weight: 700',
        'font-size: 15px',
        'font-family: Inter, sans-serif',
        'border: 3px solid white',
        'box-shadow: 0 2px 10px rgba(0,0,0,0.35)',
        'cursor: default',
        'user-select: none',
        'letter-spacing: 0.5px',
      ].join(';');
      labelEl.textContent = initials;
      labelEl.title = `${zone.name}${rep ? ' · ' + rep.name : ''}`;
      const overlay = new window.google.maps.OverlayView();
      overlay.onAdd = function() {
        this.getPanes().floatPane.appendChild(labelEl);
      };
      overlay.draw = function() {
        const pos = this.getProjection().fromLatLngToDivPixel(center);
        if (pos) {
          labelEl.style.left = (pos.x - 21) + 'px';
          labelEl.style.top = (pos.y - 21) + 'px';
          labelEl.style.position = 'absolute';
        }
      };
      overlay.onRemove = function() {
        if (labelEl.parentNode) labelEl.parentNode.removeChild(labelEl);
      };
      overlay.setMap(googleMapRef.current);
      zonePolygonsRef.current.push(polygon, overlay);
    });
  }, [zones, mapReady]);



  const startDrawing = () => {
    drawingPointsRef.current = [];
    setDrawingPoints([]);
    window._drawingActive = true;
    setDrawingMode(true);
    googleMapRef.current.setOptions({ cursor: 'crosshair' });
  };

  const finishDrawing = () => {
    if (drawingPointsRef.current.length < 3) {
      alert('Draw at least 3 points to create a zone');
      return;
    }
    window._drawingActive = false;
    setDrawingMode(false);
    googleMapRef.current.setOptions({ cursor: '' });
    // Clear temp polyline
    if (tempPolylineRef.current) { tempPolylineRef.current.setMap(null); tempPolylineRef.current = null; }
    setPendingZone([...drawingPointsRef.current]);
    setZoneForm({ name: '', repId: '' });
    setZoneModal(true);
  };
  finishDrawingRef.current = finishDrawing;

  const cancelDrawing = () => {
    window._drawingActive = false;
    setDrawingMode(false);
    drawingPointsRef.current = [];
    setDrawingPoints([]);
    tempMarkersRef.current.forEach(m => m.setMap(null));
    tempMarkersRef.current = [];
    if (tempPolylineRef.current) tempPolylineRef.current.setMap(null);
    googleMapRef.current.setOptions({ cursor: '' });
  };

  const saveZone = async () => {
    if (!zoneForm.name) { alert('Give the zone a name'); return; }
    const newZone = { name: zoneForm.name, rep_id: zoneForm.repId || null, points: pendingZone };
    const { data: saved } = await supabase.from('zones').insert(newZone).select().single();
    if (saved) setZones(zs => [...(zs || []), saved]);
    // Clear temp drawing
    tempMarkersRef.current.forEach(m => m.setMap(null));
    tempMarkersRef.current = [];
    if (tempPolylineRef.current) tempPolylineRef.current.setMap(null);
    drawingPointsRef.current = [];
    setDrawingPoints([]);
    setZoneModal(false);
    setPendingZone(null);
  };

  const deleteZone = async (zoneId) => {
    await supabase.from('zones').delete().eq('id', zoneId);
    setZones(zs => zs.filter(z => z.id !== zoneId));
  };

  const handleSave = async (data) => {
    const jobPayload = {
      address: data.address,
      customer_name: data.name,
      service: data.service,
      price: data.price,
      monthly_price: data.service === 'quarterly' ? data.price / 3 : null,
      status: 'scheduled',
      rep_id: data.rep_id,
      tech_id: data.tech_id || null,
      scheduled_date: data.follow_up_date || null,
      scheduled_time: data.scheduled_time || null,
      agreement_signed: data.agreed,
      card_on_file: false,
      notes: data.notes,
      pin_id: data.id || null,
    };

    if (data.id) {
      // Update existing pin
      const { data: updated } = await supabase.from('pins').update({
        address: data.address, name: data.name, status: data.status,
        service: data.service, price: data.price, notes: data.notes,
        follow_up_date: data.follow_up_date || null,
        tech_id: data.tech_id || null, agreed: data.agreed,
      }).eq('id', data.id).select().single();
      setPins(ps => ps.map(p => p.id === data.id ? updated : p));

      // Find existing job for this pin
      const { data: existingJob } = await supabase.from('jobs')
        .select('id, status').eq('address', data.address).eq('rep_id', data.rep_id).maybeSingle();

      if (data.status === 'closed') {
        // Pin closed = job moves to serviced
        const now = new Date();
        if (existingJob) {
          const { data: updatedJob } = await supabase.from('jobs').update({
            status: 'serviced',
            completed_date: now.toISOString().split('T')[0],
            tech_id: data.tech_id || existingJob.tech_id || null,
            price: data.price || 0,
            service: data.service,
          }).eq('id', existingJob.id).select().single();
          setJobs(js => js.map(j => j.id === existingJob.id ? updatedJob : j));
        } else {
          // No job yet — create one as serviced
          const { data: newJob } = await supabase.from('jobs').insert({
            ...jobPayload,
            status: 'serviced',
            completed_date: now.toISOString().split('T')[0],
          }).select().single();
          setJobs(js => [newJob, ...js]);
        }
      } else if (['appointment'].includes(data.status) && data.tech_id) {
        if (existingJob) {
          await supabase.from('jobs').update(jobPayload).eq('id', existingJob.id);
          setJobs(js => js.map(j => j.id === existingJob.id ? { ...j, ...jobPayload } : j));
        } else {
          const { data: newJob } = await supabase.from('jobs').insert(jobPayload).select().single();
          setJobs(js => [newJob, ...js]);
        }
      }
    } else {
      // New pin
      const { data: inserted } = await supabase.from('pins').insert({
        lat: data.lat, lng: data.lng, x: 50, y: 50,
        address: data.address, name: data.name, status: data.status,
        service: data.service || null, price: data.price || null,
        notes: data.notes, follow_up_date: data.follow_up_date || null,
        rep_id: data.rep_id, tech_id: data.tech_id || null, agreed: data.agreed,
        pinned_at: new Date().toISOString(),
      }).select().single();
      setPins(ps => [...ps, inserted]);

      if (['appointment', 'closed'].includes(data.status) && data.tech_id) {
        await supabase.from('jobs').insert({ ...jobPayload, rep_id: data.rep_id });
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}>
        <div style={s.topbarTitle}>🗺 Field Map — Lubbock, TX</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {Object.entries(PIN_COLORS).map(([k, c]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#6b7280' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
              {STATUS_CONFIG[k]?.label}
            </span>
          ))}
          <span style={{ fontSize: 11, color: '#378add', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.2)', borderRadius: 8, padding: '3px 10px' }}>{visiblePins.length} pins</span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        {!mapReady && (
          <div style={{ position: 'absolute', inset: 0, background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: 14 }}>
            Loading map...
          </div>
        )}
        {mapReady && (
          <button onClick={() => {
            if (locationMarkerRef.current) {
              googleMapRef.current.panTo(locationMarkerRef.current.getPosition());
              googleMapRef.current.setZoom(18);
            } else if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(pos => {
                googleMapRef.current.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                googleMapRef.current.setZoom(18);
              });
            }
          }} style={{ position: 'absolute', top: 60, right: 10, background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#378add', cursor: 'pointer', zIndex: 10, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            🎯 Find Me
          </button>
        )}

        {/* Zone drawing controls — admin only */}
        {currentUser.role === 'admin' && mapReady && !drawingMode && (
          <button onClick={startDrawing} style={{ position: 'absolute', top: 100, right: 10, background: '#ffffff', border: '1px solid #4f8ef7', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#378add', cursor: 'pointer', zIndex: 10, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            🖊 Draw Zone
          </button>
        )}

        {drawingMode && (
          <div style={{ position: 'absolute', top: 100, right: 10, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>
            <div style={{ background: 'rgba(55,138,221,0.15)', border: '1px solid #4f8ef7', borderRadius: 8, padding: '8px 12px', fontSize: 11, color: '#378add', textAlign: 'center' }}>
              {drawingPoints.length} points · Double-click to finish
            </div>
            <button onClick={finishDrawing} style={{ background: '#10b981', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'white', cursor: 'pointer', fontWeight: 600 }}>
              ✅ Finish Zone
            </button>
            <button onClick={cancelDrawing} style={{ background: '#f8f9fb', border: '1px solid #ef4444', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}>
              ✕ Cancel
            </button>
          </div>
        )}

        {/* Zone list — admin only */}
        {currentUser.role === 'admin' && mapReady && zones && zones.length > 0 && !drawingMode && (
          <div style={{ position: 'absolute', bottom: 40, right: 10, background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 10, padding: 12, zIndex: 10, maxWidth: 200 }}>
            <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Zones</div>
            {zones.map(zone => {
              const rep = allUsers.find(u => u.id === zone.rep_id);
              return (
                <div key={zone.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{zone.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{rep ? rep.name.split(' ')[0] : 'Unassigned'}</div>
                  </div>
                  <button onClick={() => deleteZone(zone.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, padding: '2px 6px' }}>🗑</button>
                </div>
              );
            })}
          </div>
        )}

        {(currentUser.role === 'rep' || currentUser.role === 'admin') && mapReady && !drawingMode && (
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 8, padding: '7px 14px', fontSize: 12, color: '#6b7280', zIndex: 10 }}>
            📍 Tap any house to log a door
          </div>
        )}
      </div>
      {zoneModal && (
        <div style={s.backdrop} onClick={e => e.target === e.currentTarget && setZoneModal(false)}>
          <div style={{ ...s.modal, width: 380 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Name This Zone</div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Zone Name</label>
              <input style={s.input} value={zoneForm.name} onChange={e => setZoneForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Maxey Ranch, Vintage Township" autoFocus />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Assign to Rep</label>
              <select style={s.select} value={zoneForm.repId} onChange={e => setZoneForm(f => ({ ...f, repId: e.target.value }))}>
                <option value="">— Unassigned —</option>
                {reps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...s.btnGhost, flex: 1 }} onClick={() => { setZoneModal(false); cancelDrawing(); }}>Cancel</button>
              <button style={{ ...s.btnAccent, flex: 2, padding: 10 }} onClick={saveZone}>Save Zone</button>
            </div>
          </div>
        </div>
      )}
      {modal && <DoorLogModal pin={modal} onClose={() => setModal(null)} onSave={handleSave} techs={techs} allJobs={jobs} onDelete={async (id) => {
        const pin = pins.find(p => p.id === id);
        // Delete pin
        await supabase.from('pins').delete().eq('id', id);
        setPins(ps => ps.filter(p => p.id !== id));
        // Delete ALL jobs linked to this pin
        if (pin) {
          // Try by pin_id first, fallback to address+rep match
          let query = supabase.from('jobs').select('id');
          if (pin.id) {
            const { data: byPinId } = await query.eq('pin_id', pin.id);
            const { data: byAddress } = await supabase.from('jobs').select('id').eq('address', pin.address).eq('rep_id', pin.rep_id);
            const allLinked = [...(byPinId || []), ...(byAddress || [])];
            const uniqueIds = [...new Set(allLinked.map(j => j.id))];
            if (uniqueIds.length > 0) {
              await supabase.from('jobs').delete().in('id', uniqueIds);
              setJobs(js => js.filter(j => !uniqueIds.includes(j.id)));
            }
          }
        }
      }} />}
    </div>
  );
}

// ─── Schedule View ────────────────────────────────────────────────────────────
function ScheduleView({ jobs, setJobs, currentUser, allUsers }) {
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('month'); // month | week | day
  const [currentDate, setCurrentDate] = useState(new Date());
  const isMobile = useIsMobile();
  const today = new Date();
  const visible = currentUser.role === 'admin' ? jobs : currentUser.role === 'rep' ? jobs.filter(j => String(j.rep_id) === String(currentUser.id)) : jobs.filter(j => String(j.tech_id) === String(currentUser.id));
  const techs = allUsers.filter(u => u.role === 'tech');

  const markServiced = async (job) => {
    const now = new Date();
    const { data: updated } = await supabase.from('jobs').update({
      status: 'serviced',
      completed_date: now.toISOString().split('T')[0],
      scheduled_time: job.scheduled_time || now.toTimeString().slice(0,5),
    }).eq('id', job.id).select().single();
    setJobs(js => js.map(j => j.id === job.id ? updated : j));
    // Auto-close linked pin
    if (job.address && job.rep_id) {
      const { data: linkedPin } = await supabase.from('pins').select('id').eq('address', job.address).eq('rep_id', job.rep_id).maybeSingle();
      if (linkedPin) await supabase.from('pins').update({ status: 'closed' }).eq('id', linkedPin.id);
    }
    setSelected(null);
  };

  const markComplete = async (job) => {
    const { data: updated } = await supabase.from('jobs').update({ status: 'complete' }).eq('id', job.id).select().single();
    setJobs(js => js.map(j => j.id === job.id ? updated : j));
    setSelected(null);
  };

  const jobsForDate = (date) => visible.filter(j => {
    if (!j.scheduled_date) return false;
    // Compare as plain date strings to avoid timezone issues
    const jDate = j.scheduled_date.slice(0, 10);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return jDate === `${y}-${m}-${d}`;
  });

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    if (view === 'week') d.setDate(d.getDate() + dir * 7);
    if (view === 'day') d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const headerLabel = () => {
    if (view === 'month') return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (view === 'week') {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start); end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString('default', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // MONTH VIEW
  const MonthView = () => {
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const cells = Array.from({ length: 35 }, (_, i) => {
      const d = i - startDay + 1;
      return { d, valid: d >= 1 && d <= daysInMonth };
    });
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, background: '#e2e4e8', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{ background: '#f8f9fb', padding: '8px 10px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>{d}</div>)}
        {cells.map((cell, i) => {
          if (!cell.valid) return <div key={i} style={{ background: '#f0f4f8', minHeight: 72 }} />;
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), cell.d);
          const dj = jobsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div key={i} style={{ background: isToday ? 'rgba(55,138,221,0.08)' : '#ffffff', padding: 8, minHeight: 72, cursor: dj.length ? 'pointer' : 'default' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: isToday ? '#378add' : '#6b7280', marginBottom: 3 }}>{cell.d}</div>
              {dj.slice(0, 2).map(j => (
                <div key={j.id} onClick={() => setSelected(j)} style={{ background: 'rgba(55,138,221,0.15)', borderLeft: '2px solid #4f8ef7', padding: '2px 5px', borderRadius: 3, fontSize: 10, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {j.scheduled_time || ''} {j.customer_name?.split(' ')[0] || 'Job'}
                </div>
              ))}
              {dj.length > 2 && <div style={{ fontSize: 9, color: '#9ca3af' }}>+{dj.length - 2} more</div>}
            </div>
          );
        })}
      </div>
    );
  };

  // WEEK VIEW
  const WeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek); d.setDate(d.getDate() + i); return d;
    });
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, background: '#e2e4e8', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        {weekDays.map((date, i) => {
          const dj = jobsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          return (
            <div key={i} style={{ background: '#f8f9fb' }}>
              <div style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid #2a2a3a', background: isToday ? 'rgba(55,138,221,0.1)' : '#f8f9fb' }}>
                <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase' }}>{date.toLocaleString('default', { weekday: 'short' })}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? '#378add' : '#1a1a2e' }}>{date.getDate()}</div>
              </div>
              <div style={{ padding: 6, minHeight: 120 }}>
                {dj.map(j => (
                  <div key={j.id} onClick={() => setSelected(j)} style={{ background: 'rgba(55,138,221,0.15)', borderLeft: '2px solid #4f8ef7', padding: '4px 6px', borderRadius: 4, fontSize: 11, marginBottom: 4, cursor: 'pointer' }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.customer_name?.split(' ')[0]}</div>
                    <div style={{ color: '#6b7280', fontSize: 10 }}>{j.scheduled_time || 'No time'}</div>
                  </div>
                ))}
                {dj.length === 0 && <div style={{ color: '#d1d5db', fontSize: 11, textAlign: 'center', paddingTop: 16 }}>—</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // DAY VIEW
  const DayView = () => {
    const hours = Array.from({ length: 13 }, (_, i) => i + 7); // 7am to 7pm
    const dj = jobsForDate(currentDate);
    const getHour = (time) => {
      if (!time) return null;
      const [h] = time.split(':').map(Number);
      return h;
    };
    return (
      <div style={{ background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        {dj.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
            <div>No jobs scheduled for this day</div>
          </div>
        )}
        {hours.map(hour => {
          const hourJobs = dj.filter(j => getHour(j.scheduled_time) === hour);
          const label = hour === 12 ? '12 PM' : hour > 12 ? `${hour-12} PM` : `${hour} AM`;
          return (
            <div key={hour} style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.04)', minHeight: 52 }}>
              <div style={{ width: 64, padding: '8px 12px', fontSize: 11, color: '#9ca3af', borderRight: '1px solid #2a2a3a', flexShrink: 0, paddingTop: 10 }}>{label}</div>
              <div style={{ flex: 1, padding: '6px 10px' }}>
                {hourJobs.map(j => (
                  <div key={j.id} onClick={() => setSelected(j)} style={{ background: 'rgba(55,138,221,0.15)', borderLeft: '3px solid #4f8ef7', padding: '6px 10px', borderRadius: 6, marginBottom: 4, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{j.customer_name}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{j.address} · {j.service}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Badge status={j.status} />
                      <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700, marginTop: 2 }}>${j.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ ...s.topbar, flexWrap: isMobile ? 'wrap' : 'nowrap', height: isMobile ? 'auto' : 52, padding: isMobile ? '8px 12px' : '0 20px', gap: isMobile ? 8 : 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12 }}>
          <button onClick={() => navigate(-1)} style={{ ...s.btnGhost, padding: '4px 8px' }}>‹</button>
          <div style={{ fontWeight: 700, fontSize: isMobile ? 12 : 14, minWidth: isMobile ? 120 : 200, textAlign: 'center' }}>{headerLabel()}</div>
          <button onClick={() => navigate(1)} style={{ ...s.btnGhost, padding: '4px 8px' }}>›</button>
          <button onClick={() => setCurrentDate(new Date())} style={{ ...s.btnGhost, fontSize: 11 }}>Today</button>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['month','week','day'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ ...s.btnGhost, background: view === v ? '#378add' : '#f8f9fb', color: view === v ? 'white' : '#6b7280', border: 'none', textTransform: 'capitalize', fontSize: isMobile ? 11 : 12, padding: isMobile ? '4px 8px' : '7px 14px' }}>{v}</button>
          ))}
        </div>
      </div>
      <div style={{ ...s.page, padding: isMobile ? 12 : 20 }}>
        {currentUser.role === 'rep' && (
          <div style={{ ...s.card(), marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🧑‍🔧 Tech Availability</div>
            {techs.map((t, i) => (
              <div key={t.id} style={s.techSlot(i === 0)}>
                <Avatar name={t.name} role="tech" size={26} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                <span style={{ fontSize: 11, color: '#6b7280' }}>{i === 0 ? 'Tomorrow, 9:00 AM' : 'Thu, 11:00 AM'}</span>
                {i === 0 && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>Nearest</span>}
              </div>
            ))}
          </div>
        )}
        {view === 'month' && <MonthView />}
        {view === 'week' && <WeekView />}
        {view === 'day' && <DayView />}
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e4e8', fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>All Jobs</div>
          {visible.map(j => (
            <div key={j.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setSelected(j)}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{j.customer_name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{j.scheduled_date || '—'} {j.scheduled_time && `· ${j.scheduled_time}`} · <span style={{ textTransform: 'capitalize' }}>{j.service}</span></div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 3 }}>${j.price}</div>
                <Badge status={j.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div style={s.backdrop} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={isMobile ? { background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxHeight: '92vh', overflowY: 'auto', position: 'fixed', bottom: 0, left: 0, right: 0 } : s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Job Details</div>
              <button onClick={() => setSelected(null)} style={{ background: '#f8f9fb', border: 'none', color: '#6b7280', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
            <div style={s.twoCol}>
              {[['Customer', selected.customer_name], ['Address', selected.address], ['Service', selected.service], ['Scheduled', `${selected.scheduled_date || '—'} ${selected.scheduled_time ? '· ' + selected.scheduled_time : ''}`], ['Price', `$${selected.price}${selected.monthly_price ? ` ($${selected.monthly_price}/mo)` : ''}`], ['Completed', selected.completed_date || '—']].map(([k, v]) => (
                <div key={k}><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>{k}</div><div style={{ fontSize: 13, fontWeight: k === 'Price' ? 700 : 400, color: k === 'Price' ? '#10b981' : '#1a1a2e', textTransform: k === 'Service' ? 'capitalize' : 'none' }}>{v}</div></div>
              ))}
              <div><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 3 }}>Status</div><Badge status={selected.status} /></div>
            </div>
            {selected.notes && (
              <div style={{ marginBottom: 14, padding: '10px 14px', background: '#f8f9fb', borderRadius: 8, borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>📝 Notes</div>
                <div style={{ fontSize: 13, color: '#1a1a2e', lineHeight: 1.6 }}>{selected.notes}</div>
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 8 }}>Photo Documentation</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {(selected.photos || []).map((p, i) => <div key={i} style={{ aspectRatio: '1', background: '#f8f9fb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{p === 'before' ? '📸' : '✨'}</div>)}
                <div style={{ aspectRatio: '1', background: '#f8f9fb', border: '1px dashed #2a2a3a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', color: '#9ca3af' }}>+</div>
              </div>
            </div>
            {selected.status === 'scheduled' && currentUser.role === 'tech' && (
              <button style={{ ...s.btnGreen, width: '100%', padding: 11, fontSize: 13, marginTop: 16 }} onClick={() => markServiced(selected)}>✅ Mark as Serviced</button>
            )}
            {selected.status === 'serviced' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 10, textAlign: 'center', fontSize: 12, color: '#10b981', marginBottom: 8 }}>
                  ✅ Serviced · Pending payment collection
                </div>
                {currentUser.role === 'admin' && (
                  <button style={{ ...s.btnPrimary, marginTop: 0, background: '#f59e0b' }} onClick={() => markComplete(selected)}>⭐ Mark Complete — Payment Collected</button>
                )}
              </div>
            )}
            {(selected.status === 'complete' || selected.status === 'paid') && (
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, padding: 12, textAlign: 'center', fontSize: 13, color: '#f59e0b', marginTop: 16, fontWeight: 700 }}>⭐ Complete ⭐ · ${selected.price} collected</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
// ─── Revenue Chart ───────────────────────────────────────────────────────────
function RevenueChart({ jobs }) {
  const [view, setView] = useState('month');
  const [expanded, setExpanded] = useState(true);
  const [hovered, setHovered] = useState(null);
  const now = new Date();

  const buildData = () => {
    if (view === 'day') {
      // Last 24 hours by hour
      return Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now);
        hour.setHours(now.getHours() - 23 + i, 0, 0, 0);
        const label = hour.toLocaleTimeString('default', { hour: 'numeric', hour12: true });
        const collected = jobs.filter(j => {
          if (!j.completed_date) return false;
          const d = new Date(j.completed_date);
          return d.getHours() === hour.getHours() && d.toDateString() === hour.toDateString() && ['complete','paid'].includes(j.status);
        }).reduce((s, j) => s + (j.price || 0), 0);
        const pending = jobs.filter(j => {
          if (!j.completed_date) return false;
          const d = new Date(j.completed_date);
          return d.getHours() === hour.getHours() && d.toDateString() === hour.toDateString() && j.status === 'serviced';
        }).reduce((s, j) => s + (j.price || 0), 0);
        return { label, collected, pending };
      });
    }
    if (view === 'week') {
      // Last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now);
        day.setDate(now.getDate() - 6 + i);
        const label = day.toLocaleDateString('default', { weekday: 'short', month: 'numeric', day: 'numeric' });
        const dateStr = day.toISOString().split('T')[0];
        const collected = jobs.filter(j => j.completed_date === dateStr && ['complete','paid'].includes(j.status)).reduce((s, j) => s + (j.price || 0), 0);
        const pending = jobs.filter(j => j.completed_date === dateStr && j.status === 'serviced').reduce((s, j) => s + (j.price || 0), 0);
        return { label, collected, pending };
      });
    }
    if (view === 'month') {
      // Last 6 months
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const label = d.toLocaleDateString('default', { month: 'short', year: '2-digit' });
        const collected = jobs.filter(j => {
          if (!j.completed_date) return false;
          const jd = new Date(j.completed_date);
          return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear() && ['complete','paid'].includes(j.status);
        }).reduce((s, j) => s + (j.price || 0), 0);
        const pending = jobs.filter(j => {
          if (!j.completed_date) return false;
          const jd = new Date(j.completed_date);
          return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear() && j.status === 'serviced';
        }).reduce((s, j) => s + (j.price || 0), 0);
        return { label, collected, pending };
      });
    }
    if (view === 'year') {
      // Last 12 months grouped by month
      return Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const label = d.toLocaleDateString('default', { month: 'short' });
        const collected = jobs.filter(j => {
          if (!j.completed_date) return false;
          const jd = new Date(j.completed_date);
          return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear() && ['complete','paid'].includes(j.status);
        }).reduce((s, j) => s + (j.price || 0), 0);
        const pending = jobs.filter(j => {
          if (!j.completed_date) return false;
          const jd = new Date(j.completed_date);
          return jd.getMonth() === d.getMonth() && jd.getFullYear() === d.getFullYear() && j.status === 'serviced';
        }).reduce((s, j) => s + (j.price || 0), 0);
        return { label, collected, pending };
      });
    }
    return [];
  };

  const data = buildData();
  const maxVal = Math.max(...data.map(d => d.collected + d.pending), 1);
  const chartH = 200;
  const chartW = 100;
  const pts_collected = data.map((d, i) => `${(i / (data.length - 1)) * chartW},${chartH - (d.collected / maxVal) * chartH}`).join(' ');
  const pts_pending = data.map((d, i) => `${(i / (data.length - 1)) * chartW},${chartH - ((d.collected + d.pending) / maxVal) * chartH}`).join(' ');


  return (
    <div style={{ ...s.card({ marginBottom: 20 }) }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expanded ? 16 : 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>📈 Revenue</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {expanded && ['day','week','month','year'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ ...s.btnGhost, background: view === v ? '#378add' : '#f8f9fb', color: view === v ? 'white' : '#6b7280', border: 'none', fontSize: 11, padding: '4px 10px', textTransform: 'capitalize' }}>{v}</button>
          ))}
          <button onClick={() => setExpanded(!expanded)} style={{ ...s.btnGhost, fontSize: 11, padding: '4px 10px' }}>{expanded ? '▲ Hide' : '▼ Show'}</button>
        </div>
      </div>

      {expanded && (
        <>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 12, height: 3, background: '#10b981', borderRadius: 2 }} />
              <span style={{ color: '#6b7280' }}>Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 12, height: 3, background: '#f59e0b', borderRadius: 2 }} />
              <span style={{ color: '#6b7280' }}>Collected</span>
            </div>
            {hovered !== null && (
              <div style={{ marginLeft: 'auto', fontSize: 12, color: '#1a1a2e' }}>
                <span style={{ color: '#6b7280' }}>{data[hovered]?.label}: </span>
                <span style={{ color: '#10b981', fontWeight: 700 }}>${data[hovered]?.collected} </span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>+${data[hovered]?.pending} pending</span>
              </div>
            )}
          </div>

          <div style={{ position: 'relative', height: chartH + 40, width: '100%', display: 'flex', gap: 8 }}>
            {/* Y-axis labels as HTML */}
            <div style={{ width: 36, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 30, paddingTop: 0 }}>
              {[1, 0.75, 0.5, 0.25, 0].map((p, i) => {
                const val = Math.round(maxVal * p);
                const label = val >= 1000 ? `$${(val/1000).toFixed(1)}k` : `$${val}`;
                return <div key={i} style={{ fontSize: 10, color: '#9ca3af', textAlign: 'right', lineHeight: 1 }}>{label}</div>;
              })}
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
            <svg viewBox={`0 -10 ${chartW} ${chartH + 20}`} preserveAspectRatio="none" style={{ width: '100%', height: chartH + 10, overflow: 'visible' }} xmlns="http://www.w3.org/2000/svg">
              {/* Grid lines only - no text */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
                <g key={i}>
                  <line x1="0" y1={chartH - p * chartH} x2={chartW} y2={chartH - p * chartH} stroke="#e8ecf0" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                </g>
              ))}

              {(() => {
                const toPath = (pts, close = false) => {
                  const arr = pts.split(' ');
                  let d = `M ${arr[0]}`;
                  for (let i = 1; i < arr.length; i++) d += ` L ${arr[i]}`;
                  if (close) d += ` L ${chartW},${chartH} L 0,${chartH} Z`;
                  return d;
                };
                const toSmoothPath = (pts) => {
                  const arr = pts.split(' ').map(p => p.split(',').map(Number));
                  if (arr.length < 2) return `M ${pts}`;
                  let d = `M ${arr[0][0]},${arr[0][1]}`;
                  for (let i = 1; i < arr.length; i++) {
                    const prev = arr[i-1], curr = arr[i];
                    const cpx = (prev[0] + curr[0]) / 2;
                    d += ` C ${cpx},${prev[1]} ${cpx},${curr[1]} ${curr[0]},${curr[1]}`;
                  }
                  return d;
                };
                return (
                  <>
                    <defs>
                      <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#378add" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#378add" stopOpacity="0"/>
                      </linearGradient>
                      <linearGradient id="gradPending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {/* Collected gradient area - smooth */}
                    <path d={toSmoothPath(pts_collected) + ` L ${chartW},${chartH} L 0,${chartH} Z`} fill="url(#gradCollected)" />
                    {/* Collected solid line - smooth */}
                    <path d={toSmoothPath(pts_collected)} fill="none" stroke="#378add" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                    {/* Pending gradient area - smooth */}
                    <path d={toSmoothPath(pts_pending) + ` L ${chartW},${chartH} L 0,${chartH} Z`} fill="url(#gradPending)" />
                    {/* Pending solid line - smooth */}
                    <path d={toSmoothPath(pts_pending)} fill="none" stroke="#10b981" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  </>
                );
              })()}

              {/* Hover zones - no dots */}
              {data.map((d, i) => {
                const x = (i / (data.length - 1)) * chartW;
                return (
                  <g key={i}>
                    <rect x={x - 4} y={0} width="8" height={chartH} fill="transparent"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    />
                    {hovered === i && <line x1={x} y1={0} x2={x} y2={chartH} stroke="#378add" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 2" />}
                  </g>
                );
              })}
            </svg>

            {/* X axis labels */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -4, paddingLeft: 36 }}>
              {data.map((d, i) => (
                <div key={i} style={{ fontSize: 10, color: hovered === i ? '#378add' : '#9ca3af', textAlign: 'center', flex: 1 }}>{d.label}</div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdminDashboard({ pins, jobs, allUsers, onRefresh }) {
  const isMobile = useIsMobile();
  const reps = allUsers.filter(u => u.role === 'rep');
  const techs = allUsers.filter(u => u.role === 'tech');
  const pendingRevenue = jobs.filter(j => j.status === 'serviced').reduce((s, j) => s + (j.price || 0), 0);
  const revenue = jobs.filter(j => ['complete','paid'].includes(j.status)).reduce((s, j) => s + (j.price || 0), 0);
  const scheduled = jobs.filter(j => j.status === 'scheduled').length;
  const serviced = jobs.filter(j => j.status === 'serviced').length;
  const pitches = pins.filter(p => ['gave-pitch','appointment','closed','paid','serviced'].includes(p.status)).length;
  const conv = pitches > 0 ? Math.round(pins.filter(p => ['closed','paid','appointment'].includes(p.status)).length / pitches * 100) : 0;
  const knockers = [...reps, ...allUsers.filter(u => u.role === 'admin')];
  const repStats = knockers.map(r => ({
    ...r,
    knocked: pins.filter(p => String(p.rep_id) === String(r.id)).length,
    closed: pins.filter(p => String(p.rep_id) === String(r.id) && ['closed','paid'].includes(p.status)).length,
    pipeline: jobs.filter(j => String(j.rep_id) === String(r.id) && ['scheduled','appointment'].includes(j.status)).reduce((s, j) => s + (j.price || 0), 0),
    collected: jobs.filter(j => String(j.rep_id) === String(r.id) && ['serviced','complete','paid'].includes(j.status)).reduce((s, j) => s + (j.price || 0), 0),
  }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}>
        <div style={s.topbarTitle}>📊 Admin Dashboard</div>
        <button style={s.btnGhost} onClick={onRefresh}>🔄 Refresh</button>
      </div>
      <div style={s.page}>
        {isMobile ? (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div style={s.card()}><div style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>⭐ Complete</div><div style={{ fontWeight: 700, fontSize: 20, color: '#f59e0b' }}>${revenue}</div></div>
              <div style={s.card()}><div style={{ fontSize: 10, color: '#6b7280', marginBottom: 3 }}>Pending Rev</div><div style={{ fontWeight: 700, fontSize: 20, color: '#10b981' }}>${pendingRevenue}</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <div style={{ ...s.card(), padding: 10 }}><div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>Scheduled</div><div style={{ fontWeight: 700, fontSize: 18, color: '#378add' }}>{scheduled}</div></div>
              <div style={{ ...s.card(), padding: 10 }}><div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>Serviced</div><div style={{ fontWeight: 700, fontSize: 18, color: '#10b981' }}>{serviced}</div></div>
              <div style={{ ...s.card(), padding: 10 }}><div style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>Conv.</div><div style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>{conv}%</div></div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { l: '⭐ Complete ⭐', v: `$${revenue}`, c: '#f59e0b' },
              { l: 'Pending Rev', v: `$${pendingRevenue}`, c: '#10b981' },
              { l: 'Scheduled', v: scheduled, c: '#378add' },
              { l: 'Serviced', v: serviced, c: '#10b981' },
              { l: 'Conversion', v: `${conv}%`, c: '#1a1a2e' },
            ].map((st, i) => (
              <div key={i} style={s.card()}><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{st.l}</div><div style={{ fontWeight: 800, fontSize: 24, color: st.c }}>{st.v}</div></div>
            ))}
          </div>
        )}
        <RevenueChart jobs={jobs} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 16 }}>
          <div style={s.card()}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Rep Performance</div>
            {repStats.length === 0 && <div style={{ color: '#9ca3af', fontSize: 13 }}>No reps yet</div>}
            {repStats.map(r => (
              <div key={r.id} style={{ marginBottom: 16, padding: 12, background: '#f8f9fb', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={r.name} role="rep" size={24} /><span style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</span></div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>Pipeline</div>
                    <div style={{ fontSize: 13, color: '#f59e0b', fontWeight: 700 }}>${r.pipeline || 0}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>Collected</div>
                    <div style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>${r.collected || 0}</div>
                  </div>
                </div>
                {[['Knocked', r.knocked, 10, '#6b7280'], ['Closed', r.closed, 25, '#10b981']].map(([label, val, mult, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#9ca3af', width: 60 }}>{label}</span>
                    <div style={{ flex: 1, height: 5, background: '#f5f7fa', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: `${Math.min(val * mult, 100)}%`, height: '100%', background: color, borderRadius: 3 }} /></div>
                    <span style={{ fontSize: 11, color: '#6b7280', width: 20, textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={s.card()}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Technician Status</div>
            {techs.map(t => {
              const tj = jobs.filter(j => String(j.tech_id) === String(t.id));
              return (
                <div key={t.id} style={{ marginBottom: 14, padding: 12, background: '#f8f9fb', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Avatar name={t.name} role="tech" size={28} /><div><div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div><div style={{ fontSize: 11, color: '#6b7280' }}>Technician</div></div></div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ fontSize: 12 }}><span style={{ color: '#f59e0b' }}>{tj.filter(j => j.status === 'scheduled').length}</span> pending</div>
                    <div style={{ fontSize: 12 }}><span style={{ color: '#10b981' }}>{tj.filter(j => ['serviced','complete','paid'].includes(j.status)).length}</span> done</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e4e8', fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>Recent Jobs</div>
          {jobs.slice(0, 20).map(j => { const rep = allUsers.find(u => u.id === j.rep_id); const tech = allUsers.find(u => u.id === j.tech_id); return (
            <div key={j.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{j.customer_name}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{rep?.name?.split(' ')[0] || '—'} → {tech?.name?.split(' ')[0] || '—'} · <span style={{ textTransform: 'capitalize' }}>{j.service}</span></div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: ['paid','complete','serviced'].includes(j.status) ? '#10b981' : '#1a1a2e', marginBottom: 3 }}>${j.price}</div>
                <Badge status={j.status} />
              </div>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}

// ─── Rep Dashboard ────────────────────────────────────────────────────────────
function RepDashboard({ pins, jobs, currentUser }) {
  const isMobile = useIsMobile();
  const my = pins.filter(p => String(p.rep_id) === String(currentUser.id));
  const knocked = my.length;
    const pitched = my.filter(p => ['gave-pitch','appointment','closed','paid'].includes(p.status)).length;
    const appts = my.filter(p => p.status === 'appointment').length;
    const closed = my.filter(p => ['closed','paid'].includes(p.status)).length;
  const rev = jobs.filter(j => j.rep_id === currentUser.id && ['complete','paid'].includes(j.status)).reduce((s, j) => s + (j.price || 0), 0);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>📈 My Stats</div></div>
      <div style={s.page}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 16 : 20 }}>
          {[{ l: 'Knocked', v: knocked, c: '#1a1a2e' }, { l: 'Appts Set', v: appts, c: '#f59e0b' }, { l: 'Closed', v: closed, c: '#378add' }, { l: 'Revenue', v: `$${rev}`, c: '#10b981' }].map((st, i) => <div key={i} style={s.card()}><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{st.l}</div><div style={{ fontWeight: 800, fontSize: isMobile ? 22 : 26, color: st.c }}>{st.v}</div></div>)}
        </div>
        <div style={{ ...s.card(), marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Conversion Funnel</div>
          {[['Knocked', knocked, 100, '#9ca3af'], ['Pitched', pitched, knocked ? (pitched/knocked)*100 : 0, '#185fa5'], ['Appt Set', appts, pitched ? (appts/pitched)*100 : 0, '#f59e0b'], ['Closed', closed, pitched ? (closed/pitched)*100 : 0, '#10b981']].map(([label, val, pct, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, width: 90 }}>{label}</span>
              <div style={{ flex: 1, height: 7, background: '#f8f9fb', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} /></div>
              <span style={{ fontSize: 12, color: '#6b7280', width: 24, textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf0', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e4e8', fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>My Pins</div>
          {my.slice(0, 15).map(p => (
            <div key={p.id} style={{ padding: '11px 16px', borderBottom: '1px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 1 }}>{p.name || 'Unknown'}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>{p.address}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                <Badge status={p.status} />
                {p.service && <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, textTransform: 'capitalize' }}>{p.service}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tech Dashboard ───────────────────────────────────────────────────────────
function TechDashboard({ jobs, setJobs, currentUser }) {
  const isMobile = useIsMobile();
  const my = jobs.filter(j => j.tech_id && String(j.tech_id).trim() === String(currentUser.id).trim());
  const pending = my.filter(j => j.status === 'scheduled');
  const done = my.filter(j => ['serviced','complete','paid'].includes(j.status));

  const markServiced = async (job) => {
    const now = new Date();
    const { data: updated } = await supabase.from('jobs').update({
      status: 'serviced',
      completed_date: now.toISOString().split('T')[0],
    }).eq('id', job.id).select().single();
    setJobs(js => js.map(j => j.id === job.id ? updated : j));
    // Auto-update linked pin from appointment to closed
    if (job.address && job.rep_id) {
      const { data: linkedPin } = await supabase.from('pins')
        .select('id').eq('address', job.address).eq('rep_id', job.rep_id).maybeSingle();
      if (linkedPin) {
        await supabase.from('pins').update({ status: 'closed' }).eq('id', linkedPin.id);
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>🔧 My Jobs</div></div>
      <div style={{ ...s.page, padding: isMobile ? 12 : 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={s.card()}><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Pending</div><div style={{ fontWeight: 800, fontSize: 26, color: '#f59e0b' }}>{pending.length}</div></div>
          <div style={s.card()}><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Completed</div><div style={{ fontWeight: 800, fontSize: 26, color: '#10b981' }}>{done.length}</div></div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Upcoming Jobs</div>
        {pending.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}><div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div><div>No pending jobs!</div></div>}
        {pending.map(j => (
          <div key={j.id} style={{ ...s.card({ borderLeft: '3px solid #4f8ef7', marginBottom: 12 }) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}><div style={{ fontWeight: 700 }}>{j.customer_name}</div><Badge status={j.status} /></div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>📍 {j.address}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>📅 {j.scheduled_date || '—'} {j.scheduled_time && `· ${j.scheduled_time}`} · <span style={{ textTransform: 'capitalize' }}>{j.service}</span> · ${j.price}</div>
            <button style={{ ...s.btnGreen, width: '100%', padding: isMobile ? 14 : 10, fontSize: isMobile ? 15 : 12 }} onClick={() => markServiced(j)}>✅ Mark as Serviced</button>
          </div>
        ))}
        {done.length > 0 && <>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 20 }}>Completed</div>
          {done.map(j => <div key={j.id} style={{ ...s.card({ marginBottom: 8, opacity: 0.7 }) }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 500, fontSize: 13 }}>{j.customer_name}</div><div style={{ fontSize: 11, color: '#6b7280' }}>{j.address} · {j.completed_date}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#10b981', fontWeight: 700 }}>${j.price}</span><Badge status={j.status} /></div></div></div>)}
        </>}
      </div>
    </div>
  );
}

// ─── Customers ────────────────────────────────────────────────────────────────
function CustomersView({ pins, jobs }) {
  const isMobile = useIsMobile();
  const customers = pins.filter(p => ['closed','paid','appointment'].includes(p.status));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>👥 Customers</div><span style={{ fontSize: 12, color: '#6b7280' }}>{customers.length} active</span></div>
      <div style={{ ...s.page, padding: isMobile ? 12 : 20 }}>
        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {customers.map(c => {
              const job = jobs.find(j => j.address === c.address);
              return (
                <div key={c.id} style={{ background: '#ffffff', border: '1px solid #e8ecf0', borderRadius: 8, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name || 'Unknown'}</div>
                    <Badge status={c.status} />
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>📍 {c.address}</div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, textTransform: 'capitalize' }}><span style={{ color: '#9ca3af' }}>Plan: </span>{c.service || '—'}</span>
                    <span style={{ fontSize: 12, fontWeight: 700 }}><span style={{ color: '#9ca3af', fontWeight: 400 }}>Price: </span>{c.price ? `$${c.price}` : '—'}</span>
                    <span style={{ fontSize: 12, color: job?.card_on_file ? '#10b981' : '#9ca3af' }}>{job?.card_on_file ? '✅ Card on file' : 'No card'}</span>
                  </div>
                  {c.notes && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 8, borderTop: '1px solid #f0f2f5', paddingTop: 8 }}>📝 {c.notes}</div>}
                </div>
              );
            })}
            {customers.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>No customers yet</div>}
          </div>
        ) : (
          <div style={{ background: '#ffffff', border: '1px solid #e8ecf0', borderRadius: 8, overflow: 'hidden' }}>
            <table style={s.table}>
              <thead><tr><th style={s.th}>Name</th><th style={s.th}>Address</th><th style={s.th}>Plan</th><th style={s.th}>Price</th><th style={s.th}>Status</th><th style={s.th}>Card on File</th><th style={s.th}>Notes</th></tr></thead>
              <tbody>{customers.map(c => { const job = jobs.find(j => j.address === c.address); return <tr key={c.id}><td style={{ ...s.td, fontWeight: 500 }}>{c.name || 'Unknown'}</td><td style={{ ...s.td, fontSize: 12, color: '#6b7280' }}>{c.address}</td><td style={{ ...s.td, fontSize: 12, textTransform: 'capitalize' }}>{c.service || '—'}</td><td style={{ ...s.td, fontWeight: 700 }}>{c.price ? `$${c.price}` : '—'}</td><td style={s.td}><Badge status={c.status} /></td><td style={{ ...s.td, fontSize: 12, color: job?.card_on_file ? '#10b981' : '#9ca3af' }}>{job?.card_on_file ? '✅ On file' : '—'}</td><td style={{ ...s.td, fontSize: 12, color: '#6b7280', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.notes}</td></tr>; })}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Team View ────────────────────────────────────────────────────────────────
function TeamView({ allUsers, setAllUsers }) {
  const isMobile = useIsMobile();
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'rep', password: '', active: true });
  const [saving, setSaving] = useState(false);
  const [showPassFor, setShowPassFor] = useState(null);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setEditUser(null);
    setForm({ name: '', email: '', phone: '', role: 'rep', password: '', active: true });
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, password: user.temp_password || '', active: user.active !== false });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editUser) {
      // Update existing user in users table
      const updates = { name: form.name, phone: form.phone, role: form.role, active: form.active };
      if (form.password) updates.temp_password = form.password;
      if (form.email !== editUser.email) updates.email = form.email;
      const { data: updated } = await supabase.from('users').update(updates).eq('id', editUser.id).select().single();
      setAllUsers(us => us.map(u => u.id === editUser.id ? updated : u));
    } else {
      // Step 1: Create Supabase auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { emailRedirectTo: null }
      });

      if (authError) {
        alert(`Error creating account: ${authError.message}`);
        setSaving(false);
        return;
      }

      const authId = authData?.user?.id;
      if (!authId) {
        alert('Could not create auth account. Check the email and try again.');
        setSaving(false);
        return;
      }

      // Step 2: Insert into users table using the auth ID
      const { data: newUser, error: dbError } = await supabase.from('users').insert({
        id: authId,
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        temp_password: form.password,
        active: true,
      }).select().single();

      if (dbError) {
        alert(`Account created but profile save failed: ${dbError.message}`);
        setSaving(false);
        return;
      }

      if (newUser) setAllUsers(us => [newUser, ...us]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const toggleActive = async (user) => {
    const { data: updated } = await supabase.from('users').update({ active: !user.active }).eq('id', user.id).select().single();
    setAllUsers(us => us.map(u => u.id === user.id ? updated : u));
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${user.name}? This cannot be undone.`)) return;
    // Remove from users table
    await supabase.from('users').delete().eq('id', user.id);
    setAllUsers(us => us.filter(u => u.id !== user.id));
  };

  const roleColor = { admin: '#378add', rep: '#10b981', tech: '#f59e0b' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}>
        <div style={s.topbarTitle}>👥 Team Management</div>
        <button style={s.btnAccent} onClick={openAdd}>+ Add Member</button>
      </div>
      <div style={s.page}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 14 : 24 }}>
          {[
            { l: 'Total Members', v: allUsers.length, c: '#1a1a2e' },
            { l: 'Reps', v: allUsers.filter(u => u.role === 'rep').length, c: '#10b981' },
            { l: 'Technicians', v: allUsers.filter(u => u.role === 'tech').length, c: '#f59e0b' },
          ].map((st, i) => (
            <div key={i} style={s.card()}><div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{st.l}</div><div style={{ fontWeight: 800, fontSize: 26, color: st.c }}>{st.v}</div></div>
          ))}
        </div>

        {/* Team Table */}
        <div style={{ background: '#ffffff', border: '1px solid #e8ecf0', borderRadius: 8, overflow: 'hidden' }}>
          {allUsers.map(user => (
            <div key={user.id} style={{ padding: '14px 16px', borderBottom: '1px solid #f0f2f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Avatar name={user.name} role={user.role} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                    <span style={{ background: `${roleColor[user.role]}22`, color: roleColor[user.role], padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{user.role}</span>
                    <span style={{ background: user.active !== false ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', color: user.active !== false ? '#10b981' : '#ef4444', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600 }}>{user.active !== false ? 'Active' : 'Inactive'}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: showPassFor === user.id ? '#1a1a2e' : '#9ca3af' }}>
                    {showPassFor === user.id ? (user.temp_password || '—') : '••••••••'}
                  </span>
                  <button onClick={() => setShowPassFor(showPassFor === user.id ? null : user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12, padding: 0 }}>
                    {showPassFor === user.id ? '🙈' : '👁'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ ...s.btnGhost, padding: '5px 10px', fontSize: 11 }} onClick={() => openEdit(user)}>Edit</button>
                  {user.role !== 'admin' && (
                    <button onClick={() => toggleActive(user)} style={{ padding: '5px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none', background: user.active !== false ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', color: user.active !== false ? '#ef4444' : '#10b981' }}>
                      {user.active !== false ? 'Off' : 'On'}
                    </button>
                  )}
                  {user.role !== 'admin' && (
                    <button onClick={() => deleteUser(user)} style={{ padding: '5px 8px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444' }}>🗑</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={s.backdrop} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={isMobile ? { background: '#ffffff', border: '1px solid #2a2a3a', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxHeight: '92vh', overflowY: 'auto', position: 'fixed', bottom: 0, left: 0, right: 0 } : s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{editUser ? 'Edit Team Member' : 'Add Team Member'}</div>
              <button onClick={() => setShowModal(false)} style={{ background: '#f8f9fb', border: 'none', color: '#6b7280', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
            <div style={s.twoCol}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={s.label}>Full Name</label>
                <input style={s.input} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jake Martinez" />
              </div>
              <div>
                <label style={s.label}>Email</label>
                <input style={s.input} value={form.email} onChange={e => set('email', e.target.value)} placeholder="jake@raiderwashing.com" />
              </div>
              <div>
                <label style={s.label}>Phone</label>
                <input style={s.input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(806) 555-0123" />
              </div>
              <div>
                <label style={s.label}>Role</label>
                <select style={s.select} value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="rep">Rep</option>
                  <option value="tech">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Temp Password</label>
                <input style={s.input} value={form.password} onChange={e => set('password', e.target.value)} placeholder="bobo1234" />
              </div>
            </div>
            {!editUser && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: 12, fontSize: 12, color: '#10b981', marginBottom: 14, lineHeight: 1.6 }}>
                ✅ Account will be created automatically. Tell them their email and temp password to log in.
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...s.btnGhost, flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              <button style={{ ...s.btnAccent, flex: 2, padding: 10 }} onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editUser ? 'Save Changes' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payroll View ────────────────────────────────────────────────────────────
function PayrollView({ jobs, allUsers, setAllUsers }) {
  const isMobile = useIsMobile();
  const [editingRate, setEditingRate] = useState(null);
  const [rateForm, setRateForm] = useState({ rep_rate: '', tech_rate: '' });
  const [saving, setSaving] = useState(false);

  const workers = allUsers.filter(u => ['rep', 'tech', 'admin'].includes(u.role));

  const getEarnings = (user) => {
    const completeJobs = jobs.filter(j => ['complete', 'paid', 'serviced'].includes(j.status));
    const repJobs = completeJobs.filter(j => String(j.rep_id) === String(user.id));
    const techJobs = completeJobs.filter(j => String(j.tech_id) === String(user.id));
    const repRate = (user.rep_rate || 0) / 100;
    const techRate = (user.tech_rate || 0) / 100;
    const repEarnings = repJobs.reduce((s, j) => s + (j.price || 0) * repRate, 0);
    const techEarnings = techJobs.reduce((s, j) => s + (j.price || 0) * techRate, 0);
    return {
      repJobs: repJobs.length, techJobs: techJobs.length,
      repEarnings, techEarnings,
      total: repEarnings + techEarnings,
      repRate: user.rep_rate || 0, techRate: user.tech_rate || 0,
    };
  };

  const openEdit = (user) => {
    setEditingRate(user);
    setRateForm({ rep_rate: user.rep_rate || '', tech_rate: user.tech_rate || '' });
  };

  const saveRate = async () => {
    setSaving(true);
    const { data: updated } = await supabase.from('users').update({
      rep_rate: Number(rateForm.rep_rate) || 0,
      tech_rate: Number(rateForm.tech_rate) || 0,
    }).eq('id', editingRate.id).select().single();
    setAllUsers(us => us.map(u => u.id === editingRate.id ? updated : u));
    setSaving(false);
    setEditingRate(null);
  };

  const totalPayroll = workers.reduce((s, u) => s + getEarnings(u).total, 0);
  const totalRevenue = jobs.filter(j => ['complete','paid','serviced'].includes(j.status)).reduce((s, j) => s + (j.price || 0), 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}>
        <div style={s.topbarTitle}>💰 Payroll</div>
      </div>
      <div style={{ ...s.page, padding: isMobile ? 12 : 20 }}>

        {/* Summary stats */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 8 : 12, marginBottom: isMobile ? 14 : 24 }}>
          <div style={s.card()}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Revenue Collected</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#f59e0b' }}>${totalRevenue.toFixed(2)}</div>
          </div>
          <div style={s.card()}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Payroll Owed</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#ef4444' }}>${totalPayroll.toFixed(2)}</div>
          </div>
          <div style={s.card()}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Net After Payroll</div>
            <div style={{ fontWeight: 800, fontSize: 22, color: '#10b981' }}>${(totalRevenue - totalPayroll).toFixed(2)}</div>
          </div>
        </div>

        {/* Per person breakdown */}
        {workers.map(user => {
          const e = getEarnings(user);
          const userJobs = jobs.filter(j => ['complete','paid','serviced'].includes(j.status) && (String(j.rep_id) === String(user.id) || String(j.tech_id) === String(user.id)));
          const roleColor2 = user.role === 'rep' ? '#10b981' : user.role === 'tech' ? '#f59e0b' : '#378add';
          return (
            <div key={user.id} style={{ ...s.card({ marginBottom: 12 }) }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={user.name} role={user.role} size={32} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{user.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>
                      <span style={{ color: roleColor2, textTransform: 'capitalize', fontWeight: 600 }}>{user.role}</span>
                      {e.repRate > 0 && <span> · Rep {e.repRate}%</span>}
                      {e.techRate > 0 && <span> · Tech {e.techRate}%</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#9ca3af' }}>Owed</div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: e.total > 0 ? '#ef4444' : '#9ca3af' }}>${e.total.toFixed(2)}</div>
                  </div>
                  <button style={{ ...s.btnGhost, fontSize: 11, padding: '6px 10px' }} onClick={() => openEdit(user)}>✏️ Rate</button>
                </div>
              </div>

              {/* Job list */}
              {userJobs.length > 0 && (
                <div style={{ borderTop: '1px solid #f0f2f5', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {userJobs.map(j => {
                    const isRep = String(j.rep_id) === String(user.id);
                    const isTech = String(j.tech_id) === String(user.id);
                    const rate = isRep ? e.repRate : e.techRate;
                    const earned = (j.price || 0) * rate / 100;
                    return (
                      <div key={j.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', background: '#f8f9fb', borderRadius: 6 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{j.customer_name}</div>
                          <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'capitalize' }}>
                            {j.service} · {isRep && isTech ? 'Rep + Tech' : isRep ? 'Rep' : 'Tech'} · {rate}%
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>${j.price}</div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#10b981' }}>+${earned.toFixed(2)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit rate modal */}
      {editingRate && (
        <div style={s.backdrop} onClick={e => e.target === e.currentTarget && setEditingRate(null)}>
          <div style={isMobile ? { background: '#ffffff', border: '1px solid #e2e4e8', borderRadius: '16px 16px 0 0', padding: 24, width: '100%', maxHeight: '85vh', overflowY: 'auto', position: 'fixed', bottom: 0, left: 0, right: 0 } : { ...s.modal, width: 360 }}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Set Pay Rate</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{editingRate.name}</div>
            <div style={s.twoCol}>
              <div>
                <label style={s.label}>Rep Rate (%)</label>
                <input style={s.input} type="number" min="0" max="100" value={rateForm.rep_rate} onChange={e => setRateForm(f => ({ ...f, rep_rate: e.target.value }))} placeholder="e.g. 20" />
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>% of jobs they sold</div>
              </div>
              <div>
                <label style={s.label}>Tech Rate (%)</label>
                <input style={s.input} type="number" min="0" max="100" value={rateForm.tech_rate} onChange={e => setRateForm(f => ({ ...f, tech_rate: e.target.value }))} placeholder="e.g. 10" />
                <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>% of jobs they serviced</div>
              </div>
            </div>
            <div style={{ background: '#f8f9fb', borderRadius: 8, padding: 12, fontSize: 12, color: '#6b7280', marginBottom: 16, lineHeight: 1.7 }}>
              Example: Rep rate 20% on a $150 job = <strong style={{ color: '#10b981' }}>$30 owed</strong><br/>
              Tech rate 10% on a $150 job = <strong style={{ color: '#f59e0b' }}>$15 owed</strong>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...s.btnGhost, flex: 1 }} onClick={() => setEditingRate(null)}>Cancel</button>
              <button style={{ ...s.btnAccent, flex: 2, padding: 10 }} onClick={saveRate} disabled={saving}>{saving ? 'Saving...' : 'Save Rate'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const isMobile = useIsMobile();
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('map');
  const [pins, setPins] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on login
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const loadData = async () => {
      setLoading(true);
      const [{ data: usersData }, { data: pinsData }, { data: jobsData }, { data: zonesData }] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('pins').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('zones').select('*'),
      ]);
      setAllUsers(usersData || []);
      setPins(pinsData || []);
      setJobs(jobsData || []);
      setZones(zonesData || []);
      setLoading(false);
    };
    loadData();

    // Real-time listeners
    const pinsSub = supabase.channel('pins-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pins' }, (payload) => {
        if (payload.eventType === 'INSERT') setPins(ps => [payload.new, ...ps]);
        if (payload.eventType === 'UPDATE') setPins(ps => ps.map(p => p.id === payload.new.id ? payload.new : p));
        if (payload.eventType === 'DELETE') setPins(ps => ps.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    const jobsSub = supabase.channel('jobs-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' }, (payload) => {
        if (payload.eventType === 'INSERT') setJobs(js => [payload.new, ...js]);
        if (payload.eventType === 'UPDATE') setJobs(js => js.map(j => j.id === payload.new.id ? payload.new : j));
        if (payload.eventType === 'DELETE') setJobs(js => js.filter(j => j.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(pinsSub);
      supabase.removeChannel(jobsSub);
    };
  }, [user]);

  // Auth check on mount
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: userData } = await supabase.from('users').select('*').eq('email', session.user.email).single();
        if (userData) { setUser(userData); setPage(userData.role === 'tech' ? 'jobs' : userData.role === 'admin' ? 'dashboard' : 'map'); }
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner />;
  if (!user) return <AuthScreen onLogin={u => { setUser(u); setPage(u.role === 'tech' ? 'jobs' : u.role === 'admin' ? 'dashboard' : 'map'); }} />;

  const NAV = {
    admin: [{ id: 'dashboard', icon: '📊', label: 'Dash' }, { id: 'map', icon: '🗺', label: 'Map' }, { id: 'schedule', icon: '📅', label: 'Schedule' }, { id: 'customers', icon: '👥', label: 'Clients' }, { id: 'team', icon: '🧑‍💼', label: 'Team' }, { id: 'payroll', icon: '💰', label: 'Payroll' }],
    rep: [{ id: 'map', icon: '🗺', label: 'Map' }, { id: 'schedule', icon: '📅', label: 'Schedule' }, { id: 'dashboard', icon: '📈', label: 'Stats' }, { id: 'customers', icon: '👥', label: 'Clients' }],
    tech: [{ id: 'jobs', icon: '🔧', label: 'My Jobs' }, { id: 'schedule', icon: '📅', label: 'Schedule' }],
  };

  const roleColor = { admin: '#378add', rep: '#10b981', tech: '#f59e0b' }[user.role];

  const renderPage = () => {
    if (page === 'map') return <MapView pins={pins} setPins={setPins} currentUser={user} allUsers={allUsers} jobs={jobs} setJobs={setJobs} zones={zones} setZones={setZones} />;
    if (page === 'schedule') return <ScheduleView jobs={jobs} setJobs={setJobs} currentUser={user} allUsers={allUsers} />;
    if (page === 'dashboard') return user.role === 'admin' ? <AdminDashboard pins={pins} jobs={jobs} allUsers={allUsers} onRefresh={async () => {
      const [{ data: pinsData }, { data: jobsData }, { data: usersData }] = await Promise.all([
        supabase.from('pins').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('users').select('*'),
      ]);
      setPins(pinsData || []);
      setJobs(jobsData || []);
      setAllUsers(usersData || []);
    }} /> : <RepDashboard pins={pins} jobs={jobs} currentUser={user} />;
    if (page === 'jobs') return <TechDashboard jobs={jobs} setJobs={setJobs} currentUser={user} />;
    if (page === 'customers') return <CustomersView pins={pins} jobs={jobs} />;
    if (page === 'team') return <TeamView allUsers={allUsers} setAllUsers={setAllUsers} />;
    if (page === 'payroll') return <PayrollView jobs={jobs} allUsers={allUsers} setAllUsers={setAllUsers} />;
    return null;
  };

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', maxHeight: '-webkit-fill-available', background: '#f5f7fa', color: '#1a1a2e', fontFamily: "'Inter', sans-serif", overflow: 'hidden', position: 'fixed', inset: 0 }}>
        {/* Mobile top bar */}
        <div style={{ background: '#ffffff', borderBottom: '1px solid #2a2a3a', padding: '10px 16px', paddingTop: 'max(10px, env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>Wash<span style={{ color: '#378add' }}>Ops</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: roleColor, textTransform: 'capitalize', fontWeight: 600 }}>{user.name.split(' ')[0]}</div>
            <Avatar name={user.name} role={user.role} size={28} />
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {renderPage()}
        </div>

        {/* Mobile bottom nav */}
        <div style={{ background: '#ffffff', borderTop: '1px solid #e2e4e8', display: 'flex', flexShrink: 0, paddingBottom: 'max(env(safe-area-inset-bottom), 6px)', overflowX: 'auto' }}>
          {NAV[user.role].map(item => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              flex: 1, minWidth: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '6px 2px', border: 'none', background: 'transparent', cursor: 'pointer',
              color: page === item.id ? '#185fa5' : '#9ca3af', transition: 'color 0.15s',
              borderTop: page === item.id ? '2px solid #185fa5' : '2px solid transparent',
            }}>
              <span style={{ fontSize: 17, marginBottom: 1, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2px', whiteSpace: 'nowrap' }}>{item.label === 'Field Map' ? 'Map' : item.label === 'Dashboard' ? 'Dash' : item.label === 'Customers' ? 'Clients' : item.label === 'Schedule' ? 'Cal' : item.label}</span>
            </button>
          ))}
          <button onClick={async () => { await supabase.auth.signOut(); setUser(null); setPage('map'); }} style={{
            flex: 1, minWidth: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '6px 2px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#9ca3af',
            borderTop: '2px solid transparent',
          }}>
            <span style={{ fontSize: 17, marginBottom: 1, lineHeight: 1 }}>🚪</span>
            <span style={{ fontSize: 8, fontWeight: 600, textTransform: 'uppercase' }}>Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...s.app, position: 'fixed', inset: 0 }}>
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>Wash<span style={{ color: '#378add' }}>Ops</span></div>
        <div style={s.sidebarUser}>
          <Avatar name={user.name} role={user.role} size={32} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name.split(' ')[0]}</div>
            <div style={{ fontSize: 11, color: roleColor, textTransform: 'capitalize' }}>{user.role}</div>
          </div>
        </div>
        <nav style={s.sidebarNav}>
          {NAV[user.role].map(item => (
            <button key={item.id} style={s.navItem(page === item.id)} onClick={() => setPage(item.id)}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div style={s.sidebarBottom}>
          <button style={s.navItem(false)} onClick={async () => { await supabase.auth.signOut(); setUser(null); setPage('map'); }}><span>🚪</span>Sign Out</button>
        </div>
      </div>
      <div style={s.main}>{renderPage()}</div>
    </div>
  );
}

