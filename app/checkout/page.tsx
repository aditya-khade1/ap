"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  IndianRupee,
  User,
  Phone,
  MapPin,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { buildWhatsAppOrderMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { store } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

export default function CheckoutPage() {
  const { items, updateQuantity, removeItem } = useCart();
  const { addToast } = useToast();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [placed, setPlaced] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const validate = () => {
    if (!customerName.trim()) {
      addToast("Please enter your name.", "error");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, ""))) {
      addToast("Please enter a valid 10-digit mobile number.", "error");
      return false;
    }
    if (!address.trim()) {
      addToast("Please enter your delivery address.", "error");
      return false;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      addToast("Please enter a valid 6-digit pincode.", "error");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      router.push("/shop");
      return;
    }
    if (!validate()) return;

    const message = buildWhatsAppOrderMessage({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      pincode: pincode.trim(),
      items: items.map((i) => ({
        name: `${i.name}${i.size ? ` (Size: ${i.size})` : ""}${
          i.color ? ` - ${i.color}` : ""
        }`,
        price: i.price,
        quantity: i.quantity,
      })),
      total: subtotal,
    });

    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
    setPlaced(true);
    addToast("Opening WhatsApp — send your order to confirm!");
  };

  const inputClass =
    "w-full rounded-xl border border-line bg-white px-4 py-3.5 pl-11 text-base outline-none transition focus:border-brand-dark";

  if (placed) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-success-tint text-success">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="mt-6 font-serif text-3xl">Order Ready to Send!</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          WhatsApp should have opened with your order details. Just hit{" "}
          <strong>Send</strong> and our team will confirm your order and delivery
          details.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3">
          <a
            href={`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
              "Hi AP Fashion Mart! I just sent my order."
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-semibold text-white transition hover:bg-whatsapp-deep"
          >
            <MessageCircle size={18} /> Open WhatsApp Again
          </a>
          <Link
            href="/shop"
            className="rounded-full bg-brand-dark px-6 py-4 text-center text-sm font-semibold text-white transition hover:bg-brand-deep"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-ink/5 text-ink">
          <IndianRupee size={26} />
        </div>
        <h1 className="mt-6 font-serif text-3xl">Your Bag is Empty</h1>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          Add some products to your bag so you can place an order.
        </p>
        <Link
          href="/shop"
          className="mt-8 rounded-full bg-brand-dark px-6 py-3.5 text-sm font-semibold text-white"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-4 inline-flex items-center text-sm text-ink/50 transition hover:text-ink"
      >
        &larr; Continue Shopping
      </Link>
      <h1 className="font-serif text-3xl sm:text-4xl">Checkout</h1>
      <p className="mt-2 text-sm text-ink/65">
        Fast &amp; simple — your order is confirmed over WhatsApp with Cash on
        Delivery.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        {/* Form */}
        <div className="rounded-3xl bg-white p-5 sm:p-8 shadow-soft">
          <h2 className="mb-5 font-serif text-2xl">Delivery Details</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePlaceOrder();
            }}
            className="space-y-5"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    id="name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-medium">
                  Delivery Address
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-ink/40" />
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / flat, street, area, city, state"
                    rows={3}
                    autoComplete="street-address"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3.5 pl-11 text-base outline-none transition focus:border-brand-dark resize-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="pincode" className="mb-1.5 block text-sm font-medium">
                  Pincode
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    id="pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) =>
                      setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="6-digit pincode"
                    autoComplete="postal-code"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl border border-success/30 bg-success-tint p-4">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 size={18} />
                <span className="font-medium">Pay on Delivery</span>
              </div>
              <p className="mt-1 text-sm text-ink/65">
                Pay in cash when your order is delivered.
              </p>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-base font-semibold text-white transition hover:bg-whatsapp-deep"
            >
              <MessageCircle size={20} /> Place Order on WhatsApp
            </button>
            <p className="text-center text-xs text-ink/50">
              You&apos;ll be redirected to WhatsApp to confirm your order. No
              online payment needed.
            </p>
          </form>
        </div>

        {/* Order summary */}
        <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-soft lg:sticky lg:top-24">
          <h2 className="mb-4 font-serif text-xl">Order Summary</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-3">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${item.slug}`}
                    className="block truncate text-sm font-medium hover:text-brand-dark"
                  >
                    {item.name}
                  </Link>
                  <div className="text-xs text-ink/50">
                    {formatPrice(item.price)}
                    {item.size ? ` · ${item.size}` : ""}
                  </div>
                  <div className="mt-1 inline-flex items-center rounded-full border border-line">
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-black/5"
                      aria-label="Decrease"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-xs font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-black/5"
                      aria-label="Increase"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="grid h-8 w-8 place-items-center rounded-full text-ink/30 transition hover:bg-danger-tint hover:text-danger"
                    aria-label="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="text-sm text-ink/65">Subtotal</span>
            <span className="font-serif text-xl font-bold">
              {formatPrice(subtotal)}
            </span>
          </div>
          <p className="mt-3 text-xs text-ink/50">
            Delivery charges and final total will be confirmed by our team on
            WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}
