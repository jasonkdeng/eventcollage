import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { normalizeLinkedIn, toInstagramUrl, toTwitterUrl } from "../lib/socials";

function IconLink({ href, label, children, className }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}

function SocialIcons({ connection }) {
  const linkedin = normalizeLinkedIn(connection.linkedin_url);
  const instagram = toInstagramUrl(connection.instagram_handle);
  const twitter = toTwitterUrl(connection.twitter_handle);

  if (!linkedin && !instagram && !twitter) {
    return null;
  }

  return (
    <div className="mt-3 flex items-center gap-3 text-lg">
      <IconLink
        href={linkedin}
        label="LinkedIn"
        className="text-charcoal/45 transition-colors duration-200 hover:text-[#0A66C2]"
      >
        <FaLinkedin />
      </IconLink>
      <IconLink
        href={instagram}
        label="Instagram"
        className="text-charcoal/45 transition-colors duration-200 hover:text-[#E4405F]"
      >
        <FaInstagram />
      </IconLink>
      <IconLink
        href={twitter}
        label="X"
        className="text-charcoal/45 transition-colors duration-200 hover:text-black"
      >
        <FaXTwitter />
      </IconLink>
    </div>
  );
}

export default SocialIcons;
