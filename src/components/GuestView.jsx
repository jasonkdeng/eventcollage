import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import PolaroidCard from "./PolaroidCard";

function GuestView({ mosaic, onSubmitConnection, wallPreview, error }) {
  const [selfieFile, setSelfieFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    linkedinUrl: "",
    instagramHandle: "",
    twitterHandle: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localError, setLocalError] = useState("");

  const helperText = useMemo(() => {
    if (success) return `You're on ${mosaic.owner_name}'s wall!`;
    return "A quick selfie and your name is all it takes.";
  }, [mosaic.owner_name, success]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelfieFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError("");

    if (!selfieFile) {
      setLocalError("Please add a selfie first.");
      return;
    }
    if (!form.firstName.trim()) {
      setLocalError("First name is required.");
      return;
    }

    setSubmitting(true);
    const result = await onSubmitConnection({ selfieFile, ...form });
    setSubmitting(false);

    if (!result.ok) {
      setLocalError(result.message || "Hmm, something went wrong - try again?");
      return;
    }

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E8825A", "#A8B89A", "#FDF6EC", "#2C2C2C"],
    });
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-sage/40 bg-white/75 p-6 text-center shadow-lg backdrop-blur">
          <h2 className="font-display text-4xl text-charcoal">You're on {mosaic.owner_name}'s wall! 🎉</h2>
          <p className="mt-2 text-charcoal/70">Take a peek at the living collage.</p>
        </div>
        <section className="mt-8 columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3 opacity-95 transition-opacity duration-700">
          {wallPreview.map((connection) => (
            <PolaroidCard key={connection.id} connection={connection} readOnly />
          ))}
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1fr,1fr] lg:px-10">
      <section>
        <p className="text-sm uppercase tracking-[0.18em] text-charcoal/55">Mosaic Guest</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
          You just met {mosaic.owner_name}. 👋 Add yourself to their world.
        </h1>
        <p className="mt-4 text-charcoal/70">{helperText}</p>
      </section>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-terracotta/25 bg-white/70 p-5 shadow-lg backdrop-blur sm:p-6">
        <label className="block text-sm font-semibold text-charcoal">Step 1 - Selfie</label>
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          className="mt-2 block w-full rounded-xl border border-charcoal/15 bg-cream p-3 text-sm"
        />

        {preview ? (
          <img src={preview} alt="Selfie preview" className="mt-3 h-52 w-full rounded-xl object-cover" />
        ) : (
          <div className="mt-3 grid h-52 place-items-center rounded-xl border border-dashed border-charcoal/20 bg-cream text-sm text-charcoal/55">
            Your preview appears here
          </div>
        )}

        <div className="mt-5 space-y-3">
          <label className="block text-sm font-semibold text-charcoal">Step 2 - Your info</label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleFormChange}
            placeholder="First name *"
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3"
            required
          />
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleFormChange}
            placeholder="Last name (optional)"
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3"
          />
          <input
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={handleFormChange}
            placeholder="LinkedIn URL"
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3"
          />
          <input
            name="instagramHandle"
            value={form.instagramHandle}
            onChange={handleFormChange}
            placeholder="instagram.com/your-handle"
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3"
          />
          <input
            name="twitterHandle"
            value={form.twitterHandle}
            onChange={handleFormChange}
            placeholder="x.com/your-handle"
            className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3"
          />
        </div>

        {(localError || error) ? <p className="mt-3 text-sm text-[#B24A2B]">{localError || error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-5 w-full rounded-xl bg-terracotta px-4 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Adding you to the wall..." : "Add me to the wall"}
        </button>
      </form>
    </div>
  );
}

export default GuestView;
