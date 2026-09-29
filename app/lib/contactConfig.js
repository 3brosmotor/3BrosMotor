/**
 * Dealership Contact Configuration
 * Centralized contact lines, WhatsApp handlers, and business location information
 */

export const PRIMARY_PHONE = {
  id: 'phone1',
  label: 'Phone Line 1',
  badge: 'Sales & Inquiries',
  display: '+255 671 361 160',
  clean: '255671361160',
  tel: 'tel:+255671361160',
  whatsappUrl: 'https://wa.me/255671361160',
};

export const SECONDARY_PHONE = {
  id: 'phone2',
  label: 'Phone Line 2',
  badge: 'Support & Orders',
  display: '+255 693 100 680',
  clean: '255693100680',
  tel: 'tel:+255693100680',
  whatsappUrl: 'https://wa.me/255693100680',
};

export const CONTACT_LINES = [PRIMARY_PHONE, SECONDARY_PHONE];

export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    name: 'Facebook',
    short: 'f',
    url: 'https://www.facebook.com/share/1GVqDFgtyN/?mibextid=wwXIfr',
    color: '#1877F2',
    hoverBg: 'hover:bg-[#1877F2] hover:text-white',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    short: 'ig',
    url: 'https://www.instagram.com/3_bros_motors?stkn=NDZzbHJmNzg4eWUx&utm_source=qr',
    color: '#E4405F',
    hoverBg: 'hover:bg-[#E4405F] hover:text-white',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    short: 'in',
    url: 'https://www.linkedin.com/in/3-bros-motors-a44171439/',
    color: '#0A66C2',
    hoverBg: 'hover:bg-[#0A66C2] hover:text-white',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    short: 'tt',
    url: 'https://www.tiktok.com/@3brosmotors?_r=1&_t=ZS-99yC80uxRvp',
    color: '#000000',
    hoverBg: 'hover:bg-black hover:text-white',
  }
];

export const DEALERSHIP_INFO = {
  name: '3BROS MOTOR',
  tagline: 'Quality Cars • Better Journeys',
  address: 'Dar es Salaam, Tanzania',
  city: 'Dar es Salaam, Tanzania',
  email: '3brosmotor@gmail.com',
  workingHours: [
    { days: 'Monday – Saturday', hours: '8:00 AM – 6:30 PM' },
    { days: 'Sunday', hours: '10:00 AM – 4:00 PM' }
  ],
  mapsSearchUrl: 'https://www.google.com/maps/search/?api=1&query=Dar+es+Salaam+Tanzania',
};

/**
 * Generate a WhatsApp chat URL for a specific phone number and pre-filled message
 */
export function buildWhatsAppLink(cleanNumber, message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

/**
 * Build structured WhatsApp inquiry message for a vehicle
 */
export function buildVehicleInquiryMessage(car) {
  return [
    `🚗 *3BROSMOTOR VEHICLE INQUIRY*`,
    `----------------------------------------`,
    `• *Stock #:* ${car.id || 'N/A'}`,
    `• *Vehicle:* ${car.year} ${car.make} ${car.model}`,
    `• *Chassis:* ${car.chassis || 'N/A'}`,
    `• *Engine / Fuel:* ${car.engine || ''} • ${car.fuel || ''}`,
    `• *Location:* ${car.location || 'Dar es Salaam'}`,
    `----------------------------------------`,
    `Hello 3BrosMotor, I am interested in this vehicle. Is it still available and can you share more details?`
  ].join('\n');
}

/**
 * Build structured WhatsApp message for contact form submissions
 */
export function buildContactFormMessage({ name, phone, email, inquiryType, vehicleModel, message }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const lines = [
    `📩 *NEW CLIENT INQUIRY (WEBSITE)*`,
    `----------------------------------------`,
    `👤 *Client Name:* ${name}`,
    `📞 *Client Phone / WhatsApp:* ${phone}`,
  ];

  if (email && email.trim()) {
    lines.push(`✉️ *Email:* ${email.trim()}`);
  }

  if (inquiryType) {
    lines.push(`🎯 *Inquiry Type:* ${inquiryType}`);
  }

  if (vehicleModel && vehicleModel.trim()) {
    lines.push(`🚘 *Vehicle / Stock of Interest:* ${vehicleModel.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`📝 *Message / Requirements:*`);
  lines.push(message);
  lines.push(`----------------------------------------`);
  lines.push(`📅 *Sent:* ${dateStr}`);
  lines.push(`📍 *Source:* 3BrosMotor Official Website Form`);

  return lines.join('\n');
}
