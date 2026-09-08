// Datos centrales de la empresa para SEO / datos estructurados.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syemape.com";

export const COMPANY = {
  legalName: "S&E MAPE E.I.R.L.",
  brand: "MAPE",
  slogan: "Supervisión & Emergencias",
  description:
    "Empresa peruana de transporte y servicios especializados: alquiler de vehículos livianos y pesados, transporte de carga a nivel nacional (incluye MATPEL y carga sobredimensionada), supervisión, escolta y resguardo en ruta para minería, construcción e industria.",
  phone: "+51 990 297 657",
  email: "se.mape.eirl@gmail.com",
  country: "PE",
  logo: `${SITE_URL}/mape-logo.svg`,
  ogImage: `${SITE_URL}/og-image.png`,
} as const;

export const KEYWORDS = [
  "MAPE",
  "S&E MAPE",
  "transporte de carga Perú",
  "escolta en ruta",
  "supervisión de rutas",
  "alquiler de camionetas 4x4",
  "alquiler de vehículos pesados",
  "transporte MATPEL",
  "carga sobredimensionada",
  "transporte minería",
  "resguardo de carga",
  "camión grúa",
  "tractocamiones",
  "seguridad vial industrial",
  "monitoreo GPS de flota",
];

// JSON-LD: Organization + LocalBusiness + WebSite en un solo grafo.
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${SITE_URL}/#organization`,
        name: COMPANY.legalName,
        alternateName: [COMPANY.brand, `${COMPANY.brand} ${COMPANY.slogan}`],
        slogan: COMPANY.slogan,
        description: COMPANY.description,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: COMPANY.logo },
        image: COMPANY.ogImage,
        telephone: COMPANY.phone,
        email: COMPANY.email,
        address: {
          "@type": "PostalAddress",
          addressRegion: "Arequipa",
          addressCountry: COMPANY.country,
        },
        areaServed: { "@type": "Country", name: "Perú" },
        knowsLanguage: "es",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: COMPANY.phone,
          email: COMPANY.email,
          contactType: "customer service",
          availableLanguage: "es",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Servicios MAPE",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Alquiler de vehículos livianos y pesados",
                description:
                  "Camionetas 4x4 para operaciones mineras y flota pesada: tractocamiones, camiones grúa y unidades especiales.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Transporte terrestre de carga",
                description:
                  "Transporte de mercancías a nivel nacional, materiales peligrosos (MATPEL) y carga sobredimensionada.",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Supervisión, escolta y resguardo en ruta",
                description:
                  "Supervisión de rutas, escolta de carga sobredimensionada y resguardo con monitoreo GPS.",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${COMPANY.brand} | ${COMPANY.slogan}`,
        inLanguage: "es-PE",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
