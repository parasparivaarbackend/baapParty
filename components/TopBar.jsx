import Link from "next/link";
import { Mail, Phone, Youtube, Facebook, Instagram, X, XIcon } from "lucide-react";
import { PARTY } from "@/data/party";
const notices = [
    "Bhartiya Avijeet Aawaz Party welcomes you",
    "Become a member of BAAP and join the movement for a united, compassionate Bharat",
    `Reach us: ${PARTY.phone} · ${PARTY.address}`,
];
export default function TopBar() {
    return (
      <div className="w-full bg-maroon-dark text-black font-bold text-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-0 py-2">
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
              {[...notices, ...notices].map((n, i) => (
                <span key={i} className="opacity-90">
                  {n.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            <a
              href={`mailto:${PARTY.socials.email}`}
              className="flex items-center gap-1 hover:text-marigold"
            >
              <Mail size={15} /> {PARTY.socials.email}
            </a>
            <span className="flex items-center gap-1">
              <Phone size={15} /> {PARTY.phone}
            </span>
            <span className="flex items-center gap-2 border-l border-white/20 pl-4">
              <Link
                href="#"
                aria-label="Twitter"
                className="hover:text-marigold"
              >
                {/* <XIcon size={19} /> */}
                <img
                  width="17"
                  height="17"
                  src="https://img.icons8.com/ios/50/twitterx--v2.png"
                  alt="twitterx--v2"
                />
              </Link>

              <Link
                href="#"
                aria-label="Instagram"
                className="hover:text-marigold"
              >
                <Instagram size={17} />
              </Link>

              <Link
                href={PARTY.socials.youtube}
                target="_blank"
                aria-label="YouTube"
                className="hover:text-marigold"
              >
                <Youtube size={20} />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="hover:text-marigold"
              >
                <Facebook size={17} />
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
}
