import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const MESSAGE = [
  "Hello AP Fashion Mart,",
  "I couldn't find what I was looking for.",
  "I'm looking for: ",
].join("\n");

export default function CustomRequestSection() {
  return (
    <section className="mt-14 mb-4">
      <div className="rounded-3xl border border-line bg-white px-6 py-12 text-center shadow-soft sm:py-14">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-tint text-brand-dark">
          <MessageCircle size={22} />
        </div>
        <h2 className="mt-5 font-serif text-3xl text-ink">Didn't find what you're looking for?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/65">
          Just message us and describe what you&apos;re looking for. Tell us any
          product, color, size, design or style — we&apos;ll help you find it.
        </p>
        <a
          href={buildWhatsAppLink(MESSAGE)}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-dark px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep"
        >
          <MessageCircle size={17} /> Message Us on WhatsApp
        </a>
        <div className="mt-4 hidden text-sm text-ink/65 sm:block">
          <a
            href={buildWhatsAppLink("Hello AP Fashion Mart, I'd like to see more of your collection.")}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ink underline decoration-brand/40 underline-offset-4 transition hover:text-brand-dark"
          >
            See more on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
