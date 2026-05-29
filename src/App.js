import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = {
  app: { display: 'flex', height: '100vh', background: '#0a0a0f', color: '#f0f0f8', fontFamily: "'Inter', sans-serif", overflow: 'hidden' },
  sidebar: { width: 210, background: '#111118', borderRight: '1px solid #2a2a3a', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  sidebarLogo: { padding: '18px 18px 14px', fontWeight: 800, fontSize: 20, borderBottom: '1px solid #2a2a3a' },
  sidebarUser: { padding: '12px 18px', borderBottom: '1px solid #2a2a3a', display: 'flex', alignItems: 'center', gap: 10 },
  sidebarNav: { padding: '10px 8px', flex: 1 },
  navItem: (active) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: active ? '#4f8ef7' : '#8888aa', background: active ? 'rgba(79,142,247,0.1)' : 'transparent', border: 'none', width: '100%', textAlign: 'left', marginBottom: 2 }),
  sidebarBottom: { padding: '10px 8px', borderTop: '1px solid #2a2a3a' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  topbar: { background: '#111118', borderBottom: '1px solid #2a2a3a', padding: '0 20px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  topbarTitle: { fontWeight: 700, fontSize: 15 },
  page: { flex: 1, overflowY: 'auto', padding: 20 },
  card: (extra = {}) => ({ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, padding: 18, ...extra }),
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  input: { width: '100%', background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 12px', color: '#f0f0f8', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  select: { width: '100%', background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8, padding: '10px 12px', color: '#f0f0f8', fontSize: 13, outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#8888aa', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' },
  btnPrimary: { width: '100%', padding: '11px', background: '#4f8ef7', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' },
  btnGhost: { padding: '8px 14px', background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8, color: '#8888aa', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
  btnAccent: { padding: '8px 14px', background: '#4f8ef7', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
  btnGreen: { padding: '8px 14px', background: '#10b981', border: 'none', borderRadius: 8, color: 'white', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 },
  modal: { background: '#111118', border: '1px solid #2a2a3a', borderRadius: 16, padding: 24, width: 460, maxHeight: '85vh', overflowY: 'auto' },
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  badge: (status) => { const c = STATUS_CONFIG[status] || { color: '#888', bg: 'rgba(128,128,128,0.15)' }; return { background: c.bg, color: c.color, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600 }; },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '9px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#555570', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #2a2a3a', background: '#1a1a24' },
  td: { padding: '11px 16px', fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.04)' },
  planOption: (sel) => ({ flex: 1, padding: '10px 8px', borderRadius: 8, border: `1px solid ${sel ? '#4f8ef7' : '#2a2a3a'}`, background: sel ? 'rgba(79,142,247,0.1)' : '#1a1a24', cursor: 'pointer', textAlign: 'center' }),
  techSlot: (rec) => ({ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: rec ? 'rgba(16,185,129,0.05)' : '#1a1a24', borderRadius: 8, border: `1px solid ${rec ? '#10b981' : '#2a2a3a'}`, marginBottom: 6, cursor: 'pointer' }),
};

const STATUS_CONFIG = {
  'not-interested': { label: 'Not Interested', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  'follow-up': { label: 'Follow Up', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  appointment: { label: 'Appt Set', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  closed: { label: 'Closed', color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)' },
  paid: { label: 'Paid', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  scheduled: { label: 'Scheduled', color: '#4f8ef7', bg: 'rgba(79,142,247,0.15)' },
  complete: { label: 'Complete', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
};

const PIN_COLORS = { 'not-interested': '#ef4444', 'follow-up': '#f59e0b', appointment: '#10b981', closed: '#4f8ef7', paid: '#7c3aed' };

const AGREEMENT = `WINDOW CLEANING SERVICE AGREEMENT — RAIDER WASHING

SERVICE PLAN: You are enrolling in window cleaning service as selected (One-Time or Quarterly Recurring).

QUARTERLY PLAN: You will be charged monthly (1/3 of the quarterly rate) for a minimum of 12 months. Window cleaning will be performed every 3 months. You may cancel at any time — monthly payments already collected are non-refundable. If you are dissatisfied, contact Raider Washing and we will return for a complimentary re-service at no charge. After 12 months, you may cancel with no penalty.

PAYMENT: Your card on file will be automatically charged after each service is completed.

Contact: raiderwashing.com | Lubbock, TX`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Avatar({ name, role, size = 32 }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const bg = { admin: '#1a3a6e', rep: '#0a3328', tech: '#3d2800' }[role] || '#222';
  const color = { admin: '#4f8ef7', rep: '#10b981', tech: '#f59e0b' }[role] || '#888';
  return <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700, flexShrink: 0 }}>{initials}</div>;
}

function Badge({ status }) {
  return <span style={s.badge(status)}>{STATUS_CONFIG[status]?.label || status}</span>;
}

function Spinner() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a0f', color: '#4f8ef7', fontSize: 14 }}>Loading WashOps...</div>;
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
    <div style={{ height: '100vh', background: '#0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 20, padding: 44, width: 400, boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ fontWeight: 800, fontSize: 28, marginBottom: 4 }}>Wash<span style={{ color: '#4f8ef7' }}>Ops</span></div>
        <div style={{ color: '#8888aa', fontSize: 13, marginBottom: 32 }}>Field Sales & Job Management · Raider Washing</div>
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
function DoorLogModal({ pin, onClose, onSave, techs }) {
  const [form, setForm] = useState({
    address: pin?.address || '',
    name: pin?.name || '',
    status: pin?.status || 'follow-up',
    service: pin?.service || 'one-time',
    price: pin?.price || '',
    notes: pin?.notes || '',
    follow_up_date: pin?.follow_up_date || '',
    tech_id: pin?.tech_id || '',
    agreed: false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const showPlan = form.status === 'appointment' || form.status === 'closed';

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...pin, ...form, price: Number(form.price) || 0 });
    setSaving(false);
    onClose();
  };

  return (
    <div style={s.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 17 }}>{pin?.id ? 'Edit Door Log' : 'New Door Log'}</div>
          <button onClick={onClose} style={{ background: '#1a1a24', border: 'none', color: '#8888aa', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
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
              <div style={s.planOption(form.service === 'one-time')} onClick={() => set('service', 'one-time')}><div style={{ fontWeight: 700, fontSize: 13 }}>One-Time</div><div style={{ fontSize: 11, color: '#8888aa' }}>Pay once</div></div>
              <div style={s.planOption(form.service === 'quarterly')} onClick={() => set('service', 'quarterly')}><div style={{ fontWeight: 700, fontSize: 13 }}>Quarterly</div><div style={{ fontSize: 11, color: '#8888aa' }}>Monthly billing · visit every 3mo</div></div>
            </div>
            <div style={s.twoCol}>
              <div><label style={s.label}>{form.service === 'quarterly' ? 'Quarterly Price ($)' : 'Job Price ($)'}</label><input style={s.input} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="150" /></div>
              {form.service === 'quarterly' && form.price && <div><label style={s.label}>Monthly Charge</label><div style={{ ...s.input, color: '#10b981', fontWeight: 700 }}>${(Number(form.price) / 3).toFixed(2)}/mo</div></div>}
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={s.label}>Assign Technician</label>
              <select style={s.select} value={form.tech_id} onChange={e => set('tech_id', e.target.value)}>
                <option value="">— Select Tech —</option>
                {techs.map((t, i) => <option key={t.id} value={t.id}>{t.name} · {i === 0 ? '⭐ Next available: Tomorrow 9AM' : 'Thu, 11AM'}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}><label style={s.label}>Scheduled Date</label><input style={s.input} type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)} /></div>
            <div style={{ background: '#1a1a24', border: '1px solid #2a2a3a', borderRadius: 8, padding: 12, fontSize: 11, color: '#8888aa', lineHeight: 1.7, maxHeight: 90, overflowY: 'auto', marginBottom: 10 }}>{AGREEMENT}</div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14 }}>
              <input type="checkbox" checked={form.agreed} onChange={e => set('agreed', e.target.checked)} style={{ marginTop: 2, accentColor: '#4f8ef7' }} />
              <span style={{ fontSize: 12, color: '#8888aa', lineHeight: 1.5 }}>Customer has read and agrees to the Raider Washing Service Agreement. Card on file will be charged after service completion.</span>
            </div>
          </>
        )}
        {form.status === 'follow-up' && <div style={{ marginBottom: 12 }}><label style={s.label}>Follow-Up Date</label><input style={s.input} type="date" value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)} /></div>}
        <div style={{ marginBottom: 12 }}><label style={s.label}>Notes</label><textarea style={{ ...s.input, resize: 'vertical' }} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Gate code, dog, # of windows, best time..." /></div>
        <div style={{ border: '2px dashed #2a2a3a', borderRadius: 8, padding: 16, textAlign: 'center', color: '#8888aa', fontSize: 13, cursor: 'pointer', marginBottom: 14 }}>📷 Add Before/After Photos (coming soon)</div>
        <div style={{ display: 'flex', gap: 8 }}>
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

function MapView({ pins, setPins, currentUser, allUsers }) {
  const [modal, setModal] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapDivRef = React.useRef(null);
  const googleMapRef = React.useRef(null);
  const markersRef = React.useRef([]);
  const locationMarkerRef = React.useRef(null);
  const locationWatchRef = React.useRef(null);
  const techs = allUsers.filter(u => u.role === 'tech');
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
                fillColor: '#4f8ef7',
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

      // Click to drop pin (reps only)
      if (currentUser.role === 'rep') {
        map.addListener('click', async (e) => {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            const address = status === 'OK' && results[0] ? results[0].formatted_address : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            setModal({ lat, lng, address, rep_id: currentUser.id });
          });
        });
      }
      setMapReady(true);
    });
    return () => {
      if (locationWatchRef.current) navigator.geolocation.clearWatch(locationWatchRef.current);
    };
  }, []);

  // Render pins as markers on the map
  useEffect(() => {
    if (!googleMapRef.current || !mapReady) return;
    // Clear old markers
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
      marker.addListener('click', () => setModal(pin));
      markersRef.current.push(marker);
    });
  }, [visiblePins, mapReady]);

  const handleSave = async (data) => {
    if (data.id) {
      const { data: updated } = await supabase.from('pins').update({ address: data.address, name: data.name, status: data.status, service: data.service, price: data.price, notes: data.notes, follow_up_date: data.follow_up_date || null, tech_id: data.tech_id || null, agreed: data.agreed }).eq('id', data.id).select().single();
      setPins(ps => ps.map(p => p.id === data.id ? updated : p));
      if (['appointment', 'closed'].includes(data.status) && data.tech_id) {
        await supabase.from('jobs').insert({ address: data.address, customer_name: data.name, service: data.service, price: data.price, monthly_price: data.service === 'quarterly' ? data.price / 3 : null, status: 'scheduled', rep_id: data.rep_id, tech_id: data.tech_id, scheduled_date: data.follow_up_date || null, agreement_signed: data.agreed, card_on_file: false, notes: data.notes });
      }
    } else {
      const { data: inserted } = await supabase.from('pins').insert({ lat: data.lat, lng: data.lng, x: 50, y: 50, address: data.address, name: data.name, status: data.status, service: data.service || null, price: data.price || null, notes: data.notes, follow_up_date: data.follow_up_date || null, rep_id: data.rep_id, tech_id: data.tech_id || null, agreed: data.agreed }).select().single();
      setPins(ps => [...ps, inserted]);
      if (['appointment', 'closed'].includes(data.status) && data.tech_id) {
        await supabase.from('jobs').insert({ address: data.address, customer_name: data.name, service: data.service, price: data.price, monthly_price: data.service === 'quarterly' ? data.price / 3 : null, status: 'scheduled', rep_id: data.rep_id, tech_id: data.tech_id, scheduled_date: data.follow_up_date || null, agreement_signed: data.agreed, card_on_file: false, notes: data.notes });
      }
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}>
        <div style={s.topbarTitle}>🗺 Field Map — Lubbock, TX</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {Object.entries(PIN_COLORS).map(([k, c]) => (
            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8888aa' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c, display: 'inline-block' }} />
              {STATUS_CONFIG[k]?.label}
            </span>
          ))}
          <span style={{ fontSize: 11, color: '#4f8ef7', background: 'rgba(79,142,247,0.08)', border: '1px solid rgba(79,142,247,0.2)', borderRadius: 20, padding: '3px 10px' }}>{visiblePins.length} pins</span>
        </div>
      </div>
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapDivRef} style={{ width: '100%', height: '100%' }} />
        {!mapReady && (
          <div style={{ position: 'absolute', inset: 0, background: '#111118', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8888aa', fontSize: 14 }}>
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
          }} style={{ position: 'absolute', top: 60, right: 10, background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#4f8ef7', cursor: 'pointer', zIndex: 10, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            🎯 Find Me
          </button>
        )}
        {currentUser.role === 'rep' && mapReady && (
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: '#111118', border: '1px solid #2a2a3a', borderRadius: 8, padding: '7px 14px', fontSize: 12, color: '#8888aa', zIndex: 10 }}>
            📍 Tap any house to log a door
          </div>
        )}
      </div>
      {modal && <DoorLogModal pin={modal} onClose={() => setModal(null)} onSave={handleSave} techs={techs} />}
    </div>
  );
}

// ─── Schedule View ────────────────────────────────────────────────────────────
function ScheduleView({ jobs, setJobs, currentUser, allUsers }) {
  const [selected, setSelected] = useState(null);
  const today = new Date();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 35 }, (_, i) => { const d = i - startDay + 1; return { d, valid: d >= 1 && d <= daysInMonth }; });
  const dayJobs = (d) => jobs.filter(j => { if (!j.scheduled_date) return false; const dt = new Date(j.scheduled_date); return dt.getDate() === d && dt.getMonth() === today.getMonth(); });
  const visible = currentUser.role === 'admin' ? jobs : currentUser.role === 'rep' ? jobs.filter(j => j.rep_id === currentUser.id) : jobs.filter(j => j.tech_id === currentUser.id);
  const techs = allUsers.filter(u => u.role === 'tech');

  const markComplete = async (job) => {
    const { data: updated } = await supabase.from('jobs').update({ status: 'paid', completed_date: new Date().toISOString().split('T')[0] }).eq('id', job.id).select().single();
    setJobs(js => js.map(j => j.id === job.id ? updated : j));
    setSelected(null);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}>
        <div style={s.topbarTitle}>📅 Schedule — {today.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <span style={{ fontSize: 12, color: '#8888aa' }}>{visible.length} jobs</span>
      </div>
      <div style={s.page}>
        {currentUser.role === 'rep' && (
          <div style={{ ...s.card(), marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🧑‍🔧 Tech Availability — Nearest Slots</div>
            {techs.map((t, i) => (
              <div key={t.id} style={s.techSlot(i === 0)}>
                <Avatar name={t.name} role="tech" size={26} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                <span style={{ fontSize: 11, color: '#8888aa' }}>{i === 0 ? 'Tomorrow, 9:00 AM' : 'Thu, 11:00 AM'}</span>
                {i === 0 && <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 600 }}>Nearest</span>}
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 1, background: '#2a2a3a', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} style={{ background: '#1a1a24', padding: '8px 10px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#555570', textTransform: 'uppercase' }}>{d}</div>)}
          {cells.map((cell, i) => {
            const dj = cell.valid ? dayJobs(cell.d) : [];
            const isToday = cell.d === today.getDate();
            return (
              <div key={i} style={{ background: isToday ? 'rgba(79,142,247,0.06)' : '#111118', padding: 8, minHeight: 72 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: cell.valid ? '#8888aa' : '#333', marginBottom: 3 }}>{cell.valid ? cell.d : ''}</div>
                {dj.slice(0, 2).map(j => <div key={j.id} onClick={() => setSelected(j)} style={{ background: 'rgba(79,142,247,0.15)', borderLeft: '2px solid #4f8ef7', padding: '2px 4px', borderRadius: 3, fontSize: 10, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>{j.scheduled_time} · {j.customer_name?.split(' ')[0]}</div>)}
                {dj.length > 2 && <div style={{ fontSize: 9, color: '#555570' }}>+{dj.length - 2}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2a3a', fontWeight: 700, fontSize: 14 }}>All Jobs</div>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Customer</th><th style={s.th}>Service</th><th style={s.th}>Date</th><th style={s.th}>Status</th><th style={s.th}>Price</th></tr></thead>
            <tbody>{visible.map(j => (
              <tr key={j.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(j)}>
                <td style={s.td}>{j.customer_name}</td>
                <td style={{ ...s.td, textTransform: 'capitalize', fontSize: 12 }}>{j.service}</td>
                <td style={{ ...s.td, fontSize: 12, color: '#8888aa' }}>{j.scheduled_date} {j.scheduled_time && `· ${j.scheduled_time}`}</td>
                <td style={s.td}><Badge status={j.status} /></td>
                <td style={{ ...s.td, fontWeight: 700 }}>${j.price}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      {selected && (
        <div style={s.backdrop} onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div style={s.modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontWeight: 700, fontSize: 17 }}>Job Details</div>
              <button onClick={() => setSelected(null)} style={{ background: '#1a1a24', border: 'none', color: '#8888aa', width: 28, height: 28, borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
            <div style={s.twoCol}>
              {[['Customer', selected.customer_name], ['Address', selected.address], ['Service', selected.service], ['Date', `${selected.scheduled_date || '—'} ${selected.scheduled_time || ''}`], ['Price', `$${selected.price}${selected.monthly_price ? ` ($${selected.monthly_price}/mo)` : ''}`]].map(([k, v]) => (
                <div key={k}><div style={{ fontSize: 11, color: '#8888aa', marginBottom: 3 }}>{k}</div><div style={{ fontSize: 13, fontWeight: k === 'Price' ? 700 : 400, color: k === 'Price' ? '#10b981' : '#f0f0f8', textTransform: k === 'Service' ? 'capitalize' : 'none' }}>{v}</div></div>
              ))}
              <div><div style={{ fontSize: 11, color: '#8888aa', marginBottom: 3 }}>Status</div><Badge status={selected.status} /></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, color: '#8888aa', marginBottom: 8 }}>Photo Documentation</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                {(selected.photos || []).map((p, i) => <div key={i} style={{ aspectRatio: '1', background: '#1a1a24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{p === 'before' ? '📸' : '✨'}</div>)}
                <div style={{ aspectRatio: '1', background: '#1a1a24', border: '1px dashed #2a2a3a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', color: '#555570' }}>+</div>
              </div>
            </div>
            {selected.status === 'scheduled' && currentUser.role === 'tech' && (
              <button style={{ ...s.btnGreen, width: '100%', padding: 11, fontSize: 13, marginTop: 16 }} onClick={() => markComplete(selected)}>✅ Mark Complete & Charge Customer</button>
            )}
            {selected.status === 'paid' && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, padding: 12, textAlign: 'center', fontSize: 13, color: '#10b981', marginTop: 16 }}>✅ Job complete · Customer charged ${selected.price}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
function AdminDashboard({ pins, jobs, allUsers }) {
  const reps = allUsers.filter(u => u.role === 'rep');
  const techs = allUsers.filter(u => u.role === 'tech');
  const revenue = jobs.filter(j => j.status === 'paid').reduce((s, j) => s + (j.price || 0), 0);
  const scheduled = jobs.filter(j => j.status === 'scheduled').length;
  const conv = pins.length ? Math.round(pins.filter(p => ['closed','paid','appointment'].includes(p.status)).length / pins.length * 100) : 0;
  const repStats = reps.map(r => ({ ...r, knocked: pins.filter(p => p.rep_id === r.id).length, closed: pins.filter(p => p.rep_id === r.id && ['closed','paid'].includes(p.status)).length, rev: jobs.filter(j => j.rep_id === r.id && j.status === 'paid').reduce((s, j) => s + (j.price || 0), 0) }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>📊 Admin Dashboard</div></div>
      <div style={s.page}>
        <div style={s.statsGrid}>
          {[{ l: 'Total Revenue', v: `$${revenue}`, c: '#10b981' }, { l: 'Scheduled Jobs', v: scheduled, c: '#4f8ef7' }, { l: 'Doors Knocked', v: pins.length, c: '#f59e0b' }, { l: 'Conversion Rate', v: `${conv}%`, c: '#f0f0f8' }].map((st, i) => (
            <div key={i} style={s.card()}><div style={{ fontSize: 11, color: '#8888aa', marginBottom: 4 }}>{st.l}</div><div style={{ fontWeight: 800, fontSize: 26, color: st.c }}>{st.v}</div></div>
          ))}
        </div>
        <div style={s.twoCol}>
          <div style={s.card()}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Rep Performance</div>
            {repStats.length === 0 && <div style={{ color: '#555570', fontSize: 13 }}>No reps yet</div>}
            {repStats.map(r => (
              <div key={r.id} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Avatar name={r.name} role="rep" size={24} /><span style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</span></div>
                  <span style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>${r.rev}</span>
                </div>
                {[['Knocked', r.knocked, 10, '#8888aa'], ['Closed', r.closed, 25, '#10b981']].map(([label, val, mult, color]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: '#555570', width: 60 }}>{label}</span>
                    <div style={{ flex: 1, height: 5, background: '#1a1a24', borderRadius: 3, overflow: 'hidden' }}><div style={{ width: `${Math.min(val * mult, 100)}%`, height: '100%', background: color, borderRadius: 3 }} /></div>
                    <span style={{ fontSize: 11, color: '#8888aa', width: 20, textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={s.card()}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>Technician Status</div>
            {techs.map(t => {
              const tj = jobs.filter(j => j.tech_id === t.id);
              return (
                <div key={t.id} style={{ marginBottom: 14, padding: 12, background: '#1a1a24', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><Avatar name={t.name} role="tech" size={28} /><div><div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div><div style={{ fontSize: 11, color: '#8888aa' }}>Technician</div></div></div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ fontSize: 12 }}><span style={{ color: '#f59e0b' }}>{tj.filter(j => j.status === 'scheduled').length}</span> pending</div>
                    <div style={{ fontSize: 12 }}><span style={{ color: '#10b981' }}>{tj.filter(j => j.status === 'paid').length}</span> done</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2a3a', fontWeight: 700, fontSize: 14 }}>Recent Jobs</div>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Customer</th><th style={s.th}>Service</th><th style={s.th}>Rep</th><th style={s.th}>Tech</th><th style={s.th}>Status</th><th style={s.th}>Amount</th></tr></thead>
            <tbody>{jobs.slice(0, 20).map(j => { const rep = allUsers.find(u => u.id === j.rep_id); const tech = allUsers.find(u => u.id === j.tech_id); return <tr key={j.id}><td style={s.td}>{j.customer_name}</td><td style={{ ...s.td, textTransform: 'capitalize', fontSize: 12 }}>{j.service}</td><td style={{ ...s.td, fontSize: 12 }}>{rep?.name || '—'}</td><td style={{ ...s.td, fontSize: 12 }}>{tech?.name || '—'}</td><td style={s.td}><Badge status={j.status} /></td><td style={{ ...s.td, fontWeight: 700, color: j.status === 'paid' ? '#10b981' : '#f0f0f8' }}>${j.price}</td></tr>; })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Rep Dashboard ────────────────────────────────────────────────────────────
function RepDashboard({ pins, jobs, currentUser }) {
  const my = pins.filter(p => p.rep_id === currentUser.id);
  const knocked = my.length, appts = my.filter(p => p.status === 'appointment').length, closed = my.filter(p => ['closed','paid'].includes(p.status)).length;
  const rev = jobs.filter(j => j.rep_id === currentUser.id && j.status === 'paid').reduce((s, j) => s + (j.price || 0), 0);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>📈 My Stats</div></div>
      <div style={s.page}>
        <div style={s.statsGrid}>
          {[{ l: 'Knocked', v: knocked, c: '#f0f0f8' }, { l: 'Appts Set', v: appts, c: '#f59e0b' }, { l: 'Closed', v: closed, c: '#4f8ef7' }, { l: 'Revenue', v: `$${rev}`, c: '#10b981' }].map((st, i) => <div key={i} style={s.card()}><div style={{ fontSize: 11, color: '#8888aa', marginBottom: 4 }}>{st.l}</div><div style={{ fontWeight: 800, fontSize: 26, color: st.c }}>{st.v}</div></div>)}
        </div>
        <div style={{ ...s.card(), marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>Conversion Funnel</div>
          {[['Knocked', knocked, 100, '#8888aa'], ['Appointments', appts, knocked ? (appts/knocked)*100 : 0, '#f59e0b'], ['Closed', closed, knocked ? (closed/knocked)*100 : 0, '#10b981']].map(([label, val, pct, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 12, width: 90 }}>{label}</span>
              <div style={{ flex: 1, height: 7, background: '#1a1a24', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} /></div>
              <span style={{ fontSize: 12, color: '#8888aa', width: 24, textAlign: 'right' }}>{val}</span>
            </div>
          ))}
        </div>
        <div style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2a3a', fontWeight: 700, fontSize: 14 }}>My Pins</div>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Address</th><th style={s.th}>Name</th><th style={s.th}>Status</th><th style={s.th}>Service</th></tr></thead>
            <tbody>{my.slice(0, 15).map(p => <tr key={p.id}><td style={{ ...s.td, fontSize: 12 }}>{p.address}</td><td style={s.td}>{p.name || '—'}</td><td style={s.td}><Badge status={p.status} /></td><td style={{ ...s.td, fontSize: 12, textTransform: 'capitalize' }}>{p.service || '—'}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Tech Dashboard ───────────────────────────────────────────────────────────
function TechDashboard({ jobs, setJobs, currentUser }) {
  const my = jobs.filter(j => j.tech_id === currentUser.id);
  const pending = my.filter(j => j.status === 'scheduled');
  const done = my.filter(j => ['paid','complete'].includes(j.status));

  const complete = async (job) => {
    const { data: updated } = await supabase.from('jobs').update({ status: 'paid', completed_date: new Date().toISOString().split('T')[0] }).eq('id', job.id).select().single();
    setJobs(js => js.map(j => j.id === job.id ? updated : j));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>🔧 My Jobs</div></div>
      <div style={s.page}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={s.card()}><div style={{ fontSize: 11, color: '#8888aa', marginBottom: 4 }}>Pending</div><div style={{ fontWeight: 800, fontSize: 26, color: '#f59e0b' }}>{pending.length}</div></div>
          <div style={s.card()}><div style={{ fontSize: 11, color: '#8888aa', marginBottom: 4 }}>Completed</div><div style={{ fontWeight: 800, fontSize: 26, color: '#10b981' }}>{done.length}</div></div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Upcoming Jobs</div>
        {pending.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#555570' }}><div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div><div>No pending jobs!</div></div>}
        {pending.map(j => (
          <div key={j.id} style={{ ...s.card({ borderLeft: '3px solid #4f8ef7', marginBottom: 12 }) }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}><div style={{ fontWeight: 700 }}>{j.customer_name}</div><Badge status={j.status} /></div>
            <div style={{ fontSize: 12, color: '#8888aa', marginBottom: 2 }}>📍 {j.address}</div>
            <div style={{ fontSize: 12, color: '#8888aa', marginBottom: 12 }}>📅 {j.scheduled_date || '—'} {j.scheduled_time && `· ${j.scheduled_time}`} · <span style={{ textTransform: 'capitalize' }}>{j.service}</span> · ${j.price}</div>
            <button style={{ ...s.btnGreen, width: '100%', padding: 10 }} onClick={() => complete(j)}>✅ Mark Complete & Charge Customer</button>
          </div>
        ))}
        {done.length > 0 && <>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, marginTop: 20 }}>Completed</div>
          {done.map(j => <div key={j.id} style={{ ...s.card({ marginBottom: 8, opacity: 0.7 }) }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ fontWeight: 500, fontSize: 13 }}>{j.customer_name}</div><div style={{ fontSize: 11, color: '#8888aa' }}>{j.address} · {j.completed_date}</div></div><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ color: '#10b981', fontWeight: 700 }}>${j.price}</span><Badge status={j.status} /></div></div></div>)}
        </>}
      </div>
    </div>
  );
}

// ─── Customers ────────────────────────────────────────────────────────────────
function CustomersView({ pins, jobs }) {
  const customers = pins.filter(p => ['closed','paid','appointment'].includes(p.status));
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={s.topbar}><div style={s.topbarTitle}>👥 Customers</div><span style={{ fontSize: 12, color: '#8888aa' }}>{customers.length} active</span></div>
      <div style={s.page}>
        <div style={{ background: '#111118', border: '1px solid #2a2a3a', borderRadius: 12, overflow: 'hidden' }}>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Name</th><th style={s.th}>Address</th><th style={s.th}>Plan</th><th style={s.th}>Price</th><th style={s.th}>Status</th><th style={s.th}>Card on File</th><th style={s.th}>Notes</th></tr></thead>
            <tbody>{customers.map(c => { const job = jobs.find(j => j.address === c.address); return <tr key={c.id}><td style={{ ...s.td, fontWeight: 500 }}>{c.name || 'Unknown'}</td><td style={{ ...s.td, fontSize: 12, color: '#8888aa' }}>{c.address}</td><td style={{ ...s.td, fontSize: 12, textTransform: 'capitalize' }}>{c.service || '—'}</td><td style={{ ...s.td, fontWeight: 700 }}>{c.price ? `$${c.price}` : '—'}</td><td style={s.td}><Badge status={c.status} /></td><td style={{ ...s.td, fontSize: 12, color: job?.card_on_file ? '#10b981' : '#555570' }}>{job?.card_on_file ? '✅ On file' : '—'}</td><td style={{ ...s.td, fontSize: 12, color: '#8888aa', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.notes}</td></tr>; })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('map');
  const [pins, setPins] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase on login
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const loadData = async () => {
      setLoading(true);
      const [{ data: usersData }, { data: pinsData }, { data: jobsData }] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('pins').select('*').order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').order('created_at', { ascending: false }),
      ]);
      setAllUsers(usersData || []);
      setPins(pinsData || []);
      setJobs(jobsData || []);
      setLoading(false);
    };
    loadData();
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
    admin: [{ id: 'dashboard', icon: '📊', label: 'Dashboard' }, { id: 'map', icon: '🗺', label: 'Field Map' }, { id: 'schedule', icon: '📅', label: 'Schedule' }, { id: 'customers', icon: '👥', label: 'Customers' }],
    rep: [{ id: 'map', icon: '🗺', label: 'Field Map' }, { id: 'schedule', icon: '📅', label: 'Schedule' }, { id: 'dashboard', icon: '📈', label: 'My Stats' }, { id: 'customers', icon: '👥', label: 'Customers' }],
    tech: [{ id: 'jobs', icon: '🔧', label: 'My Jobs' }, { id: 'schedule', icon: '📅', label: 'Schedule' }],
  };

  const roleColor = { admin: '#4f8ef7', rep: '#10b981', tech: '#f59e0b' }[user.role];

  const renderPage = () => {
    if (page === 'map') return <MapView pins={pins} setPins={setPins} currentUser={user} allUsers={allUsers} />;
    if (page === 'schedule') return <ScheduleView jobs={jobs} setJobs={setJobs} currentUser={user} allUsers={allUsers} />;
    if (page === 'dashboard') return user.role === 'admin' ? <AdminDashboard pins={pins} jobs={jobs} allUsers={allUsers} /> : <RepDashboard pins={pins} jobs={jobs} currentUser={user} />;
    if (page === 'jobs') return <TechDashboard jobs={jobs} setJobs={setJobs} currentUser={user} />;
    if (page === 'customers') return <CustomersView pins={pins} jobs={jobs} />;
    return null;
  };

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>Wash<span style={{ color: '#4f8ef7' }}>Ops</span></div>
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
