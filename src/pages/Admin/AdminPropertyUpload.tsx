import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Mail, LogOut, Upload, X, Plus, Home, MapPin, Bed, Bath, Car,
  Square, IndianRupee, Image as ImageIcon, CheckCircle2, Building2,
  KeyRound, ShieldCheck, AlertCircle, Loader2, Hash, ArrowLeft,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Property } from "@/utils/constants";
import axios from "axios";

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E6C97A";
const NAVY = "#0B1120";

const AVAILABLE_AMENITIES = [
  '24x7 Security',
  'Power Backup',
  'Lift',
  'CCTV Camera',
  'Gym',
  'Children Play Area',
  'Multipurpose Hall',
  'Private Pool',
  'Landscaped Gardens',
  'Private Terrace',
  'Modular Kitchen',
  'Sea View',
];
/* ─── Price formatting helper ────────────────────────────────────────────── */
function formatPrice(value: number, badge: string): string {
  if (!value || value <= 0) return "Price on Request";
  if (badge === "FOR RENT") {
    return `₹${value.toLocaleString("en-IN")}/month`;
  }
  if (value >= 10000000) {
    const cr = value / 10000000;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    const lakh = value / 100000;
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} Lakh`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

/* ─── LoginForm ──────────────────────────────────────────────────────────── */
interface LoginFormProps {
  onSuccess: () => void;
  onClose?: () => void;
}
function LoginForm({ onSuccess, onClose }: LoginFormProps) {
  const { adminLogin } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    const ok = await adminLogin(email.trim(), password);
    setSubmitting(false);
    if (ok) {
      onSuccess();
    } else {
      setError("Invalid email or password");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
    }
  };

  return (
    <motion.div
      animate={shaking ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md rounded-2xl p-8 sm:p-10 shadow-2xl"
      style={{
        background: "rgba(11,17,32,0.92)",
        backdropFilter: "blur(24px)",
        border: `1px solid ${GOLD}33`,
      }}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-white/10"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex flex-col items-center mb-8">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, boxShadow: `0 0 32px ${GOLD}55` }}
        >
          <Lock className="w-8 h-8" style={{ color: NAVY }} />
        </motion.div>
        <h1
          className="text-3xl font-bold text-white text-center"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          Admin Access
        </h1>
        <p className="text-sm text-white/60 mt-2 text-center">
          Sign in to manage property listings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              ref={emailRef}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@newstar.com"
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 text-white placeholder-white/30 outline-none transition"
              style={{ border: `1px solid ${GOLD}33` }}
              onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${GOLD}33`)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-white/70 mb-2">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full pl-10 pr-16 py-3 rounded-lg bg-white/5 text-white placeholder-white/30 outline-none transition"
              style={{ border: `1px solid ${GOLD}33` }}
              onFocus={(e) => (e.currentTarget.style.borderColor = GOLD)}
              onBlur={(e) => (e.currentTarget.style.borderColor = `${GOLD}33`)}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wider"
              style={{ color: GOLD }}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm px-4 py-3 rounded-lg"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.02 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="w-full py-3 rounded-lg font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY }}
        >
          {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {submitting ? "Signing In…" : "Sign In"}
        </motion.button>
      </form>
    </motion.div>
  );
}

/* ─── Full-page login ────────────────────────────────────────────────────── */
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ background: `radial-gradient(circle at 20% 20%, ${NAVY} 0%, #050912 60%, #000 100%)` }}
    >
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: GOLD }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: GOLD_LIGHT }} />
      <LoginForm onSuccess={onSuccess} />
    </main>
  );
}

/* ─── AdminNavButton ─────────────────────────────────────────────────────── */
export function AdminNavButton() {
  const { isAdminLoggedIn } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleClick = () => {
    if (isAdminLoggedIn) {
      navigate("/admin/dashboard");
    } else {
      setOpen(true);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    navigate("/admin/dashboard");
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        aria-label="Admin login"
        title="Login"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex items-center gap-2 rounded-lg overflow-hidden"
        style={{
          padding: "0.45rem 0.9rem",
          background: "transparent",
          border: `1px solid ${GOLD}44`,
          color: GOLD,
          fontFamily: "Inter, sans-serif",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transition: "border-color 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = `${GOLD}44`)}
      >
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{ background: `${GOLD}10` }}
        />
        <KeyRound className="w-3.5 h-3.5 relative" style={{ color: GOLD }} />
        <span className="relative hidden sm:inline">Login</span>
      </motion.button>

      {createPortal(
        <AnimatePresence>
          {open && !isAdminLoggedIn && (
            <motion.div
              key="admin-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              style={{ background: "rgba(5,9,18,0.78)", backdropFilter: "blur(8px)" }}
              onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
            >
              <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: GOLD }} />
              <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: GOLD_LIGHT }} />
              <motion.div
                key="admin-modal-card"
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="relative w-full max-w-md"
              >
                <LoginForm onSuccess={handleSuccess} onClose={() => setOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
type PropertyFormState = {
  title: string;
  type: string;
  badge: "FOR SALE" | "FOR RENT";
  status: string;
  priceVal: string;
  location: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  area: string;
  furnishing: string;
  description: string;
  images: string[];
  featured: boolean;
  showOnWebsite: boolean;
  amenities: string[];
};

function emptyForm(): PropertyFormState {
  return {
    title: "",
    type: "Apartment",
    badge: "FOR SALE",
    status: "Ready to Move",
    priceVal: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    area: "",
    furnishing: "Unfurnished",
    description: "",
    images: [],
    featured: true,
    showOnWebsite: true,
    amenities: [],
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const navigate = useNavigate();
  const { properties, isLoading, addProperty, deleteProperty, updateProperty } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState<PropertyFormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const editId = id || searchParams.get('edit');
    if (editId && properties.length > 0) {
      const propToEdit = properties.find(p => p.id.toString() === editId || p.slug === editId);
      if (propToEdit) {
        startEdit(propToEdit);
      }
      if (searchParams.has('edit')) {
        searchParams.delete('edit');
        setSearchParams(searchParams, { replace: true });
      }
    }
  }, [id, searchParams, properties, setSearchParams]);

  const startEdit = (p: Property) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      type: p.type || 'Apartment',
      badge: (p.badge as 'FOR SALE' | 'FOR RENT') || 'FOR SALE',
      status: p.status || 'Ready to Move',
      priceVal: String(p.priceVal || ''),
      location: p.location,
      bedrooms: String(p.beds || ''),
      bathrooms: String(p.baths || ''),
      parking: String(p.parking || ''),
      area: String(p.areaVal || p.area?.replace(/[^\d]/g, '') || ''),
      furnishing: p.furnishing || 'Unfurnished',
      description: p.description || '',
      images: p.gallery?.length ? p.gallery : p.image ? [p.image] : [],
      featured: p.featured ?? true,
      showOnWebsite: p.showOnWebsite ?? true,
      amenities: p.amenities || [],
    });
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    
    try {
      if (fileArray.length === 1) {
        const formData = new FormData();
        formData.append('image', fileArray[0]);
        const res = await axios.post('/api/upload/single', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          setForm(f => ({ ...f, images: [...f.images, res.data.url] }));
        }
      } else {
        const formData = new FormData();
        for (let i = 0; i < fileArray.length; i++) {
          formData.append('images', fileArray[i]);
        }
        const res = await axios.post('/api/upload/gallery', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) {
          setForm(f => ({ ...f, images: [...f.images, ...res.data.urls] }));
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images. Please try again.');
    }
  };

  const removeImage = (idx: number) =>
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const priceNum = Number(form.priceVal) || 0;
    const payload = {
      title: form.title,
      type: form.type,
      badge: form.badge,
      badgeColor: form.badge === 'FOR RENT' ? 'blue' : 'gold',
      status: form.status,
      priceVal: priceNum,
      price: formatPrice(priceNum, form.badge),
      location: form.location,
      beds: form.bedrooms ? Number(form.bedrooms) : undefined,
      baths: form.bathrooms ? Number(form.bathrooms) : undefined,
      parking: form.parking ? Number(form.parking) : undefined,
      area: form.area ? `${form.area} sq.ft` : "",
      areaVal: Number(form.area) || 0,
      furnishing: form.furnishing,
      description: form.description,
      image: form.images[0] || "",
      gallery: form.images,
      featured: form.featured,
      showOnWebsite: form.showOnWebsite,
      amenities: form.amenities,
    } as Omit<Property, "id">;

    let ok = false;
    if (editingId !== null) {
      ok = await updateProperty({ ...payload, id: editingId } as Property);
    } else {
      ok = await addProperty(payload);
    }
    setSubmitting(false);

    if (ok) {
      setForm(emptyForm());
      setEditingId(null);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/properties');
      }, 1500);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 3200);
    }
  };

  const handleDelete = async (id: number | string) => {
    setShowDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm === null) return;
    await deleteProperty(showDeleteConfirm);
    setShowDeleteConfirm(null);
    if (editingId === showDeleteConfirm) cancelEdit();
  };

  const inputBase =
    "w-full px-4 py-2.5 rounded-lg bg-white dark:bg-navy-950/50 text-gray-900 dark:text-white placeholder-gray-400 border border-[#0B1120]/10 dark:border-gold/20 focus:border-[#C9A84C] dark:focus:border-gold outline-none transition text-sm dark:focus:shadow-[0_0_12px_rgba(201,168,76,0.3)]";

  return (
    <div className="min-h-full flex flex-col">

      {/* Back Button (Top Left) */}
      <div className="w-full">
        <Link to="/admin/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0B1120] dark:text-slate-400 dark:hover:text-white transition-transform hover:-translate-x-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Link>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 60, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl"
            style={{ background: NAVY, border: `1px solid ${GOLD}` }}
          >
            <CheckCircle2 className="w-5 h-5" style={{ color: GOLD }} />
            <span className="text-sm text-white font-medium">
              {editingId ? 'Property updated successfully!' : 'Property added successfully!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error toast */}
      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, x: 60, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl"
            style={{ background: "#7f1d1d", border: "1px solid #ef4444" }}
          >
            <AlertCircle className="w-5 h-5 text-red-200" />
            <span className="text-sm text-white font-medium">Couldn't save property. Please try again.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6 w-full">

        {/* Form panel */}
        <motion.section
          variants={cardVariants} initial="hidden" animate="show" custom={0}
        >
          <div
            ref={formRef}
            className="bg-white dark:bg-navy-900 rounded-2xl shadow-sm p-6 sm:p-8 transition-colors duration-300"
            style={{ border: `1px solid ${editingId ? GOLD : GOLD}22` }}
          >
            <div className="flex items-center justify-between gap-3 mb-6 pb-4" style={{ borderBottom: `1px solid ${GOLD}22` }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center dark:bg-gold/10" style={{ background: `${GOLD}18` }}>
                  {editingId ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  ) : (
                    <Plus className="w-4 h-4" style={{ color: GOLD }} />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-[#0B1120] dark:text-white" style={{ fontFamily: '"Playfair Display", serif' }}>
                  {editingId ? 'Edit Property' : 'Add New Property'}
                </h2>
              </div>
              {editingId && (
                <button type="button" onClick={cancelEdit}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition hover:bg-slate-50"
                  style={{ color: '#64748b', borderColor: '#e2e8f0' }}>
                  <X className="w-3.5 h-3.5" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Property Reference Number */}
              <div>
                <Label icon={<Hash className="w-3.5 h-3.5" />} text="Property Reference Number" />
                <input
                  type="text"
                  readOnly
                  disabled
                  value={editingId ? (properties.find(p => p.id === editingId) as any)?.propertyNumber || '' : 'NSR-XXX (Auto-Generated)'}
                  className={`${inputBase} bg-slate-50 dark:bg-navy-900 font-bold uppercase tracking-wider cursor-not-allowed`}
                />
              </div>

              {/* Title */}
              <div>
                <Label icon={<Home className="w-3.5 h-3.5" />} text="Property Title" />
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Luxury 3BHK Apartment in Bandra"
                  className={inputBase}
                />
              </div>

              {/* Property Type & Listing Type */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Property Type" />
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={inputBase}
                  >
                    {["Apartment", "Villa", "Penthouse", "Bungalow", "Plot", "Commercial"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label text="Listing Type" />
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value as "FOR SALE" | "FOR RENT" })}
                    className={inputBase}
                  >
                    <option value="FOR SALE">For Sale</option>
                    <option value="FOR RENT">For Rent</option>
                  </select>
                </div>
              </div>

              {/* Construction Status & Furnishing */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label text="Construction Status" />
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className={inputBase}
                  >
                    {["Ready to Move", "Under Construction", "New Launch"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label text="Furnishing" />
                  <select
                    value={form.furnishing}
                    onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                    className={inputBase}
                  >
                    {["Furnished", "Semi-Furnished", "Unfurnished"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Location */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label icon={<IndianRupee className="w-3.5 h-3.5" />} text="Price (₹)" />
                  <input
                    required type="number" min="0"
                    value={form.priceVal}
                    onChange={(e) => setForm({ ...form, priceVal: e.target.value })}
                    placeholder="8500000"
                    className={inputBase}
                  />
                  {form.priceVal && Number(form.priceVal) > 0 && (
                    <p className="text-xs text-gray-400 mt-1.5">
                      Will display as: <span className="font-semibold" style={{ color: GOLD }}>{formatPrice(Number(form.priceVal), form.badge)}</span>
                    </p>
                  )}
                </div>
                <div>
                  <Label icon={<MapPin className="w-3.5 h-3.5" />} text="Location" />
                  <input
                    required type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Bandra West, Mumbai"
                    className={inputBase}
                  />
                </div>
              </div>

              {/* Beds / Baths / Parking / Area */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: <Bed className="w-3.5 h-3.5" />, text: "Bedrooms", key: "bedrooms", placeholder: "3" },
                  { icon: <Bath className="w-3.5 h-3.5" />, text: "Bathrooms", key: "bathrooms", placeholder: "2" },
                  { icon: <Car className="w-3.5 h-3.5" />, text: "Parking", key: "parking", placeholder: "1" },
                  { icon: <Square className="w-3.5 h-3.5" />, text: "Area (sqft)", key: "area", placeholder: "1450" },
                ].map(({ icon, text, key, placeholder }) => (
                  <div key={key}>
                    <Label icon={icon} text={text} />
                    <input
                      type={key === "area" ? "text" : "number"}
                      min="0"
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className={inputBase}
                    />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <Label text="Description" />
                <textarea
                  required rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the property — features, amenities, neighborhood…"
                  className={inputBase + " resize-none"}
                />
              </div>

              {/* Amenities */}
              <div>
                <Label text="Amenities" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isChecked = form.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => {
                          setForm(f => ({
                            ...f,
                            amenities: isChecked
                              ? f.amenities.filter(a => a !== amenity)
                              : [...f.amenities, amenity]
                          }))
                        }}
                        className={`py-2 px-3 text-left rounded-lg transition-all border flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'bg-gold/10 text-gold border-gold/30'
                            : 'bg-white dark:bg-navy-950 text-slate-500 dark:text-navy-300 border-[#0B1120]/10 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-900'
                        }`}
                      >
                        <span className="font-semibold text-[11px]">{amenity}</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-gold' : 'bg-slate-300 dark:bg-navy-600'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visibility toggles */}
              <div className="flex flex-wrap gap-4 rounded-xl p-4 bg-[#fafaf7] border border-[#0B1120]/10 dark:bg-navy-950 dark:border-navy-800 transition-colors">
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-[#0B1120] dark:text-white">
                  <input
                    type="checkbox"
                    checked={form.showOnWebsite}
                    onChange={(e) => setForm({ ...form, showOnWebsite: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#C9A84C]"
                  />
                  Show on Properties page
                </label>
                <label className="flex items-center gap-2 text-sm font-medium cursor-pointer text-[#0B1120] dark:text-white">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-[#C9A84C]"
                  />
                  Feature on Homepage
                </label>
              </div>

              {/* Images */}
              <div>
                <Label icon={<ImageIcon className="w-3.5 h-3.5" />} text="Property Images" />
                <motion.label
                  whileHover={{ scale: 1.01 }}
                  animate={{ borderColor: dragOver ? GOLD : `${GOLD}66` }}
                  transition={{ duration: 0.2 }}
                  className={`block cursor-pointer rounded-xl p-8 text-center transition ${dragOver ? 'bg-gold/10' : 'bg-[#fafaf7] dark:bg-navy-950'}`}
                  style={{ border: `2px dashed ${GOLD}66` }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
                >
                  <input
                    type="file" accept="image/*" multiple className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <motion.div
                    animate={{ y: dragOver ? -4 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: GOLD }} />
                    <p className="text-sm font-medium text-[#0B1120] dark:text-white">
                      {dragOver ? "Drop to upload" : "Click or drag images here"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 dark:text-navy-400">First image is used as the cover photo · PNG, JPG up to 10MB each</p>
                  </motion.div>
                </motion.label>

                <AnimatePresence>
                  {form.images.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4"
                    >
                      {form.images.map((src, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{ delay: i * 0.04 }}
                          className="relative group aspect-square rounded-lg overflow-hidden"
                        >
                          <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                          {i === 0 && (
                            <span className="absolute bottom-1 left-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 text-[#E6C97A]">
                              Cover
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => editingId ? cancelEdit() : setForm(emptyForm())}
                  className="px-5 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition hover:bg-gray-50"
                  style={{ border: `1px solid ${NAVY}22`, color: NAVY }}
                >
                  {editingId ? 'Cancel' : 'Reset'}
                </button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.015 }}
                  whileTap={{ scale: submitting ? 1 : 0.975 }}
                  className="flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{
                    background: `linear-gradient(135deg, ${NAVY}, #1a2540)`,
                    color: GOLD,
                    border: `1px solid ${GOLD}`,
                    boxShadow: `0 4px 24px rgba(11,17,32,0.18)`,
                  }}
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? (editingId ? 'Saving…' : 'Adding…') : (editingId ? 'Save Changes' : 'Add Property')}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.section>


      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(5,9,18,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowDeleteConfirm(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4"
              style={{ border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <h4 className="font-bold text-sm" style={{ color: NAVY }}>Confirm Delete</h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                This property will be permanently deleted and cannot be recovered. Are you sure?
              </p>
              <div className="flex justify-end gap-3 pt-1">
                <button onClick={() => setShowDeleteConfirm(null)}
                  className="py-2 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 transition cursor-pointer">
                  Cancel
                </button>
                <button onClick={confirmDelete}
                  className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition cursor-pointer">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ─── AdminPage (default export) ─────────────────────────────────────────── */
// FIX: LoginScreen now re-renders the page by using isAdminLoggedIn from context.
// The old code passed onSuccess={() => {}} which was a no-op — after login nothing happened.
function AdminPage() {
  const { isAdminLoggedIn, adminLogout } = useApp();
  const navigate = useNavigate();

  // After login succeeds, isAdminLoggedIn becomes true and we navigate properly
  const handleLoginSuccess = () => {
    navigate("/admin/upload", { replace: true });
  };

  return isAdminLoggedIn
    ? <AdminDashboard onLogout={adminLogout} />
    : <LoginScreen onSuccess={handleLoginSuccess} />;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */
function fieldStyle(): React.CSSProperties {
  return { border: `1px solid ${NAVY}22`, transition: "border-color 0.2s, box-shadow 0.2s" };
}

function Label({ text, icon }: { text: string; icon?: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold mb-2 text-[#0B1120] dark:text-navy-300">
      {icon}{text}
    </label>
  );
}

export default AdminPage;