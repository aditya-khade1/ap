import Link from "next/link";
import { ShieldCheck, Heart, Sparkles, MessageCircle, Truck } from "lucide-react";

export default function WhyShopWithUs() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Trusted Value",
      desc: "Friendly pricing across everyday and festive styles.",
    },
    {
      icon: Heart,
      title: "Curated Styles",
      desc: "Pieces selected for family wardrobes and gifting.",
    },
    {
      icon: Sparkles,
      title: "Easy Enquiry",
      desc: "Ask about stock and sizes over WhatsApp.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Quick dispatch and careful packaging for every order.",
    },
    {
      icon: MessageCircle,
      title: "Personal Service",
      desc: "Talk to our team directly for styling advice.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-sand p-8 sm:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-dark">
          Why shop with us
        </p>
        <h2 className="mt-3 max-w-lg font-serif text-4xl">
          Local store warmth, modern shopping convenience.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <feature.icon className="mb-3 text-brand-dark" size={24} />
              <div className="font-semibold">{feature.title}</div>
              <p className="mt-1 text-sm text-ink/65">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
