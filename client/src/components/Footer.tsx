import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";
import { MessageCircle } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      name: "Facebook",
      icon: SiFacebook,
      url: "https://www.facebook.com/heynidus",
      testId: "link-facebook",
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      url: "https://www.instagram.com/heynidus/",
      testId: "link-instagram",
    },
    {
      name: "TikTok",
      icon: SiTiktok,
      url: "https://www.tiktok.com/@heynidus",
      testId: "link-tiktok",
    },
    {
      name: "YouTube",
      icon: SiYoutube,
      url: "https://www.youtube.com/@heynidus",
      testId: "link-youtube",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: "https://wa.me/5491171077797",
      testId: "link-whatsapp-footer",
    },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-10">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src="/heynidus-logo.png"
              alt="HeyNidus"
              className="h-36 w-auto dark:brightness-0 dark:invert"
              data-testid="img-logo-footer"
            />
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} HeyNidus. Todos los derechos
              reservados.
            </p>
          </div>

          <div className="flex gap-6">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                  data-testid={social.testId}
                  title={social.name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
