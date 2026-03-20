import { formatDistanceToNow } from "date-fns";
import SocialIcons from "./SocialIcons";

function hashRotation(input) {
  let hash = 0;
  const text = String(input ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return ((Math.abs(hash) % 9) - 4) * 1;
}

function PolaroidCard({ connection, onClick, onDelete, readOnly = false }) {
  const fullName = [connection.first_name, connection.last_name].filter(Boolean).join(" ").trim();
  const rotation = hashRotation(connection.id || fullName);

  return (
    <article
      className="group relative break-inside-avoid animate-pop-in rounded-sm bg-white p-3 pb-4 shadow-polaroid transition-transform duration-200 hover:-translate-y-1"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <button
        type="button"
        className="w-full text-left"
        onClick={() => onClick?.(connection)}
        disabled={!onClick}
      >
        <img
          src={connection.selfie_url}
          alt={`${fullName || connection.first_name} selfie`}
          className="h-56 w-full rounded-sm object-cover sm:h-64"
          loading="lazy"
        />
        <div className="mt-3">
          <p className="font-display text-xl text-charcoal">{connection.first_name}</p>
          <p className="mt-1 text-xs text-charcoal/55">
            Joined {formatDistanceToNow(new Date(connection.added_at), { addSuffix: true })}
          </p>
          <SocialIcons connection={connection} />
        </div>
      </button>

      {!readOnly && onDelete ? (
        <button
          type="button"
          onClick={() => onDelete(connection)}
          className="absolute right-3 top-3 hidden rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-charcoal/70 shadow group-hover:block"
        >
          Delete
        </button>
      ) : null}
    </article>
  );
}

export default PolaroidCard;
