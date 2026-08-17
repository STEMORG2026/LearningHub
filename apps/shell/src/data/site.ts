export interface NavLink {
  href: string;
  label: string;
  key: string;
}

export interface ContactInfo {
  phone: string;
  phoneHref: string;
  email: string;
  whatsapp: string;
  whatsappText: string;
  location: string;
  locationDetail: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: 'index.html', label: 'Home', key: 'home' },
  { href: 'classes.html', label: 'Classes', key: 'classes' },
  { href: 'learn.html', label: 'Learn Physics', key: 'learn' },
  { href: 'videos.html', label: 'Videos & Notes', key: 'videos' },
  { href: 'contact.html', label: 'Contact', key: 'contact' },
];

export const SITE_CONTACT: ContactInfo = {
  phone: '+977 9768021317',
  phoneHref: 'tel:+9779768021317',
  email: 'gurungsajan0228@gmail.com',
  whatsapp: 'https://wa.me/9779768021317',
  whatsappText: 'https://wa.me/9779768021317?text=Hi%20STEM%20Tuition%20Pokhara!%20I%20would%20like%20to%20inquire%20about%20classes.',
  location: 'Pokhara, Nepal',
  locationDetail: 'Home Tuition & Group Batches',
};

export function buildWhatsAppLink(message: string): string {
  return `https://wa.me/9779768021317?text=${encodeURIComponent(message)}`;
}
