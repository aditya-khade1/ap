export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919370549753";
export const DISPLAY_WHATSAPP_NUMBER = "+91 93705 49753";

export interface WhatsAppLineItem {
  name: string;
  price: number;
  quantity: number;
}

export interface WhatsAppOrderInput {
  customerName: string;
  phone: string;
  address: string;
  pincode: string;
  items: WhatsAppLineItem[];
  total: number;
  discount?: number;
}

/**
 * Build the full WhatsApp order message text.
 */
export function buildWhatsAppOrderMessage(input: WhatsAppOrderInput): string {
  const lines: string[] = [];

  lines.push("Hello AP Fashion Mart,");
  lines.push("");
  lines.push("I want to place an order.");
  lines.push("");

  lines.push("Customer:");
  lines.push(`Name: ${input.customerName}`);
  if (input.phone) lines.push(`Phone: ${input.phone}`);
  lines.push("");

  lines.push("Address:");
  lines.push(String(input.address || ""));
  if (input.pincode) lines.push(`Pincode: ${input.pincode}`);
  lines.push("");

  const items =
    Array.isArray(input.items) && input.items.length
      ? input.items
      : [];

  lines.push("Order:");
  if (items.length) {
    items.forEach((item, i) => {
      lines.push(
        `${i + 1}. ${item.name} - ₹${formatPrice(item.price)} x ${
          item.quantity
        } = ₹${formatPrice(item.price * item.quantity)}`
      );
    });
    lines.push("");
    if (input.discount && input.discount > 0) {
      const discountedTotal = Math.max(
        0,
        input.total - input.discount
      );
      lines.push(`Discount: -₹${formatPrice(input.discount)}`);
      lines.push(`Total: ₹${formatPrice(discountedTotal)}`);
    } else {
      lines.push(`Total: ₹${formatPrice(input.total)}`);
    }
  } else {
    lines.push(`Total: ₹${formatPrice(input.total)}`);
  }
  lines.push("");

  lines.push("Payment:");
  lines.push("Pay on Delivery");
  lines.push("");

  lines.push("Please confirm my order.");

  return lines.join("\n");
}

function formatPrice(n: number) {
  return n.toLocaleString("en-IN");
}

/**
 * Build a wa.me link with the encoded message.
 */
export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
