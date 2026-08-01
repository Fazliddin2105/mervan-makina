import { useEffect } from 'react';
import type { PageType, Product } from '../types';

/**
 * Head management for a client-rendered site.
 *
 * Nothing here changes what a visitor sees. It exists so that a crawler, or a
 * messenger generating a link preview, is told which URL a view represents and
 * what it contains — a single-page app serves one HTML file for every route,
 * so without this every page reports itself as the homepage.
 *
 * TODO: `SITE_URL` is the deploy host. Point it at the real domain when one is
 * connected; public/sitemap.xml, public/robots.txt and index.html carry it too.
 */
export const SITE_URL = 'https://cleancore-industrial-equipment.vercel.app';

/** The route each page renders at, mirroring getPageFromPath in AppContext. */
export const PAGE_PATH: Partial<Record<PageType, string>> = {
  home: '/',
  products: '/products',
  services: '/services',
  about: '/about',
  blog: '/blog',
  contact: '/contact',
  faq: '/faq',
  cart: '/cart',
  compare: '/compare',
  wishlist: '/wishlist'
};

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

/**
 * Keeps <link rel="canonical"> and og:url pointing at the current view.
 *
 * Views without their own public URL — checkout, dashboards, the admin panel,
 * a product detail reached by state — fall back to the site root rather than
 * inventing an address that would 404 for anyone following it.
 */
export function useCanonical(activePage: PageType) {
  useEffect(() => {
    const path = PAGE_PATH[activePage] ?? '/';
    const url = SITE_URL + path;
    upsertLink('canonical', url);
    upsertMeta('property', 'og:url', url);
  }, [activePage]);
}

const PRODUCT_SCHEMA_ID = 'ld-product';

/**
 * Publishes Product + Offer for the machine currently on screen, and removes it
 * again on unmount so a stale product never lingers on another view.
 *
 * Prices are stored as USD and converted for display, so the offer is
 * published in USD — stating a so'm figure that the page might render
 * differently would be worse than stating none.
 */
export function useProductSchema(product: Product | undefined) {
  useEffect(() => {
    if (!product) return;

    const images = product.images.map(src => (src.startsWith('http') ? src : SITE_URL + src));

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      sku: product.model,
      image: images,
      description: product.description,
      brand: { '@type': 'Brand', name: product.brand },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.priceUSD.toFixed(2),
        availability: product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/PreOrder',
        seller: { '@id': `${SITE_URL}/#organization` }
      },
      additionalProperty: product.specs.slice(0, 12).map(s => ({
        '@type': 'PropertyValue',
        name: s.label,
        value: s.value
      }))
    };

    let el = document.getElementById(PRODUCT_SCHEMA_ID);
    if (!el) {
      el = document.createElement('script');
      el.id = PRODUCT_SCHEMA_ID;
      (el as HTMLScriptElement).type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(schema);

    return () => {
      document.getElementById(PRODUCT_SCHEMA_ID)?.remove();
    };
  }, [product]);
}
