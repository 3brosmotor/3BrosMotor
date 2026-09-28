import './globals.css';
import { Inter } from 'next/font/google';
import ClientErrorHandler from './components/ClientErrorHandler';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = process.env.APP_URL || 'https://3brosmotor.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: '3BrosMotor - Quality Cars • Better Journeys | Best Car Dealership in Tanzania',
    template: '%s | 3BrosMotor Tanzania',
  },
  description: '3BrosMotor - Quality Cars • Better Journeys. Premier car dealership in Mwanza & Dar es Salaam, Tanzania. Premium Japanese imports, Toyota Land Cruiser, Prado, Hilux, Harrier, commercial trucks & genuine spares.',
  applicationName: '3BrosMotor',
  keywords: [
    '3BrosMotor',
    '3BrosMotor LTD',
    '3 Bros Motors Tanzania',
    'Car dealership Mwanza',
    'Car dealership Dar es Salaam',
    'Magari Tanzania',
    'Magari Mwanza',
    'Japanese used cars Tanzania',
    'Toyota Land Cruiser Prado Tanzania',
    'Toyota Hilux Tanzania',
    'Toyota Harrier Tanzania',
    'Toyota RAV4 Tanzania',
    'Car importer Tanzania',
    'Used cars for sale Mwanza',
    'Used cars for sale Dar es Salaam',
    'USS Japan auto auction Tanzania',
    'Quality cars better journeys',
    'Best car yard Mwanza',
    'Cheap cars Tanzania',
    'Clearing and forwarding cars Dar es Salaam'
  ],
  authors: [{ name: '3BrosMotor Limited', url: siteUrl }],
  creator: '3BrosMotor Limited',
  publisher: '3BrosMotor Limited',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-TZ': '/',
      'sw-TZ': '/',
      'en': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_TZ',
    alternateLocale: ['sw_TZ', 'en_US'],
    url: siteUrl,
    siteName: '3BrosMotor',
    title: '3BrosMotor - Quality Cars • Better Journeys | Premier Car Dealership in Tanzania',
    description: 'Explore quality cars, SUVs, pickups, and trucks at 3BrosMotor. Top Japanese imports, direct USS auction sourcing, best prices in Mwanza & Dar es Salaam, Tanzania.',
    images: [
      {
        url: '/Slide_1.1.jpg',
        width: 1200,
        height: 630,
        alt: '3BrosMotor - Quality Cars • Better Journeys Dealership Showroom',
      },
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: '3BrosMotor Official Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3BrosMotor - Quality Cars • Better Journeys | Best Car Dealership in Tanzania',
    description: 'Explore quality cars, SUVs, pickups, and trucks at 3BrosMotor. Top Japanese imports, best prices in Mwanza & Dar es Salaam, Tanzania.',
    images: ['/Slide_1.1.jpg'],
    creator: '@3brosmotors',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  category: 'Automotive',
};

// JSON-LD Structured Data for Local Automotive Dealership
const dealershipSchema = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${siteUrl}/#dealer`,
  name: '3BROS MOTOR',
  alternateName: ['3BrosMotor LTD', '3 Bros Motors Tanzania'],
  legalName: '3BrosMotor Limited',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/Slide_1.1.jpg`,
  description: 'Premier automotive dealership in Tanzania offering premium Japanese imports, commercial trucks, SUVs, and passenger vehicles with direct shipping and clearing in Mwanza and Dar es Salaam.',
  telephone: ['+255787222222', '+255693100680'],
  email: '3brosmotor@gmail.com',
  priceRange: '$$ - $$$$',
  currenciesAccepted: 'USD, TZS',
  paymentAccepted: 'Cash, Bank Transfer, Tigo Pesa, M-Pesa, Airtel Money, Letter of Credit',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Mwanza Showroom Yard / Dar es Salaam Port Office',
    addressLocality: 'Mwanza',
    addressRegion: 'Mwanza',
    postalCode: '33000',
    addressCountry: 'TZ',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -2.5164,
    longitude: 32.9175,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '10:00',
      closes: '16:00',
    },
  ],
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Mwanza' },
    { '@type': 'AdministrativeArea', name: 'Dar es Salaam' },
    { '@type': 'AdministrativeArea', name: 'Arusha' },
    { '@type': 'AdministrativeArea', name: 'Dodoma' },
    { '@type': 'AdministrativeArea', name: 'Geita' },
    { '@type': 'AdministrativeArea', name: 'Shinyanga' },
    { '@type': 'Country', name: 'Tanzania' },
  ],
  sameAs: [
    'https://www.facebook.com/share/1GVqDFgtyN/?mibextid=wwXIfr',
    'https://www.instagram.com/3_bros_motors?stkn=NDZzbHJmNzg4eWUx&utm_source=qr',
    'https://www.linkedin.com/in/3-bros-motors-a44171439/',
    'https://www.tiktok.com/@3brosmotors?_r=1&_t=ZS-99yC80uxRvp',
  ],
};

// JSON-LD WebSite Schema with SearchAction
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: '3BrosMotor',
  description: 'Quality Cars • Better Journeys - Tanzania Leading Car Dealership & Japanese Vehicle Importer',
  publisher: {
    '@id': `${siteUrl}/#dealer`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

// JSON-LD FAQPage Schema for Google Rich Snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Why should I buy a car from 3BrosMotor in Tanzania?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '3BrosMotor provides authentic Grade 4+ Japanese imported vehicles directly sourced from USS auctions, with complete mechanical inspections, transparent pricing with no hidden clearing fees, and physical showroom inspection yards in Mwanza and Dar es Salaam.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can 3BrosMotor deliver vehicles across Tanzania outside Mwanza?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We arrange safe door-to-door carrier delivery to Dar es Salaam, Dodoma, Arusha, Geita, Shinyanga, Tabora, and all regions across Tanzania and neighboring East African countries.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I import a vehicle from Japan through 3BrosMotor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply reach out via WhatsApp at +255 787 222 222 or +255 693 100 680 with your preferred make, model, and budget. Our team will source auction units, bid on your behalf, handle shipping from Japan to Dar es Salaam port, and complete customs clearance for you.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods does 3BrosMotor accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept bank wire transfers (USD / TZS), cash deposits at our dealership office, mobile money (M-Pesa, Tigo Pesa, Airtel Money), and verified vehicle trade-ins.',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(dealershipSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Global Error Handler Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isIgnorable(e) {
                  if (!e) return false;
                  var msg = (e.message || String(e)).toLowerCase();
                  var name = (e.name || '').toLowerCase();
                  return name === 'aborterror' || e.code === 20 || e.code === 'permission-denied' ||
                    msg.indexOf('abort') !== -1 || msg.indexOf('the user aborted a request') !== -1 ||
                    msg.indexOf('insufficient permissions') !== -1 || msg.indexOf('missing or insufficient permissions') !== -1;
                }
                window.addEventListener('unhandledrejection', function(event) {
                  if (isIgnorable(event.reason)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
                window.addEventListener('error', function(event) {
                  if (isIgnorable(event.error) || isIgnorable(event.message)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return false;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-white antialiased`} suppressHydrationWarning>
        <ClientErrorHandler />
        {children}
      </body>
    </html>
  );
}
