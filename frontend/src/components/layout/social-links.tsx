import {
  faGithub,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { githubUrl, instagramUrl, linkedinUrl, xUrl } from "@/lib/site";

const networks = [
  { name: "GitHub", href: githubUrl, icon: faGithub },
  { name: "LinkedIn", href: linkedinUrl, icon: faLinkedin },
  { name: "Instagram", href: instagramUrl, icon: faInstagram },
  { name: "X", href: xUrl, icon: faXTwitter },
] as const;

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`social-links${compact ? " social-links--compact" : ""}`}>
      {networks.map(({ name, href, icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={compact ? name : undefined}
          title={name}
        >
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${icon.icon[0]} ${icon.icon[1]}`}
            focusable="false"
          >
            {(Array.isArray(icon.icon[4]) ? icon.icon[4] : [icon.icon[4]]).map(
              (path, index) => (
                <path key={index} fill="currentColor" d={path} />
              ),
            )}
          </svg>
          {!compact && <span>{name}</span>}
        </a>
      ))}
    </div>
  );
}
