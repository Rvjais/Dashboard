import { useEffect, useMemo, useState } from "react";

/* ---------- tiny UI primitives (no extra libs) ---------- */
const Label = ({ children, htmlFor, required }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-800 dark:text-gray-100">
    {children}{required && <span className="text-red-500"> *</span>}
  </label>
);

const Input = ({ id, ...props }) => (
  <input
    id={id}
    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
    {...props}
  />
);

const Select = ({ id, children, ...props }) => (
  <select
    id={id}
    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ id, ...props }) => (
  <textarea
    id={id}
    rows={3}
    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-100"
    {...props}
  />
);

const Card = ({ children }) => (
  <div className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/90 dark:bg-[#101216] shadow-sm">
    {children}
  </div>
);

/* ---------- top stepper ---------- */
function Stepper({ steps = [], current = 0 }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {steps.map((s, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={i} className="flex items-center gap-2">
            <div
              className={[
                "h-7 w-7 shrink-0 rounded-full grid place-items-center text-xs font-semibold",
                done
                  ? "bg-green-600 text-white"
                  : active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-200",
              ].join(" ")}
              title={s}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="h-[2px] w-6 md:w-10 bg-gray-300 dark:bg-white/10 rounded-full" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- the page ---------- */
export default function OnboardingBasic() {
  // Theme (optional)
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    const r = document.documentElement;
    if (theme === "dark") r.classList.add("dark");
    else r.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const steps = useMemo(
    () => [
      "Basic Info",
      "Contacts",
      "Business",
      "Licenses",
      "Operations",
      "Docs",
      "Branding",
      "Services",
      "Pricing",
      "Team",
      "Compliance",
      "Review",
      "Confirm",
    ],
    []
  );

  const [form, setForm] = useState({
    clientName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    gst: "",
    pan: "",
    state: "",
    city: "",
    pincode: "",
    regType: "",
    udyam: "",
    // Healthcare licenses
    medicalCouncil: "",
    clinicLicense: "",
    drugLicense: "",
    nabh: "",
    fssai: "",
    bmwa: "",
    // Business
    industry: "Healthcare",
    businessType: "",
    monthlyBudget: "",
    servicesConfirmed: true,
  });

  const change = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!form.clientName.trim()) e.clientName = "Client name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!/^\+?\d{7,14}$/.test(form.phone.replace(/\s+/g, ""))) e.phone = "Enter a valid phone";
    if (form.pincode && !/^\d{4,7}$/.test(form.pincode)) e.pincode = "Enter a valid PIN/ZIP";
    if (form.gst && !/^[0-9A-Z]{15}$/.test(form.gst)) e.gst = "GST should be 15 characters";
    if (form.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan)) e.pan = "Invalid PAN format";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const res = await fetch(import.meta.env.VITE_API_BASE + "/onboarding/basic", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit");
      // navigate to next step or show toast
      alert("Saved! Proceeding to next step.");
      // e.g. useNavigate()('/onboarding/contacts')
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0c10] text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Basic Information & Business Details</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Step 1 of onboarding
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-sm"
            >
              {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
            </button>
            <a
              href="/admin/tasks"
              className="px-3 py-2 rounded-xl bg-purple-600 text-white text-sm hover:bg-purple-700"
            >
              Admin Tasks
            </a>
          </div>
        </div>

        {/* Stepper */}
        <Card>
          <div className="p-4 md:p-5">
            <Stepper steps={steps} current={0} />
          </div>
        </Card>

        {/* Info banner */}
        <Card>
          <div className="p-4 text-sm">
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 mr-2">
              ℹ️
            </span>
            For this step: Please email all brand files (logos, brand guidelines, marketing materials, etc.) to
            <a href="mailto:files@yourdomain.com" className="underline ml-1">files@yourdomain.com</a>
            {" "}with your client name in the subject line.
          </div>
        </Card>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-6">
          <Card>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName" required>Client Name</Label>
                  <Input id="clientName" name="clientName" placeholder="Enter your business/client name"
                         value={form.clientName} onChange={change} />
                  {errors.clientName && <p className="text-xs text-red-600 mt-1">{errors.clientName}</p>}
                </div>
                <div>
                  <Label htmlFor="email" required>Primary Email</Label>
                  <Input id="email" name="email" type="email" placeholder="you@email.com"
                         value={form.email} onChange={change} />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" required>Phone Number</Label>
                  <Input id="phone" name="phone" placeholder="+91 12345 12345"
                         value={form.phone} onChange={change} />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" name="website" placeholder="https://www.yourwebsite.com"
                         value={form.website} onChange={change} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea id="address" name="address" placeholder="Full address including city, state, and zip code"
                            value={form.address} onChange={change} />
                </div>
              </div>
            </div>
          </Card>

          {/* Indian Business Details */}
          <Card>
            <div className="p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">🇮🇳 Indian Business Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gst">GSTIN (if applicable)</Label>
                  <Input id="gst" name="gst" placeholder="22AAAAA0000A1Z5" value={form.gst} onChange={change} />
                  {errors.gst && <p className="text-xs text-red-600 mt-1">{errors.gst}</p>}
                </div>
                <div>
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" name="pan" placeholder="ABCDE1234F" value={form.pan} onChange={change} />
                  {errors.pan && <p className="text-xs text-red-600 mt-1">{errors.pan}</p>}
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select id="state" name="state" value={form.state} onChange={change}>
                    <option value="">Select State</option>
                    {["Delhi","Uttar Pradesh","Maharashtra","Karnataka","Telangana","Tamil Nadu","West Bengal"].map(s=>(
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" placeholder="Select City" value={form.city} onChange={change} />
                </div>
                <div>
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input id="pincode" name="pincode" placeholder="110001" value={form.pincode} onChange={change} />
                  {errors.pincode && <p className="text-xs text-red-600 mt-1">{errors.pincode}</p>}
                </div>
                <div>
                  <Label htmlFor="regType">Business Registration Type</Label>
                  <Select id="regType" name="regType" value={form.regType} onChange={change}>
                    <option value="">Select Registration Type</option>
                    <option value="sole">Sole Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="pvt">Private Limited</option>
                    <option value="llp">LLP</option>
                    <option value="opc">OPC</option>
                    <option value="ngo">NGO / Society</option>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="udyam">Udyam Registration Number (MSME)</Label>
                  <Input id="udyam" name="udyam" placeholder="UDYAM-XX-00-0000000" value={form.udyam} onChange={change} />
                </div>
              </div>
            </div>
          </Card>

          {/* Healthcare Licenses & Registrations */}
          <Card>
            <div className="p-5 space-y-4">
              <h3 className="font-semibold">🏥 Healthcare Licenses & Registrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="medicalCouncil">Medical Council Registration</Label>
                  <Input id="medicalCouncil" name="medicalCouncil" value={form.medicalCouncil} onChange={change} placeholder="MCI/State Medical Council Number" />
                </div>
                <div>
                  <Label htmlFor="clinicLicense">Clinical Establishment License</Label>
                  <Input id="clinicLicense" name="clinicLicense" value={form.clinicLicense} onChange={change} placeholder="State Health Department License" />
                </div>
                <div>
                  <Label htmlFor="drugLicense">Drug License (if applicable)</Label>
                  <Input id="drugLicense" name="drugLicense" value={form.drugLicense} onChange={change} placeholder="Wholesale / Retail DL" />
                </div>
                <div>
                  <Label htmlFor="nabh">NABH/NAccreditation</Label>
                  <Input id="nabh" name="nabh" value={form.nabh} onChange={change} placeholder="NABH/QCI Accreditation Number" />
                </div>
                <div>
                  <Label htmlFor="fssai">FSSAI License (if applicable)</Label>
                  <Input id="fssai" name="fssai" value={form.fssai} onChange={change} placeholder="FSSAI License Number" />
                </div>
                <div>
                  <Label htmlFor="bmwa">Biomedical Waste Authorization</Label>
                  <Input id="bmwa" name="bmwa" value={form.bmwa} onChange={change} placeholder="BMW Authorization Number" />
                </div>
              </div>
            </div>
          </Card>

          {/* Business */}
          <Card>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select id="industry" name="industry" value={form.industry} onChange={change}>
                    {["Healthcare","Pharma","Diagnostics","Dental","Wellness","Other"].map(x=>
                      <option key={x} value={x}>{x}</option>
                    )}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessType">Healthcare Business Type</Label>
                  <Select id="businessType" name="businessType" value={form.businessType} onChange={change}>
                    <option value="">Select Healthcare Business Type</option>
                    <option value="hospital">Hospital</option>
                    <option value="clinic">Clinic / Polyclinic</option>
                    <option value="lab">Diagnostic / Path Lab</option>
                    <option value="imaging">Imaging Centre</option>
                    <option value="doctor">Individual Doctor</option>
                    <option value="wellness">Wellness / Fitness</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="monthlyBudget">Monthly Marketing Budget</Label>
                  <Select id="monthlyBudget" name="monthlyBudget" value={form.monthlyBudget} onChange={change}>
                    <option value="">Select budget range</option>
                    <option value="25-50k">₹25k–₹50k</option>
                    <option value="50-100k">₹50k–₹1L</option>
                    <option value="100-200k">₹1L–₹2L</option>
                    <option value="200k+">₹2L+</option>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Services Confirmed */}
          <Card>
            <div className="p-5 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50/60 dark:bg-emerald-500/10 rounded-2xl">
              ✅ <span className="font-medium">Services Confirmed:</span> Your purchased services have been confirmed.
              This onboarding will help us gather the information needed to deliver specific services efficiently.
            </div>
          </Card>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-sm"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Next"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
