export const store = {
  name: "AP Fashion Mart",
  phone: "+91 93705 49753",
  whatsapp: "919370549753",
  mapUrl: "https://maps.app.goo.gl/RDBwSv3CkggKT9JH9",
  email: "info@apfashionmart.com",
  address: "AP Fashion Mart, Maharashtra, India",
  logo: "/logo.png",
};

export const categories = [
  {
    name: "Sarees",
    slug: "sarees",
    description: "Elegant sarees for every occasion",
    image: "/images/saree-1.png",
  },
  {
    name: "Kids Wear",
    slug: "kids-wear",
    description: "Cute styles for little ones",
    image: "/images/kids.jpg",
  },
  {
    name: "Jewellery",
    slug: "jewellery",
    description: "Statement pieces and everyday sparkle",
    image: "/images/jewellery-1.jpg",
  },
  {
    name: "Bangles",
    slug: "bangles",
    description: "Traditional and modern bangles",
    image: "/images/bangles.png",
  },
  {
    name: "Night Suit",
    slug: "night-suit",
    description: "Cozy and elegant nightwear",
    image: "/images/nightsuit.png",
  },
  {
    name: "Kurti",
    slug: "kurti",
    description: "Stylish kurtis for every day",
    image: "/images/kurti.jpg",
  },
  {
    name: "Blouse",
    slug: "blouse",
    description: "Elegant blouses for every look",
    image: "/images/blouse.png",
  },
  {
    name: "Hand Bags",
    slug: "hand-bags",
    description: "Stylish handbags for every day",
    image: "/images/handbag.png",
  },
  {
    name: "Ladies Innerwear",
    slug: "ladies-innerwear",
    description: "Comfortable innerwear for every day",
    image: "/images/nightsuit.png",
  },
];

export const categorySlugMap: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.name, c.slug])
);

export function getWhatsAppUrl(
  productName?: string,
  productPrice?: number,
  productUrl?: string
): string {
  let message = `Hello AP Fashion Mart,
I am interested in your products.

Please share more details.`;

  if (productName) {
    message = `Hello AP Fashion Mart,
I am interested in:
${productName}`;
    if (productPrice) {
      message += `
Price: ₹${productPrice.toLocaleString("en-IN")}`;
    }
    message += `

Please share more details.`;
    if (productUrl) {
      message += `

${productUrl}`;
    }
  }

  return `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`;
}