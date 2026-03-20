import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import PolaroidCard from "./PolaroidCard";
import QRCard from "./QRCard";
import SocialIcons from "./SocialIcons";

function OwnerView({ mosaic, connections, onDeleteConnection, canDelete = true }) {
  const [activeConnection, setActiveConnection] = useState(null);
  const [toast, setToast] = useState("");
  const guestUrl = `${window.location.origin}/mosaic/${mosaic.id}?mode=guest`;

  const collageCountLabel = useMemo(() => {
    const count = connections.length;
    return `${count} ${count === 1 ? "person" : "people"} on your wall`;
  }, [connections.length]);

  const handleDelete = async (connection) => {
    const confirmed = window.confirm(`Remove ${connection.first_name} from your wall?`);
    if (!confirmed) return;

    const result = await onDeleteConnection(connection.id);
    if (result.ok) {
      setToast("Card removed from your wall.");
      setTimeout(() => setToast(""), 1800);
      return;
    }

    setToast(result.message || "Hmm, something went wrong - try again?");
    setTimeout(() => setToast(""), 2400);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(guestUrl);
      setToast("Link copied. Invite someone new.");
      setTimeout(() => setToast(""), 1800);
    } catch {
      setToast("Could not copy link right now.");
      setTimeout(() => setToast(""), 1800);
    }
  };

  const handleDownload = async () => {
    const node = document.getElementById("mosaic-collage");
    if (!node) return;

    const canvas = await html2canvas(node, {
      backgroundColor: "#FDF6EC",
      useCORS: true,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `mosaic-${mosaic.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
      <header className="animate-fade-in-up">
        <p className="font-body text-sm uppercase tracking-[0.16em] text-charcoal/55">Mosaic</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-charcoal sm:text-5xl">
          Everyone {mosaic.owner_name} has met
        </h1>
        <p className="mt-3 max-w-2xl font-body text-charcoal/70">{collageCountLabel}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyLink}
            className="rounded-full border border-charcoal/20 bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-charcoal/40"
          >
            Copy share link
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-full border border-charcoal/20 bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-charcoal/40"
          >
            Download collage
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,240px]">
        <section id="mosaic-collage" className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
          {connections.map((connection) => (
            <PolaroidCard
              key={connection.id}
              connection={connection}
              onClick={setActiveConnection}
              onDelete={canDelete ? handleDelete : undefined}
              readOnly={!canDelete}
            />
          ))}
        </section>
        <QRCard mosaicId={mosaic.id} />
      </div>

      {activeConnection ? (
        <div className="fixed inset-0 z-20 grid place-items-center bg-charcoal/60 p-4" onClick={() => setActiveConnection(null)}>
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={activeConnection.selfie_url}
              alt={activeConnection.first_name}
              className="h-72 w-full rounded-xl object-cover"
            />
            <h2 className="mt-4 font-display text-3xl text-charcoal">
              {[activeConnection.first_name, activeConnection.last_name].filter(Boolean).join(" ")}
            </h2>
            <SocialIcons connection={activeConnection} />
            <button
              type="button"
              className="mt-6 rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-cream"
              onClick={() => setActiveConnection(null)}
            >
              Close
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-charcoal px-4 py-2 text-sm text-cream">
          {toast}
        </div>
      ) : null}
    </div>
  );
}

export default OwnerView;
