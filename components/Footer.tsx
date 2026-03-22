import Link from "next/link";
import Image from "next/image";
import { Phone, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-martha-black text-martha-cream pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="max-w-6xl mx-auto w-full min-w-0 section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <div>
            <Link href="/" className="inline-block">
              <Image
                src="https://res.cloudinary.com/dyfnobo9r/image/upload/v1773632695/Realtor_Martha_Logo_Final.Black_n1rad7.png"
                alt="Realtor Martha"
                width={120}
                height={38}
                className="h-8 w-auto brightness-0 invert opacity-95"
              />
            </Link>
            <p className="mt-4 text-sm text-martha-cream/80 max-w-xs">
              Start your story here. Professional real estate services in Kenya.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-martha-warm mb-4">Quick links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-martha-warm transition-colors">Home</Link></li>
              <li><Link href="/for-sale" className="hover:text-martha-warm transition-colors">For Sale</Link></li>
              <li><Link href="/about" className="hover:text-martha-warm transition-colors">About Us</Link></li>
              <li><Link href="/blogs" className="hover:text-martha-warm transition-colors">Blogs</Link></li>
              <li><Link href="/contact" className="hover:text-martha-warm transition-colors">Contact</Link></li>
              <li><Link href="/booking" className="hover:text-martha-warm transition-colors">Book a viewing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-martha-warm mb-4">Contact</h3>
            <a
              href="tel:+254732868220"
              className="flex items-center gap-2 text-sm hover:text-martha-warm transition-colors"
            >
              <Phone size={16} /> +254 732 868220
            </a>
            <a
              href="https://www.marthapropertiesco.ke"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm mt-2 hover:text-martha-warm transition-colors break-all min-w-0"
            >
              <Globe size={16} className="shrink-0 mt-0.5" aria-hidden />
              <span>www.marthapropertiesco.ke</span>
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-martha-charcoal text-center text-sm text-martha-cream/70">
          © {new Date().getFullYear()} Realtor Martha. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
