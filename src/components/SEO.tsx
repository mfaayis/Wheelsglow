import { Helmet } from 'react-helmet-async';

interface ProductSchema {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  brand?: string;
  sku?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  name?: string;
  type?: string;
  image?: string;
  url?: string;
  canonical?: string;
  robots?: string;
  product?: ProductSchema;
}

export function SEO({
  title = 'WheelsGlow | Luxury LED Art Posters — Buy Online India',
  description = 'WheelsGlow — premium LED wall art posters of iconic cars. Only the headlights & taillights glow for a cinematic effect. Free shipping across India.',
  keywords = 'LED car poster India, luxury LED wall art, WheelsGlow, car wall art, glowing car poster',
  name = 'WheelsGlow',
  type = 'website',
  image = 'https://www.wheelsglow.store/og-image.jpg',
  url = 'https://www.wheelsglow.store',
  canonical,
  robots = 'index, follow',
  product,
}: SEOProps) {
  const productJsonLd = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: { '@type': 'Brand', name: product.brand || 'WheelsGlow' },
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'INR',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      url: canonical || url,
      seller: { '@type': 'Organization', name: 'WheelsGlow' },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
    },
  } : null;

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical || url} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:creator" content={name} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Product structured data */}
      {productJsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(productJsonLd)}
        </script>
      )}
    </Helmet>
  );
}
