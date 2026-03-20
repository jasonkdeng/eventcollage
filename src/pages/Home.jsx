import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sha256Hex, supabase } from "../lib/supabase";

function getOwnerTokenMap() {
  try {
    return JSON.parse(localStorage.getItem("mosaic_owner_tokens") || "{}");
  } catch {
    return {};
  }
}

function Home() {
  const [ownerName, setOwnerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateMosaic = async (event) => {
    event.preventDefault();
    if (!ownerName.trim()) {
      setError("Tell us your name first.");
      return;
    }

    setSubmitting(true);
    setError("");

    const ownerToken = `${crypto.randomUUID()}-${Math.random().toString(36).slice(2)}`;
    const ownerTokenHash = await sha256Hex(ownerToken);

    const { data, error: insertError } = await supabase
      .from("mosaics")
      .insert({ owner_name: ownerName.trim(), owner_key_hash: ownerTokenHash })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError("Hmm, something went wrong - try again?");
      return;
    }

    const tokenMap = getOwnerTokenMap();
    tokenMap[data.id] = ownerToken;
    localStorage.setItem("mosaic_owner_tokens", JSON.stringify(tokenMap));

    navigate(`/mosaic/${data.id}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-terracotta/20 bg-white/70 p-7 shadow-xl backdrop-blur sm:p-10">
        <p className="font-body text-sm uppercase tracking-[0.18em] text-charcoal/55">Mosaic</p>
        <h1 className="mt-2 font-display text-5xl leading-[1.05] text-charcoal sm:text-6xl">
          A living wall of every face you've met.
        </h1>
        <p className="mt-5 max-w-xl text-base text-charcoal/70 sm:text-lg">
          Start your Mosaic in seconds. Share your QR code when you meet someone, and let your collage grow in real
          time.
        </p>

        <form onSubmit={handleCreateMosaic} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={ownerName}
            onChange={(event) => setOwnerName(event.target.value)}
            placeholder="Your first name"
            className="w-full rounded-2xl border border-charcoal/15 bg-cream px-4 py-3 text-charcoal outline-none transition focus:border-terracotta"
            maxLength={80}
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-terracotta px-6 py-3 font-semibold text-white transition hover:brightness-95 disabled:opacity-70"
          >
            {submitting ? "Building your wall..." : "Create your Mosaic"}
          </button>
        </form>

        {error ? <p className="mt-3 text-sm text-[#B24A2B]">{error}</p> : null}
      </div>
    </main>
  );
}

export default Home;
