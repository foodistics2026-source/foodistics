/**
 * JSON-LD Product Schema Template
 * Use this template for individual product pages to enable product rich snippets
 * 
 * Place in the <head> of product pages with actual product data
 */

export const productSchemaTemplate = (product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  sku?: string;
}) => {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description,
    "sku": product.sku || product.name.toLowerCase().replace(/\s+/g, "-"),
    "brand": {
      "@type": "Brand",
      "name": "Foodistics × Swach Tea"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://foodistics.com/shop`,
      "priceCurrency": product.currency,
      "price": product.price.toString(),
      "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.toString(),
        "reviewCount": product.reviewCount?.toString() || "0"
      }
    })
  };
};

/**
 * Example JSON-LD for individual products:
 * 
 * <script type="application/ld+json">
 * {
 *   "@context": "https://schema.org/",
 *   "@type": "Product",
 *   "name": "Premium Assam Black Tea",
 *   "image": "https://foodistics.com/tea-assam.jpg",
 *   "description": "Handpicked premium Assam black tea with rich, malty flavor from India's finest gardens",
 *   "sku": "assam-black-tea",
 *   "brand": {
 *     "@type": "Brand",
 *     "name": "Foodistics × Swach Tea"
 *   },
 *   "offers": {
 *     "@type": "Offer",
 *     "url": "https://foodistics.com/shop",
 *     "priceCurrency": "INR",
 *     "price": "499",
 *     "availability": "https://schema.org/InStock"
 *   },
 *   "aggregateRating": {
 *     "@type": "AggregateRating",
 *     "ratingValue": "4.8",
 *     "reviewCount": "156"
 *   }
 * }
 * </script>
 */

/**
 * FAQPage Schema Template
 * Use for FAQ sections
 */
export const faqSchemaTemplate = (faqs: Array<{
  question: string;
  answer: string;
}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Review/Testimonial Schema Template
 * Use for customer testimonials
 */
export const testimonialSchemaTemplate = (testimonial: {
  author: string;
  rating: number;
  text: string;
  date: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": testimonial.author
    },
    "datePublished": testimonial.date,
    "description": testimonial.text,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": testimonial.rating.toString()
    }
  };
};

/**
 * Event Schema Template
 * Use for promotional events, tea tasting events, etc.
 */
export const eventSchemaTemplate = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  image?: string;
  offer?: {
    price: number;
    currency: string;
  };
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.name,
    "description": event.description,
    "image": event.image,
    "startDate": event.startDate,
    ...(event.endDate && { "endDate": event.endDate }),
    ...(event.location && {
      "location": {
        "@type": "VirtualLocation",
        "url": "https://foodistics.com"
      }
    }),
    ...(event.offer && {
      "offers": {
        "@type": "Offer",
        "url": "https://foodistics.com",
        "price": event.offer.price.toString(),
        "priceCurrency": event.offer.currency,
        "availability": "https://schema.org/InStock"
      }
    })
  };
};

/**
 * ArticleSchema Template
 * Use for blog posts about tea
 */
export const articleSchemaTemplate = (article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  articleBody: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.headline,
    "description": article.description,
    "image": article.image,
    "datePublished": article.datePublished,
    ...(article.dateModified && { "dateModified": article.dateModified }),
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Foodistics × Swach Tea",
      "logo": {
        "@type": "ImageObject",
        "url": "https://foodistics.com/favicon.ico"
      }
    },
    "articleBody": article.articleBody
  };
};

export default {
  productSchemaTemplate,
  faqSchemaTemplate,
  testimonialSchemaTemplate,
  eventSchemaTemplate,
  articleSchemaTemplate
};
