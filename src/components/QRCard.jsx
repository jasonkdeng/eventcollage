import { QRCodeSVG } from "qrcode.react";

function QRCard({ mosaicId }) {
  const guestUrl = `${window.location.origin}/mosaic/${mosaicId}?mode=guest`;

  return (
    <aside className="sticky top-6 rounded-2xl border border-terracotta/30 bg-white/85 p-4 shadow-lg backdrop-blur">
      <h3 className="font-display text-xl text-charcoal">Show this to someone new</h3>
      <p className="mt-2 text-sm text-charcoal/70">One scan and they are on your wall forever.</p>
      <div className="mt-4 flex justify-center rounded-xl bg-cream p-3">
        <QRCodeSVG value={guestUrl} size={160} bgColor="#FDF6EC" fgColor="#2C2C2C" />
      </div>
    </aside>
  );
}

export default QRCard;
