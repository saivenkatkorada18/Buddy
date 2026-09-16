import React from 'react';
import { Category } from '../../types';
import { cn } from '../../lib/utils';

interface ItemArtworkProps {
  category: Category;
  seed?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

type ArtworkType =
  | 'power-bank'
  | 'pendrive'
  | 'cable-c2c'
  | 'keyboard'
  | 'mouse'
  | 'usb-hub'
  | 'speaker'
  | 'webcam'
  | 'earbuds'
  | 'power-strip'
  | 'wifi-router'
  | 'laptop'
  | 'tablet'
  | 'kindle'
  | 'headphones'
  | 'voice-recorder'
  | 'portable-monitor'
  | 'upsc-book'
  | 'yearbook'
  | 'atlas'
  | 'newspaper'
  | 'encyclopedia'
  | 'microcontroller'
  | 'soldering-iron'
  | 'gimbal'
  | 'clicker'
  | 'multimeter'
  | 'label-maker'
  | 'calculator'
  | 'lab-coat'
  | 'charger'
  | 'umbrella'
  | 'sports-tennis'
  | 'sports-basketball'
  | 'sports-badminton'
  | 'sports-football'
  | 'sports-cricket'
  | 'sports-yoga'
  | 'sports-general'
  | 'tools-screwdriver'
  | 'tools-meter'
  | 'tools-general'
  | 'kitchen-kettle'
  | 'kitchen-coffee'
  | 'kitchen-general'
  | 'stationery-pen'
  | 'stationery-notebook'
  | 'stationery-general'
  | 'decor-plant'
  | 'decor-lamp'
  | 'decor-general'
  | 'books-general';

function detectArtworkType(category: Category, seed: string, name?: string): ArtworkType {
  const combined = `${seed} ${name || ''} ${category}`.toLowerCase();

  // 1. Pen Drives, Flash Drives & External SSDs
  if (
    combined.includes('pen drive') ||
    combined.includes('pendrive') ||
    combined.includes('flash drive') ||
    combined.includes('thumb drive') ||
    combined.includes('portable ssd') ||
    combined.includes('sandisk') ||
    combined.includes('datatraveler') ||
    combined.includes('samsung t7')
  ) {
    return 'pendrive';
  }

  // 2. Type-C to Type-C Cables & Thunderbolt Cables
  if (
    combined.includes('c to c') ||
    combined.includes('type-c to type-c') ||
    combined.includes('type c to c') ||
    combined.includes('usb-c to usb-c') ||
    combined.includes('thunderbolt') ||
    combined.includes('c-to-c') ||
    combined.includes('charging cable') ||
    combined.includes('braided cable')
  ) {
    return 'cable-c2c';
  }

  // 3. Mechanical & Wireless Keyboards
  if (combined.includes('keyboard') || combined.includes('keychron')) {
    return 'keyboard';
  }

  // 4. Ergonomic & Wireless Mice
  if (combined.includes('mouse') || combined.includes('mx master')) {
    return 'mouse';
  }

  // 5. USB-C Hubs, Docks & Multiport Adapters
  if (
    combined.includes('usb-c hub') ||
    combined.includes('multiport') ||
    combined.includes('dongle') ||
    combined.includes('docking station')
  ) {
    return 'usb-hub';
  }

  // 6. Bluetooth Speakers
  if (combined.includes('speaker') || combined.includes('jbl') || combined.includes('bluetooth speaker')) {
    return 'speaker';
  }

  // 7. Webcams & Stream Cams
  if (combined.includes('webcam') || combined.includes('brio') || combined.includes('streamcam')) {
    return 'webcam';
  }

  // 8. Wireless Earbuds & TWS
  if (combined.includes('earbuds') || combined.includes('airpods') || combined.includes('galaxy buds')) {
    return 'earbuds';
  }

  // 9. Power Strips & Extension Boards
  if (
    combined.includes('extension board') ||
    combined.includes('power strip') ||
    combined.includes('surge protector') ||
    combined.includes('spike strip')
  ) {
    return 'power-strip';
  }

  // 10. Portable Wi-Fi Routers / Hotspots
  if (
    combined.includes('wifi router') ||
    combined.includes('hotspot') ||
    combined.includes('travel router') ||
    combined.includes('tp-link m7350')
  ) {
    return 'wifi-router';
  }

  // 11. Power Banks (specific)
  if (
    combined.includes('power bank') ||
    combined.includes('powerbank') ||
    combined.includes('pbank') ||
    combined.includes('anker-737') ||
    combined.includes('mi-30000') ||
    combined.includes('baseus-blade') ||
    combined.includes('magsafe')
  ) {
    return 'power-bank';
  }

  // 2. Laptops & Notebook Computers
  if (
    combined.includes('macbook') ||
    combined.includes('thinkpad') ||
    combined.includes('dell-xps') ||
    combined.includes('laptop') ||
    combined.includes('ultrabook') ||
    combined.includes('zenbook')
  ) {
    return 'laptop';
  }

  // 3. Tablets, iPads & Drawing Pen Displays
  if (
    combined.includes('ipad') ||
    combined.includes('wacom') ||
    combined.includes('apple pencil') ||
    combined.includes('pen display') ||
    combined.includes('drawing tablet')
  ) {
    return 'tablet';
  }

  // 4. Kindle & E-Readers
  if (combined.includes('kindle') || combined.includes('e-reader') || combined.includes('e-ink')) {
    return 'kindle';
  }

  // 5. Noise Cancelling Headphones
  if (combined.includes('headphone') || combined.includes('sony-xm4') || combined.includes('wh-1000xm4')) {
    return 'headphones';
  }

  // 6. Voice & Audio Recorders
  if (combined.includes('recorder') || combined.includes('zoom-h1n') || combined.includes('voice recorder')) {
    return 'voice-recorder';
  }

  // 7. Portable USB-C Monitors
  if (combined.includes('portable monitor') || combined.includes('zenscreen') || combined.includes('dual monitor')) {
    return 'portable-monitor';
  }

  // 8. Encyclopedias & Thick Handbooks
  if (
    combined.includes('encyclopedia') ||
    combined.includes('encyclopaedia') ||
    combined.includes('crc-handbook') ||
    combined.includes('medical dictionary') ||
    combined.includes('dk-world-hist') ||
    combined.includes('handbook of chemistry')
  ) {
    return 'encyclopedia';
  }

  // 9. Newspapers & Editorial Compendiums / Dossiers
  if (
    combined.includes('hindu-editorial') ||
    combined.includes('express-explained') ||
    combined.includes('yojana') ||
    combined.includes('compendium') ||
    combined.includes('dossier') ||
    combined.includes('editorial') ||
    combined.includes('newspaper') ||
    combined.includes('kurukshetra')
  ) {
    return 'newspaper';
  }

  // 10. Atlases
  if (combined.includes('atlas') || combined.includes('maps')) {
    return 'atlas';
  }

  // 11. General Knowledge & Yearbooks
  if (
    combined.includes('yearbook') ||
    combined.includes('general knowledge') ||
    combined.includes('lucent') ||
    combined.includes('manorama') ||
    combined.includes('arihant')
  ) {
    return 'yearbook';
  }

  // 12. UPSC Preparation Books
  if (
    combined.includes('upsc') ||
    combined.includes('polity') ||
    combined.includes('laxmikanth') ||
    combined.includes('spectrum') ||
    combined.includes('rajiv ahir') ||
    combined.includes('nitin singhania') ||
    combined.includes('art and culture') ||
    combined.includes('gc-leong') ||
    combined.includes('shankar') ||
    combined.includes('csat') ||
    combined.includes('ias prelims')
  ) {
    return 'upsc-book';
  }

  // 13. Microcontrollers & Robotics Kits (Arduino / Raspberry Pi)
  if (
    combined.includes('arduino') ||
    combined.includes('raspberry pi') ||
    combined.includes('raspi') ||
    combined.includes('robotics') ||
    combined.includes('sensor kit')
  ) {
    return 'microcontroller';
  }

  // 14. Soldering Irons
  if (combined.includes('soldering') || combined.includes('ts100') || combined.includes('rework')) {
    return 'soldering-iron';
  }

  // 15. Smartphone Gimbals
  if (combined.includes('gimbal') || combined.includes('dji') || combined.includes('stabilizer')) {
    return 'gimbal';
  }

  // 16. Presentation Clickers
  if (combined.includes('clicker') || combined.includes('presentation remote') || combined.includes('spotlight')) {
    return 'clicker';
  }

  // 17. Digital Multimeters
  if (combined.includes('multimeter') || combined.includes('meter-1') || combined.includes('true-rms')) {
    return 'multimeter';
  }

  // 18. Label Makers
  if (combined.includes('label maker') || combined.includes('label printer') || combined.includes('p-touch')) {
    return 'label-maker';
  }

  // 19. Sports Specific
  if (category === 'sports') {
    if (combined.includes('tennis') || combined.includes('racket')) return 'sports-tennis';
    if (combined.includes('badminton') || combined.includes('shuttlecock')) return 'sports-badminton';
    if (combined.includes('basketball')) return 'sports-basketball';
    if (combined.includes('football') || combined.includes('soccer')) return 'sports-football';
    if (combined.includes('cricket')) return 'sports-cricket';
    if (combined.includes('yoga') || combined.includes('mat')) return 'sports-yoga';
    return 'sports-general';
  }

  // 20. Tools Specific
  if (category === 'tools') {
    if (combined.includes('screwdriver') || combined.includes('hex') || combined.includes('driver')) return 'tools-screwdriver';
    return 'tools-general';
  }

  // 21. Kitchen Specific
  if (category === 'kitchen') {
    if (combined.includes('kettle')) return 'kitchen-kettle';
    if (combined.includes('coffee') || combined.includes('french press')) return 'kitchen-coffee';
    return 'kitchen-general';
  }

  // 22. Stationery Specific
  if (category === 'stationery') {
    if (combined.includes('pen') || combined.includes('highlighter')) return 'stationery-pen';
    if (combined.includes('notebook') || combined.includes('journal')) return 'stationery-notebook';
    return 'stationery-general';
  }

  // 23. Decor Specific
  if (category === 'decor') {
    if (combined.includes('plant') || combined.includes('succulent')) return 'decor-plant';
    if (combined.includes('lamp') || combined.includes('light')) return 'decor-lamp';
    return 'decor-general';
  }

  // Standard category fallbacks
  if (category === 'calculators') return 'calculator';
  if (category === 'lab-coats') return 'lab-coat';
  if (category === 'chargers') return 'charger';
  if (category === 'umbrellas') return 'umbrella';
  if (category === 'books') return 'books-general';

  return 'books-general';
}

export const ItemArtwork: React.FC<ItemArtworkProps> = ({
  category,
  seed = 'default',
  name,
  size = 'md',
  className,
}) => {
  const hash = (seed + (name || '')).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rot = (hash % 5) - 2; // Subtle -2 to +2 degrees rotation for tactile feel

  const sizeStyles = {
    sm: 'w-16 h-16',
    md: 'w-full aspect-[4/3] max-h-56',
    lg: 'w-full aspect-[16/10]',
    hero: 'w-full aspect-[16/9]',
  };

  const artworkType = detectArtworkType(category, seed, name);

  const backgrounds: Record<Category, string> = {
    calculators: 'bg-gradient-to-br from-indigo-50/90 via-indigo-100/50 to-blue-50 text-indigo-700',
    'lab-coats': 'bg-gradient-to-br from-teal-50/90 via-teal-100/50 to-emerald-50 text-teal-700',
    chargers: 'bg-gradient-to-br from-amber-50/90 via-amber-100/50 to-orange-50 text-amber-700',
    books: 'bg-gradient-to-br from-stone-100/90 via-amber-50/60 to-orange-50 text-stone-700',
    umbrellas: 'bg-gradient-to-br from-blue-50/90 via-indigo-50 to-sky-100/60 text-blue-700',
    sports: 'bg-gradient-to-br from-emerald-50/90 via-teal-50 to-amber-50 text-emerald-700',
    tools: 'bg-gradient-to-br from-slate-100/90 via-zinc-100 to-stone-200/60 text-slate-700',
    kitchen: 'bg-gradient-to-br from-orange-50/90 via-amber-100/40 to-rose-50 text-orange-700',
    stationery: 'bg-gradient-to-br from-violet-50/90 via-purple-100/40 to-indigo-50 text-violet-700',
    decor: 'bg-gradient-to-br from-pink-50/90 via-rose-100/50 to-amber-50 text-rose-700',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl flex items-center justify-center select-none border border-line/50 transition-colors',
        backgrounds[category] || 'bg-indigo-50 text-indigo-700',
        sizeStyles[size],
        className
      )}
    >
      {/* Decorative Blueprint / Fine Dotted Grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`pattern-${category}-${hash}`} width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#pattern-${category}-${hash})`} />
      </svg>

      {/* Primary Vector Artwork with dynamic archetype dispatch */}
      <div
        className="relative z-10 w-3/4 h-3/4 max-w-[190px] max-h-[190px] flex items-center justify-center transition-transform duration-300 ease-out-soft group-hover:scale-105"
        style={{ transform: `rotate(${rot}deg)` }}
      >
        {/* 1. POWER BANK */}
        {artworkType === 'power-bank' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="16" width="52" height="88" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="28" y="20" width="44" height="80" rx="6" fill="#334155" />
            {/* Glossy Top Trim */}
            <rect x="28" y="20" width="44" height="26" rx="4" fill="#0F172A" />
            {/* Digital LED Display */}
            <rect x="36" y="25" width="28" height="14" rx="3" fill="#020617" stroke="#0EA5E9" strokeWidth="1" />
            <text x="50" y="35" fill="#38BDF8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">94%</text>
            <path d="M38 31 L41 27 H43 L42 30 H45 L41 36 L42 32 Z" fill="#F59E0B" />
            {/* Fast Charging Status Indicator */}
            <circle cx="68" cy="32" r="2" fill="#22C55E" />
            {/* Output Ports on top edge */}
            <rect x="34" y="12" width="8" height="4" rx="1" fill="#64748B" />
            <rect x="46" y="12" width="8" height="4" rx="1" fill="#0EA5E9" />
            <rect x="58" y="12" width="8" height="4" rx="1" fill="#64748B" />
            {/* Power Capacity Text */}
            <text x="50" y="70" fill="#94A3B8" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">24,000 mAh</text>
            <text x="50" y="80" fill="#64748B" fontSize="5" fontFamily="sans-serif" textAnchor="middle">140W FAST PD</text>
            {/* Tactile Grooves */}
            <line x1="34" y1="88" x2="66" y2="88" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="34" y1="92" x2="66" y2="92" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}

        {/* 1B. PEN DRIVE / FLASH DRIVE / PORTABLE SSD */}
        {artworkType === 'pendrive' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* USB-A / Type-C Metal Connector */}
            <rect x="38" y="14" width="24" height="20" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            <rect x="42" y="20" width="6" height="4" rx="0.5" fill="#0284C7" />
            <rect x="52" y="20" width="6" height="4" rx="0.5" fill="#0284C7" />
            {/* Sleek Metallic Body */}
            <rect x="30" y="32" width="40" height="66" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="34" y="36" width="32" height="58" rx="6" fill="#334155" />
            {/* Swivel / Slider Accent */}
            <rect x="30" y="42" width="40" height="24" rx="4" fill="#0EA5E9" />
            <text x="50" y="56" fill="#FFFFFF" fontSize="6.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">128 GB</text>
            <text x="50" y="62" fill="#E0F2FE" fontSize="4" fontFamily="sans-serif" textAnchor="middle">USB 3.2 Gen 2</text>
            {/* Activity Blue LED */}
            <circle cx="50" cy="76" r="2.5" fill="#38BDF8" />
            {/* Keyring / Lanyard Loop */}
            <circle cx="50" cy="88" r="4" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
          </svg>
        )}

        {/* 1C. TYPE-C TO TYPE-C CABLE */}
        {artworkType === 'cable-c2c' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Braided Coiled Loops */}
            <circle cx="50" cy="62" r="28" stroke="#334155" strokeWidth="7" fill="none" />
            <circle cx="50" cy="62" r="28" stroke="#64748B" strokeWidth="3" strokeDasharray="4 2" fill="none" />
            <circle cx="50" cy="62" r="18" stroke="#1E293B" strokeWidth="6" fill="none" />
            {/* Cable Tie Velcro */}
            <rect x="44" y="34" width="12" height="12" rx="2" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            <text x="50" y="42" fill="#78350F" fontSize="4.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">100W</text>
            {/* Type-C Connector Left */}
            <path d="M22 62 L16 38" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <rect x="10" y="24" width="12" height="16" rx="3" fill="#0F172A" stroke="#64748B" strokeWidth="1" transform="rotate(-15 16 32)" />
            <rect x="12" y="14" width="8" height="10" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" transform="rotate(-15 16 19)" />
            {/* Type-C Connector Right */}
            <path d="M78 62 L84 38" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <rect x="78" y="24" width="12" height="16" rx="3" fill="#0F172A" stroke="#64748B" strokeWidth="1" transform="rotate(15 84 32)" />
            <rect x="80" y="14" width="8" height="10" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" transform="rotate(15 84 19)" />
            {/* Lightning Fast Charge Label */}
            <rect x="34" y="86" width="32" height="6" rx="2" fill="#0F172A" />
            <text x="50" y="91" fill="#38BDF8" fontSize="4.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">240W E-MARKER</text>
          </svg>
        )}

        {/* 1D. MECHANICAL KEYBOARD */}
        {artworkType === 'keyboard' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="32" width="80" height="56" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="14" y="36" width="72" height="48" rx="4" fill="#0F172A" />
            {/* Keycap Rows with RGB Backlight glow */}
            {/* Row 1 */}
            <rect x="17" y="40" width="7" height="6" rx="1" fill="#EF4444" />
            <rect x="26" y="40" width="7" height="6" rx="1" fill="#334155" />
            <rect x="35" y="40" width="7" height="6" rx="1" fill="#334155" />
            <rect x="44" y="40" width="7" height="6" rx="1" fill="#334155" />
            <rect x="53" y="40" width="7" height="6" rx="1" fill="#334155" />
            <rect x="62" y="40" width="7" height="6" rx="1" fill="#334155" />
            <rect x="71" y="40" width="12" height="6" rx="1" fill="#6366F1" />
            {/* Row 2 */}
            <rect x="17" y="48" width="10" height="6" rx="1" fill="#334155" />
            <rect x="29" y="48" width="7" height="6" rx="1" fill="#38BDF8" />
            <rect x="38" y="48" width="7" height="6" rx="1" fill="#38BDF8" />
            <rect x="47" y="48" width="7" height="6" rx="1" fill="#38BDF8" />
            <rect x="56" y="48" width="7" height="6" rx="1" fill="#334155" />
            <rect x="65" y="48" width="7" height="6" rx="1" fill="#334155" />
            <rect x="74" y="48" width="9" height="6" rx="1" fill="#334155" />
            {/* Row 3 */}
            <rect x="17" y="56" width="12" height="6" rx="1" fill="#334155" />
            <rect x="31" y="56" width="7" height="6" rx="1" fill="#334155" />
            <rect x="40" y="56" width="7" height="6" rx="1" fill="#334155" />
            <rect x="49" y="56" width="7" height="6" rx="1" fill="#334155" />
            <rect x="58" y="56" width="7" height="6" rx="1" fill="#334155" />
            <rect x="67" y="56" width="16" height="6" rx="1" fill="#10B981" />
            {/* Row 4 (Spacebar & Arrows) */}
            <rect x="17" y="64" width="10" height="6" rx="1" fill="#334155" />
            <rect x="29" y="64" width="8" height="6" rx="1" fill="#334155" />
            <rect x="39" y="64" width="26" height="6" rx="1" fill="#F59E0B" />
            <rect x="67" y="64" width="7" height="6" rx="1" fill="#38BDF8" />
            <rect x="76" y="64" width="7" height="6" rx="1" fill="#38BDF8" />
          </svg>
        )}

        {/* 1E. ERGONOMIC WIRELESS MOUSE */}
        {artworkType === 'mouse' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M36 24 C54 18, 64 18, 70 30 C76 44, 76 80, 68 96 C56 102, 40 100, 32 90 C22 76, 20 42, 36 24 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            {/* Thumb Rest Wing */}
            <path d="M22 60 C12 70, 16 84, 32 90" fill="#334155" stroke="#0F172A" strokeWidth="2" />
            {/* Click Split Line & Metal Scroll Wheel */}
            <line x1="50" y1="20" x2="50" y2="48" stroke="#0F172A" strokeWidth="2" />
            <rect x="46" y="28" width="8" height="16" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            {/* Thumb Gesture Wheel */}
            <rect x="24" y="62" width="6" height="12" rx="2" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            {/* Dark Silicon Palm Grip */}
            <path d="M38 52 C50 48, 60 48, 66 56 C70 66, 68 84, 60 92 C50 96, 40 92, 36 84 Z" fill="#334155" />
            <circle cx="50" cy="74" r="2" fill="#22C55E" />
          </svg>
        )}

        {/* 1F. USB-C HUB & MULTIPORT DONGLE */}
        {artworkType === 'usb-hub' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Connecting Pigtail Cable */}
            <path d="M50 14 V34" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
            <rect x="44" y="8" width="12" height="10" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
            <rect x="46" y="2" width="8" height="6" rx="1.5" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            {/* Aluminum Hub Body */}
            <rect x="26" y="34" width="48" height="74" rx="8" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
            <rect x="30" y="38" width="40" height="66" rx="6" fill="#E2E8F0" />
            {/* Ports on Front / Sides */}
            <rect x="34" y="44" width="18" height="6" rx="1" fill="#0284C7" />
            <rect x="34" y="54" width="18" height="6" rx="1" fill="#0284C7" />
            <rect x="34" y="64" width="18" height="4" rx="1" fill="#334155" />
            <text x="60" y="49" fill="#0F172A" fontSize="4.5" fontFamily="sans-serif" fontWeight="bold">USB 3.0</text>
            <text x="60" y="59" fill="#0F172A" fontSize="4.5" fontFamily="sans-serif" fontWeight="bold">USB 3.0</text>
            <text x="60" y="68" fill="#0F172A" fontSize="4" fontFamily="sans-serif">100W PD</text>
            {/* HDMI & SD Slots */}
            <rect x="34" y="74" width="32" height="6" rx="1" fill="#1E293B" />
            <text x="50" y="79" fill="#FFFFFF" fontSize="4" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">4K 60Hz HDMI</text>
            <rect x="34" y="84" width="20" height="3" rx="0.5" fill="#64748B" />
            <rect x="34" y="90" width="14" height="2" rx="0.5" fill="#64748B" />
            {/* Power LED */}
            <circle cx="62" cy="88" r="2" fill="#22C55E" />
          </svg>
        )}

        {/* 1G. PORTABLE BLUETOOTH SPEAKER */}
        {artworkType === 'speaker' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cylindrical Body */}
            <rect x="22" y="24" width="56" height="72" rx="20" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            {/* Speaker Mesh Pattern */}
            <rect x="26" y="32" width="48" height="56" rx="16" fill="#334155" />
            {/* Bass Radiators on top/bottom */}
            <ellipse cx="50" cy="24" rx="16" ry="5" fill="#475569" stroke="#0F172A" strokeWidth="1.5" />
            <ellipse cx="50" cy="96" rx="16" ry="5" fill="#475569" stroke="#0F172A" strokeWidth="1.5" />
            {/* Brand / Logo Badge */}
            <rect x="40" y="52" width="20" height="16" rx="3" fill="#EF4444" />
            <text x="50" y="63" fill="#FFFFFF" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">JBL</text>
            {/* Controls (Play, +, -, Bluetooth) */}
            <circle cx="50" cy="40" r="3" fill="#38BDF8" />
            <path d="M49 38 L52 40 L49 42" stroke="#FFFFFF" strokeWidth="1" fill="none" />
            <circle cx="50" cy="80" r="3" fill="#94A3B8" />
          </svg>
        )}

        {/* 1H. 4K HD WEBCAM */}
        {artworkType === 'webcam' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Monitor Mount Clip */}
            <rect x="44" y="68" width="12" height="24" rx="2" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
            <path d="M40 92 L60 92 L64 104 L36 104 Z" fill="#334155" />
            {/* Camera Capsule */}
            <rect x="14" y="30" width="72" height="38" rx="12" fill="#0F172A" stroke="#1E293B" strokeWidth="2.5" />
            <rect x="18" y="34" width="64" height="30" rx="8" fill="#1E293B" />
            {/* Big Glass Camera Lens */}
            <circle cx="50" cy="49" r="14" fill="#020617" stroke="#334155" strokeWidth="2" />
            <circle cx="50" cy="49" r="10" fill="#1E1B4B" stroke="#38BDF8" strokeWidth="1" />
            <circle cx="50" cy="49" r="6" fill="#064E3B" />
            <circle cx="47" cy="46" r="2" fill="#FFFFFF" opacity="0.8" />
            {/* Dual Microphones & Indicator LED */}
            <circle cx="28" cy="49" r="2" fill="#475569" />
            <circle cx="72" cy="49" r="2" fill="#475569" />
            <circle cx="34" cy="49" r="1.5" fill="#22C55E" />
            <text x="50" y="61" fill="#64748B" fontSize="4" fontFamily="monospace" textAnchor="middle">4K ULTRA HD</text>
          </svg>
        )}

        {/* 1I. WIRELESS EARBUDS (TWS) */}
        {artworkType === 'earbuds' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Open Charging Case */}
            <rect x="22" y="44" width="56" height="52" rx="16" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            <line x1="22" y1="58" x2="78" y2="58" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Left Earbud */}
            <circle cx="38" cy="34" r="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="36" y="34" width="4" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="36" cy="34" r="2" fill="#334155" />
            {/* Right Earbud */}
            <circle cx="62" cy="34" r="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="60" y="34" width="4" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="64" cy="34" r="2" fill="#334155" />
            {/* Status LED & ANC Badge */}
            <circle cx="50" cy="74" r="2.5" fill="#22C55E" />
            <text x="50" y="86" fill="#64748B" fontSize="4.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">PRO ANC</text>
          </svg>
        )}

        {/* 1J. EXTENSION BOARD / SURGE PROTECTOR */}
        {artworkType === 'power-strip' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="32" y="12" width="36" height="96" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
            {/* Master Switch */}
            <rect x="42" y="18" width="16" height="10" rx="2" fill="#EF4444" />
            <circle cx="50" cy="23" r="1.5" fill="#FFFFFF" />
            {/* 3 Universal Sockets */}
            <circle cx="50" cy="38" r="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="48" cy="37" r="1" fill="#0F172A" />
            <circle cx="52" cy="37" r="1" fill="#0F172A" />
            <circle cx="50" cy="40" r="1.2" fill="#0F172A" />
            <circle cx="50" cy="56" r="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="48" cy="55" r="1" fill="#0F172A" />
            <circle cx="52" cy="55" r="1" fill="#0F172A" />
            <circle cx="50" cy="58" r="1.2" fill="#0F172A" />
            <circle cx="50" cy="74" r="6" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="48" cy="73" r="1" fill="#0F172A" />
            <circle cx="52" cy="73" r="1" fill="#0F172A" />
            <circle cx="50" cy="76" r="1.2" fill="#0F172A" />
            {/* 2 USB Fast Ports at bottom */}
            <rect x="42" y="88" width="6" height="4" rx="0.5" fill="#0284C7" />
            <rect x="52" y="88" width="6" height="4" rx="0.5" fill="#0284C7" />
            <text x="50" y="99" fill="#059669" fontSize="3.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">SURGE PROTECTED</text>
          </svg>
        )}

        {/* 1K. PORTABLE WI-FI ROUTER / HOTSPOT */}
        {artworkType === 'wifi-router' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="24" width="60" height="72" rx="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="24" y="28" width="52" height="64" rx="8" fill="#0F172A" />
            {/* OLED Status Screen */}
            <rect x="32" y="36" width="36" height="28" rx="4" fill="#020617" stroke="#38BDF8" strokeWidth="1" />
            {/* 4G / Wi-Fi Signal Bars */}
            <rect x="36" y="48" width="2" height="4" fill="#22C55E" />
            <rect x="40" y="46" width="2" height="6" fill="#22C55E" />
            <rect x="44" y="44" width="2" height="8" fill="#22C55E" />
            <rect x="48" y="42" width="2" height="10" fill="#22C55E" />
            <text x="58" y="46" fill="#38BDF8" fontSize="5" fontFamily="sans-serif" fontWeight="bold">5G</text>
            <text x="50" y="58" fill="#94A3B8" fontSize="4" fontFamily="monospace" textAnchor="middle">150 Mbps</text>
            {/* Wi-Fi Broadcast Arcs */}
            <path d="M42 74 C46 70, 54 70, 58 74" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M46 78 C48 76, 52 76, 54 78" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="82" r="1.5" fill="#38BDF8" />
          </svg>
        )}

        {/* 2. LAPTOP */}
        {artworkType === 'laptop' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Open Display Screen */}
            <rect x="18" y="22" width="64" height="46" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <rect x="22" y="26" width="56" height="38" rx="2" fill="#1E1B4B" />
            {/* IDE / Terminal Screen UI */}
            <circle cx="26" cy="30" r="1.5" fill="#EF4444" />
            <circle cx="30" cy="30" r="1.5" fill="#F59E0B" />
            <circle cx="34" cy="30" r="1.5" fill="#10B981" />
            <line x1="26" y1="36" x2="52" y2="36" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="26" y1="41" x2="68" y2="41" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="46" x2="60" y2="46" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="51" x2="48" y2="51" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="26" y1="56" x2="40" y2="56" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />
            {/* Laptop Base & Keyboard Deck */}
            <polygon points="10,88 90,88 82,68 18,68" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" />
            <polygon points="22,78 78,78 74,70 26,70" fill="#1E293B" />
            {/* Trackpad */}
            <rect x="42" y="80" width="16" height="6" rx="1" fill="#94A3B8" stroke="#64748B" strokeWidth="0.8" />
            {/* Front Lip / Notch */}
            <rect x="45" y="87" width="10" height="2" rx="0.5" fill="#64748B" />
          </svg>
        )}

        {/* 3. TABLET & STYLUS */}
        {artworkType === 'tablet' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="16" width="56" height="84" rx="6" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
            <rect x="24" y="20" width="48" height="76" rx="3" fill="#F8FAFC" />
            {/* Screen UI - Handwritten math & drawing */}
            <path d="M30 36 Q42 28 50 38 T64 34" stroke="#4F46E5" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M32 52 Q44 60 54 48 T62 60" stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
            <line x1="30" y1="70" x2="60" y2="70" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="78" x2="52" y2="78" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
            {/* Digital Stylus Pen */}
            <polygon points="78,28 82,24 86,28 82,32" fill="#E2E8F0" />
            <rect x="78" y="30" width="8" height="52" rx="2" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="1.2" />
            <polygon points="78,82 86,82 82,92" fill="#334155" />
            <circle cx="82" cy="40" r="1.5" fill="#6366F1" />
          </svg>
        )}

        {/* 4. KINDLE / E-READER */}
        {artworkType === 'kindle' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="16" width="60" height="88" rx="8" fill="#1C1917" stroke="#292524" strokeWidth="2.5" />
            <rect x="25" y="22" width="50" height="74" rx="3" fill="#F5F5F4" />
            {/* E-ink Text Lines */}
            <text x="30" y="34" fill="#292524" fontSize="6.5" fontFamily="serif" fontWeight="bold">CHAPTER 1</text>
            <line x1="30" y1="42" x2="70" y2="42" stroke="#57534E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="48" x2="70" y2="48" stroke="#57534E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="54" x2="66" y2="54" stroke="#57534E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="60" x2="70" y2="60" stroke="#57534E" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="30" y1="66" x2="58" y2="66" stroke="#57534E" strokeWidth="1.5" strokeLinecap="round" />
            {/* Reading progress bar */}
            <rect x="30" y="86" width="40" height="2" rx="1" fill="#D6D3D1" />
            <rect x="30" y="86" width="18" height="2" rx="1" fill="#44403C" />
            <text x="30" y="92" fill="#78716C" fontSize="4" fontFamily="sans-serif">Page 42 of 310 • 45%</text>
          </svg>
        )}

        {/* 5. HEADPHONES */}
        {artworkType === 'headphones' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Headband Arc */}
            <path d="M22 62 C22 28, 78 28, 78 62" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M26 56 C26 34, 74 34, 74 56" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Left Earcup */}
            <rect x="14" y="56" width="16" height="34" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <rect x="18" y="60" width="8" height="26" rx="4" fill="#1E293B" />
            {/* Right Earcup */}
            <rect x="70" y="56" width="16" height="34" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <rect x="74" y="60" width="8" height="26" rx="4" fill="#1E293B" />
            {/* Active Noise Cancellation Soundwave */}
            <path d="M42 66 Q46 58 50 66 T58 66" stroke="#38BDF8" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="50" y="82" fill="#0284C7" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">ANC ON</text>
          </svg>
        )}

        {/* 6. VOICE RECORDER */}
        {artworkType === 'voice-recorder' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Dual X/Y Microphones */}
            <rect x="36" y="10" width="12" height="16" rx="3" fill="#64748B" stroke="#334155" strokeWidth="1.5" transform="rotate(-25 42 18)" />
            <rect x="52" y="10" width="12" height="16" rx="3" fill="#64748B" stroke="#334155" strokeWidth="1.5" transform="rotate(25 58 18)" />
            {/* Body */}
            <rect x="28" y="24" width="44" height="84" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            {/* LCD Screen with Audio VU Meters */}
            <rect x="34" y="32" width="32" height="24" rx="3" fill="#020617" stroke="#0EA5E9" strokeWidth="1" />
            <rect x="38" y="38" width="4" height="12" fill="#22C55E" />
            <rect x="44" y="36" width="4" height="14" fill="#22C55E" />
            <rect x="50" y="34" width="4" height="16" fill="#F59E0B" />
            <rect x="56" y="38" width="4" height="12" fill="#EF4444" />
            {/* Big Red REC Button */}
            <circle cx="50" cy="70" r="10" fill="#EF4444" stroke="#DC2626" strokeWidth="2" />
            <circle cx="50" cy="70" r="4" fill="#FFFFFF" />
            {/* Nav controls */}
            <circle cx="38" cy="92" r="4" fill="#334155" />
            <circle cx="50" cy="92" r="4" fill="#334155" />
            <circle cx="62" cy="92" r="4" fill="#334155" />
          </svg>
        )}

        {/* 7. PORTABLE MONITOR */}
        {artworkType === 'portable-monitor' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="24" width="76" height="52" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <rect x="16" y="28" width="68" height="44" rx="2" fill="#1E1B4B" />
            {/* Split Screen Windows */}
            <rect x="20" y="32" width="28" height="36" rx="2" fill="#312E81" />
            <rect x="52" y="32" width="28" height="36" rx="2" fill="#064E3B" />
            <line x1="24" y1="38" x2="44" y2="38" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="24" y1="44" x2="40" y2="44" stroke="#A5B4FC" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="56" y1="38" x2="76" y2="38" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
            {/* Kickstand base */}
            <polygon points="20,86 80,86 74,76 26,76" fill="#475569" />
          </svg>
        )}

        {/* 8. UPSC STANDARD TEXTBOOK */}
        {artworkType === 'upsc-book' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="16" width="56" height="88" rx="4" fill="#1E3A8A" stroke="#172554" strokeWidth="2.5" />
            <rect x="26" y="20" width="48" height="80" rx="3" fill="#1E40AF" />
            {/* Book Spine Details */}
            <line x1="33" y1="16" x2="33" y2="104" stroke="#FBBF24" strokeWidth="2" />
            {/* Golden Emblem / Seal */}
            <circle cx="53" cy="46" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            {/* Ashok Pillar / Torch Emblem silhouette */}
            <path d="M53 38 L50 48 H56 L53 38 Z" fill="#D97706" />
            <circle cx="53" cy="50" r="3" fill="#D97706" />
            {/* UPSC Exam Title Badge */}
            <rect x="36" y="66" width="34" height="7" rx="1.5" fill="#FBBF24" />
            <text x="53" y="72" fill="#78350F" fontSize="5.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">CIVIL SERVICES</text>
            <rect x="40" y="77" width="26" height="4" rx="1" fill="#DBEAFE" />
            <rect x="42" y="84" width="22" height="3" rx="1" fill="#DBEAFE" />
            {/* Crimson Bookmark Ribbon */}
            <path d="M52 16 V32 L56 28 L60 32 V16" fill="#EF4444" />
          </svg>
        )}

        {/* 9. YEARBOOK & GK */}
        {artworkType === 'yearbook' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="16" width="60" height="88" rx="4" fill="#991B1B" stroke="#7F1D1D" strokeWidth="2.5" />
            <rect x="24" y="20" width="52" height="80" rx="3" fill="#B91C1C" />
            <line x1="31" y1="16" x2="31" y2="104" stroke="#FEF08A" strokeWidth="2" />
            {/* Globe Emblem */}
            <circle cx="52" cy="46" r="15" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
            <ellipse cx="52" cy="46" rx="15" ry="6" fill="none" stroke="#D97706" strokeWidth="1.2" />
            <line x1="52" y1="31" x2="52" y2="61" stroke="#D97706" strokeWidth="1.2" />
            {/* Year Tag */}
            <rect x="34" y="68" width="36" height="9" rx="2" fill="#FEF08A" />
            <text x="52" y="75" fill="#7F1D1D" fontSize="7" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">YEARBOOK 2025</text>
            <text x="52" y="85" fill="#FEF08A" fontSize="5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">GENERAL KNOWLEDGE</text>
            {/* Side Color Tab Index */}
            <rect x="76" y="28" width="4" height="8" rx="1" fill="#3B82F6" />
            <rect x="76" y="40" width="4" height="8" rx="1" fill="#10B981" />
            <rect x="76" y="52" width="4" height="8" rx="1" fill="#F59E0B" />
          </svg>
        )}

        {/* 10. ATLAS / MAPS */}
        {artworkType === 'atlas' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="16" width="64" height="88" rx="4" fill="#065F46" stroke="#064E3B" strokeWidth="2.5" />
            <rect x="22" y="20" width="56" height="80" rx="3" fill="#047857" />
            {/* Compass Rose */}
            <circle cx="50" cy="48" r="16" fill="#ECFDF5" stroke="#10B981" strokeWidth="2" />
            <polygon points="50,34 53,48 50,46 47,48" fill="#EF4444" />
            <polygon points="50,62 53,48 50,50 47,48" fill="#1E293B" />
            <polygon points="36,48 50,51 48,48 50,45" fill="#1E293B" />
            <polygon points="64,48 50,51 52,48 50,45" fill="#1E293B" />
            <text x="50" y="32" fill="#ECFDF5" fontSize="5" fontWeight="bold" textAnchor="middle">N</text>
            <rect x="30" y="72" width="40" height="7" rx="1" fill="#FEF3C7" />
            <text x="50" y="78" fill="#78350F" fontSize="5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">STUDENT ATLAS</text>
          </svg>
        )}

        {/* 11. NEWSPAPERS & EDITORIAL COMPENDIUMS */}
        {artworkType === 'newspaper' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 3-Ring Dossier Binder */}
            <rect x="20" y="16" width="60" height="88" rx="5" fill="#475569" stroke="#1E293B" strokeWidth="2" />
            <rect x="28" y="20" width="50" height="80" rx="2" fill="#F8FAFC" />
            {/* 3 Metal Binder Rings */}
            <circle cx="24" cy="30" r="3" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
            <circle cx="24" cy="60" r="3" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
            <circle cx="24" cy="90" r="3" fill="#CBD5E1" stroke="#334155" strokeWidth="1.5" />
            {/* Newspaper Header */}
            <rect x="34" y="25" width="38" height="6" fill="#0F172A" />
            <text x="53" y="30" fill="#F8FAFC" fontSize="4.5" fontFamily="serif" textAnchor="middle" fontWeight="bold">THE DAILY EDITORIAL</text>
            <line x1="34" y1="33" x2="72" y2="33" stroke="#0F172A" strokeWidth="1" />
            {/* 2-Column Articles */}
            <rect x="34" y="37" width="16" height="4" fill="#FEF08A" />
            <line x1="34" y1="44" x2="50" y2="44" stroke="#64748B" strokeWidth="1" />
            <line x1="34" y1="48" x2="50" y2="48" stroke="#64748B" strokeWidth="1" />
            <line x1="34" y1="52" x2="48" y2="52" stroke="#64748B" strokeWidth="1" />
            <rect x="56" y="37" width="16" height="4" fill="#BAE6FD" />
            <line x1="56" y1="44" x2="72" y2="44" stroke="#64748B" strokeWidth="1" />
            <line x1="56" y1="48" x2="72" y2="48" stroke="#64748B" strokeWidth="1" />
            <line x1="56" y1="52" x2="70" y2="52" stroke="#64748B" strokeWidth="1" />
            {/* Policy Sticky Note */}
            <rect x="42" y="65" width="28" height="24" rx="2" fill="#FEF08A" stroke="#FBBF24" strokeWidth="1" />
            <text x="56" y="74" fill="#854D0E" fontSize="4.5" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">EXPLAINED</text>
            <line x1="46" y1="80" x2="66" y2="80" stroke="#CA8A04" strokeWidth="1" />
            <line x1="46" y1="84" x2="62" y2="84" stroke="#CA8A04" strokeWidth="1" />
          </svg>
        )}

        {/* 12. ENCYCLOPEDIA & REFERENCE HANDBOOKS */}
        {artworkType === 'encyclopedia' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="16" width="56" height="88" rx="5" fill="#451A03" stroke="#270F01" strokeWidth="2.5" />
            <rect x="26" y="20" width="48" height="80" rx="3" fill="#78350F" />
            <line x1="33" y1="16" x2="33" y2="104" stroke="#FDE68A" strokeWidth="2" />
            {/* Gold Leaf Classic Crest */}
            <rect x="36" y="30" width="32" height="32" rx="3" fill="#92400E" stroke="#FBBF24" strokeWidth="1.5" />
            <circle cx="52" cy="46" r="10" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M52 38 L48 46 H56 Z" fill="#D97706" />
            <rect x="34" y="68" width="36" height="7" rx="1.5" fill="#FEF3C7" />
            <text x="52" y="74" fill="#78350F" fontSize="5" fontFamily="serif" textAnchor="middle" fontWeight="bold">ENCYCLOPAEDIA</text>
            <rect x="38" y="79" width="28" height="4" rx="1" fill="#FDE68A" />
            <text x="52" y="83" fill="#78350F" fontSize="3.5" fontFamily="serif" textAnchor="middle">VOL. I • SCIENCE</text>
            {/* Dual Silk Ribbons */}
            <path d="M48 16 V32 L52 28 L56 32 V16" fill="#DC2626" />
            <path d="M54 16 V34 L58 30 L62 34 V16" fill="#F59E0B" />
          </svg>
        )}

        {/* 13. MICROCONTROLLERS & ROBOTICS (Arduino / Raspberry Pi) */}
        {artworkType === 'microcontroller' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="20" width="64" height="80" rx="4" fill="#00878F" stroke="#005F66" strokeWidth="2.5" />
            {/* USB Port & Power Jack */}
            <rect x="22" y="14" width="16" height="10" rx="2" fill="#CBD5E1" stroke="#475569" strokeWidth="1.2" />
            <rect x="58" y="14" width="14" height="10" rx="2" fill="#1E293B" stroke="#0F172A" strokeWidth="1.2" />
            {/* Main Processor Chip */}
            <rect x="36" y="44" width="28" height="28" rx="2" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
            <circle cx="42" cy="50" r="1.5" fill="#94A3B8" />
            <text x="50" y="60" fill="#E2E8F0" fontSize="5" fontFamily="monospace" textAnchor="middle">MEGA</text>
            {/* GPIO Pin Headers along edges */}
            <rect x="20" y="28" width="6" height="48" rx="1" fill="#1E293B" />
            <rect x="74" y="28" width="6" height="48" rx="1" fill="#1E293B" />
            {/* Crystal Oscillator */}
            <rect x="36" y="80" width="14" height="6" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            {/* Blinking LEDs */}
            <circle cx="56" cy="83" r="2" fill="#22C55E" />
            <circle cx="62" cy="83" r="2" fill="#EF4444" />
          </svg>
        )}

        {/* 14. SOLDERING IRON & TOOLKIT */}
        {artworkType === 'soldering-iron' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Heated Tip */}
            <polygon points="50,14 46,30 54,30" fill="#F59E0B" />
            <line x1="50" y1="14" x2="50" y2="8" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            {/* Heating Element Collar */}
            <rect x="44" y="30" width="12" height="12" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1.2" />
            {/* Smart Digital Handle with OLED */}
            <rect x="40" y="42" width="20" height="58" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <rect x="44" y="48" width="12" height="18" rx="2" fill="#020617" stroke="#38BDF8" strokeWidth="0.8" />
            <text x="50" y="60" fill="#38BDF8" fontSize="5.5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">350°C</text>
            <circle cx="50" cy="74" r="3" fill="#64748B" />
            <circle cx="50" cy="84" r="3" fill="#64748B" />
            {/* Cable at bottom */}
            <path d="M50 100 C50 114, 76 114, 76 104" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {/* 15. GIMBAL / CAMERA GEAR */}
        {artworkType === 'gimbal' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Smartphone in Mount */}
            <rect x="22" y="16" width="56" height="30" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
            <circle cx="50" cy="31" r="5" fill="#EF4444" />
            {/* Gimbal Clamp Arms */}
            <rect x="46" y="46" width="8" height="12" rx="2" fill="#64748B" />
            <circle cx="50" cy="58" r="7" fill="#334155" stroke="#1E293B" strokeWidth="1.5" />
            {/* Handle & Joystick */}
            <rect x="43" y="64" width="14" height="46" rx="5" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <circle cx="50" cy="74" r="4" fill="#475569" stroke="#94A3B8" strokeWidth="1" />
            <circle cx="50" cy="86" r="3" fill="#EF4444" />
            <rect x="47" y="94" width="6" height="10" rx="1" fill="#334155" />
          </svg>
        )}

        {/* 16. PRESENTATION CLICKER */}
        {artworkType === 'clicker' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="36" y="16" width="28" height="88" rx="12" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            {/* Laser Emitter Top */}
            <rect x="46" y="12" width="8" height="4" rx="1" fill="#EF4444" />
            <line x1="50" y1="12" x2="50" y2="4" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            {/* Big Next/Previous Nav Wheel */}
            <circle cx="50" cy="46" r="10" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            <polygon points="50,40 54,46 46,46" fill="#F8FAFC" />
            <polygon points="50,52 54,46 46,46" fill="#F8FAFC" />
            {/* Spotlight Button */}
            <circle cx="50" cy="68" r="4" fill="#F59E0B" />
            {/* Timer & Bluetooth LED */}
            <circle cx="50" cy="84" r="2" fill="#38BDF8" />
          </svg>
        )}

        {/* 17. DIGITAL MULTIMETER */}
        {artworkType === 'multimeter' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="16" width="56" height="88" rx="10" fill="#F59E0B" stroke="#D97706" strokeWidth="2.5" />
            <rect x="26" y="20" width="48" height="80" rx="7" fill="#1E293B" />
            {/* LCD Screen with Voltage */}
            <rect x="32" y="26" width="36" height="18" rx="3" fill="#D9F99D" stroke="#65A30D" strokeWidth="1" />
            <text x="50" y="38" fill="#14532D" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">12.04 V</text>
            {/* Rotary Dial */}
            <circle cx="50" cy="64" r="14" fill="#334155" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="64" x2="50" y2="54" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
            {/* Jack Terminals with Probes */}
            <circle cx="38" cy="88" r="4" fill="#1E1B4B" stroke="#64748B" strokeWidth="1" />
            <circle cx="50" cy="88" r="4" fill="#1E1B4B" stroke="#64748B" strokeWidth="1" />
            <circle cx="62" cy="88" r="4" fill="#1E1B4B" stroke="#64748B" strokeWidth="1" />
            <circle cx="38" cy="88" r="2" fill="#EF4444" />
            <circle cx="50" cy="88" r="2" fill="#000000" />
            <circle cx="62" cy="88" r="2" fill="#F59E0B" />
          </svg>
        )}

        {/* 18. LABEL MAKER */}
        {artworkType === 'label-maker' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="26" y="20" width="48" height="80" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Label Dispensing Slot */}
            <rect x="34" y="10" width="32" height="10" rx="2" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
            <text x="50" y="17" fill="#854D0E" fontSize="5" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LAB SAMPLE A1</text>
            {/* LCD Screen */}
            <rect x="32" y="28" width="36" height="16" rx="3" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            <text x="50" y="38" fill="#0F172A" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">PRINTING...</text>
            {/* Keyboard matrix */}
            <rect x="32" y="52" width="36" height="40" rx="3" fill="#334155" />
            <circle cx="38" cy="60" r="2" fill="#94A3B8" />
            <circle cx="46" cy="60" r="2" fill="#94A3B8" />
            <circle cx="54" cy="60" r="2" fill="#94A3B8" />
            <circle cx="62" cy="60" r="2" fill="#10B981" />
            <circle cx="38" cy="70" r="2" fill="#94A3B8" />
            <circle cx="46" cy="70" r="2" fill="#94A3B8" />
            <circle cx="54" cy="70" r="2" fill="#94A3B8" />
            <circle cx="62" cy="70" r="2" fill="#94A3B8" />
            <rect x="40" y="80" width="20" height="4" rx="1" fill="#64748B" />
          </svg>
        )}

        {/* 19. CALCULATORS */}
        {artworkType === 'calculator' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="18" y="10" width="64" height="100" rx="8" fill="#1E1B4B" stroke="#312E81" strokeWidth="2.5" />
            <rect x="26" y="18" width="48" height="22" rx="4" fill="#064E3B" />
            <rect x="30" y="22" width="40" height="14" rx="2" fill="#047857" />
            <text x="66" y="32" fill="#D1FAE5" fontSize="8" fontFamily="monospace" textAnchor="end" fontWeight="bold">3.14159</text>
            <rect x="26" y="46" width="48" height="8" rx="2" fill="#312E81" />
            {/* Keypad Grid */}
            <circle cx="32" cy="64" r="4" fill="#4338CA" />
            <circle cx="44" cy="64" r="4" fill="#4338CA" />
            <circle cx="56" cy="64" r="4" fill="#4338CA" />
            <circle cx="68" cy="64" r="4" fill="#EF4444" />
            <circle cx="32" cy="76" r="4" fill="#4338CA" />
            <circle cx="44" cy="76" r="4" fill="#4338CA" />
            <circle cx="56" cy="76" r="4" fill="#4338CA" />
            <circle cx="68" cy="76" r="4" fill="#F59E0B" />
            <circle cx="32" cy="88" r="4" fill="#4338CA" />
            <circle cx="44" cy="88" r="4" fill="#4338CA" />
            <circle cx="56" cy="88" r="4" fill="#4338CA" />
            <circle cx="68" cy="88" r="4" fill="#10B981" />
            <rect x="28" y="98" width="20" height="6" rx="2" fill="#6366F1" />
            <rect x="52" y="98" width="20" height="6" rx="2" fill="#10B981" />
          </svg>
        )}

        {/* 20. LAB COAT */}
        {artworkType === 'lab-coat' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 18 L50 42 L70 18 L84 32 L74 105 L26 105 L16 32 Z" fill="#FFFFFF" stroke="#0D9488" strokeWidth="2.5" />
            <path d="M50 42 V105" stroke="#0D9488" strokeWidth="2" strokeDasharray="3 3" />
            <path d="M30 18 L50 42 L38 52 Z" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2" />
            <path d="M70 18 L50 42 L62 52 Z" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2" />
            <rect x="30" y="60" width="14" height="16" rx="2" fill="#F0FDFA" stroke="#0D9488" strokeWidth="2" />
            <line x1="34" y1="54" x2="34" y2="64" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="38" y1="56" x2="38" y2="64" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="50" cy="58" r="2" fill="#0D9488" />
            <circle cx="50" cy="72" r="2" fill="#0D9488" />
            <circle cx="50" cy="86" r="2" fill="#0D9488" />
          </svg>
        )}

        {/* 21. CHARGER / GA-N ADAPTER */}
        {artworkType === 'charger' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="38" width="56" height="50" rx="10" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
            <rect x="36" y="24" width="8" height="14" rx="2" fill="#D97706" />
            <rect x="56" y="24" width="8" height="14" rx="2" fill="#D97706" />
            <path d="M52 48 L42 64 H50 L46 78 L60 60 H50 Z" fill="#F59E0B" />
            <text x="50" y="84" fill="#78716C" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">65W GaN</text>
            <path d="M50 88 C50 105, 80 105, 80 90 C80 75, 88 75, 88 85" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {/* 22. UMBRELLA */}
        {artworkType === 'umbrella' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 60 C15 32, 85 32, 85 60 C75 56, 65 60, 50 56 C35 60, 25 56, 15 60 Z" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2.5" />
            <line x1="50" y1="28" x2="50" y2="92" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" />
            <path d="M50 92 C50 102, 38 102, 38 96" stroke="#1E1B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M25 24 Q25 28 27 28 Q29 28 29 24 Q27 20 25 24 Z" fill="#60A5FA" />
            <path d="M72 20 Q72 24 74 24 Q76 24 76 20 Q74 16 72 20 Z" fill="#60A5FA" />
          </svg>
        )}

        {/* 23. SPORTS: TENNIS / BADMINTON / BALLS */}
        {artworkType === 'sports-tennis' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="50" cy="45" rx="28" ry="32" fill="#F0FDF4" stroke="#059669" strokeWidth="3" />
            <line x1="32" y1="45" x2="68" y2="45" stroke="#10B981" strokeWidth="1" />
            <line x1="36" y1="32" x2="64" y2="32" stroke="#10B981" strokeWidth="1" />
            <line x1="36" y1="58" x2="64" y2="58" stroke="#10B981" strokeWidth="1" />
            <line x1="50" y1="20" x2="50" y2="70" stroke="#10B981" strokeWidth="1" />
            <path d="M42 74 L46 95 H54 L58 74" fill="#047857" />
            <rect x="46" y="95" width="8" height="20" rx="2" fill="#F59E0B" stroke="#047857" strokeWidth="1.5" />
            <circle cx="72" cy="80" r="10" fill="#BEF264" stroke="#84CC16" strokeWidth="1.5" />
          </svg>
        )}

        {artworkType === 'sports-basketball' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="60" r="38" fill="#EA580C" stroke="#C2410C" strokeWidth="3" />
            <line x1="12" y1="60" x2="88" y2="60" stroke="#1E1B4B" strokeWidth="2.5" />
            <line x1="50" y1="22" x2="50" y2="98" stroke="#1E1B4B" strokeWidth="2.5" />
            <path d="M24 34 Q50 60 24 86" stroke="#1E1B4B" strokeWidth="2" fill="none" />
            <path d="M76 34 Q50 60 76 86" stroke="#1E1B4B" strokeWidth="2" fill="none" />
          </svg>
        )}

        {artworkType === 'sports-football' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="60" r="38" fill="#F8FAFC" stroke="#0F172A" strokeWidth="3" />
            {/* Center Pentagon */}
            <polygon points="50,48 60,55 56,67 44,67 40,55" fill="#0F172A" />
            <line x1="50" y1="48" x2="50" y2="24" stroke="#0F172A" strokeWidth="2" />
            <line x1="60" y1="55" x2="82" y2="44" stroke="#0F172A" strokeWidth="2" />
            <line x1="56" y1="67" x2="74" y2="88" stroke="#0F172A" strokeWidth="2" />
            <line x1="44" y1="67" x2="26" y2="88" stroke="#0F172A" strokeWidth="2" />
            <line x1="40" y1="55" x2="18" y2="44" stroke="#0F172A" strokeWidth="2" />
          </svg>
        )}

        {artworkType === 'sports-badminton' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="44" cy="40" rx="24" ry="28" fill="#F0FDF4" stroke="#059669" strokeWidth="2.5" />
            <line x1="28" y1="40" x2="60" y2="40" stroke="#10B981" strokeWidth="0.8" />
            <line x1="44" y1="18" x2="44" y2="62" stroke="#10B981" strokeWidth="0.8" />
            <rect x="42" y="66" width="4" height="42" rx="1.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1" />
            {/* Shuttlecock */}
            <polygon points="68,74 86,64 80,90" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
            <circle cx="72" cy="84" r="4" fill="#1E293B" />
          </svg>
        )}

        {(artworkType === 'sports-cricket' || artworkType === 'sports-yoga' || artworkType === 'sports-general') && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cricket Bat & Ball */}
            <rect x="36" y="20" width="16" height="54" rx="4" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            <rect x="41" y="74" width="6" height="34" rx="2" fill="#FDE68A" stroke="#92400E" strokeWidth="1.5" />
            <circle cx="68" cy="46" r="12" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            <line x1="56" y1="46" x2="80" y2="46" stroke="#FEF2F2" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        )}

        {/* 24. TOOLS */}
        {artworkType === 'tools-screwdriver' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="46" y="16" width="8" height="48" rx="1" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            <polygon points="46,16 54,16 50,8" fill="#64748B" />
            <rect x="40" y="60" width="20" height="48" rx="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <rect x="46" y="64" width="8" height="38" rx="2" fill="#1E293B" />
          </svg>
        )}

        {artworkType === 'tools-general' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 32 H70 V44 H56 V52 H44 V44 H30 Z" fill="#475569" stroke="#1E293B" strokeWidth="2" />
            <rect x="46" y="48" width="8" height="62" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="2" />
            <rect x="44" y="88" width="12" height="18" rx="2" fill="#1E293B" />
          </svg>
        )}

        {/* 25. KITCHEN */}
        {artworkType === 'kitchen-kettle' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 40 H70 L78 94 H22 Z" fill="#FFFFFF" stroke="#EA580C" strokeWidth="2.5" />
            <path d="M26 72 H74 L76 92 H24 Z" fill="#FFEDD5" />
            <line x1="60" y1="55" x2="68" y2="55" stroke="#EA580C" strokeWidth="1.5" />
            <line x1="60" y1="65" x2="68" y2="65" stroke="#EA580C" strokeWidth="1.5" />
            <line x1="60" y1="75" x2="68" y2="75" stroke="#EA580C" strokeWidth="1.5" />
            <rect x="36" y="32" width="28" height="8" rx="3" fill="#431407" />
            <path d="M30 46 C12 46, 12 88, 26 88" stroke="#431407" strokeWidth="4" strokeLinecap="round" fill="none" />
            <rect x="18" y="96" width="64" height="6" rx="3" fill="#1C1917" />
          </svg>
        )}

        {(artworkType === 'kitchen-coffee' || artworkType === 'kitchen-general') && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="28" y="26" width="44" height="68" rx="6" fill="#F8FAFC" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="32" y="54" width="36" height="36" fill="#78350F" />
            <line x1="50" y1="12" x2="50" y2="54" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="12" r="5" fill="#0F172A" />
            <path d="M72 40 C86 40, 86 80, 72 80" stroke="#0F172A" strokeWidth="3" fill="none" strokeLinecap="round" />
          </svg>
        )}

        {/* 26. STATIONERY */}
        {artworkType === 'stationery-pen' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="44" y="20" width="12" height="74" rx="3" fill="#4F46E5" stroke="#312E81" strokeWidth="2" />
            <polygon points="44,94 56,94 50,108" fill="#E0E7FF" stroke="#312E81" strokeWidth="1" />
            <polygon points="48,104 52,104 50,108" fill="#1E1B4B" />
            <rect x="42" y="24" width="4" height="24" rx="1" fill="#FBBF24" />
          </svg>
        )}

        {(artworkType === 'stationery-notebook' || artworkType === 'stationery-general') && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="24" y="16" width="56" height="88" rx="6" fill="#6366F1" stroke="#4338CA" strokeWidth="2.5" />
            <rect x="32" y="22" width="42" height="76" rx="3" fill="#F8FAFC" />
            <line x1="38" y1="34" x2="68" y2="34" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="38" y1="44" x2="68" y2="44" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="38" y1="54" x2="68" y2="54" stroke="#CBD5E1" strokeWidth="1.5" />
            <line x1="38" y1="64" x2="68" y2="64" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Spiral binding rings */}
            <circle cx="28" cy="28" r="2" fill="#1E1B4B" />
            <circle cx="28" cy="40" r="2" fill="#1E1B4B" />
            <circle cx="28" cy="52" r="2" fill="#1E1B4B" />
            <circle cx="28" cy="64" r="2" fill="#1E1B4B" />
            <circle cx="28" cy="76" r="2" fill="#1E1B4B" />
            <circle cx="28" cy="88" r="2" fill="#1E1B4B" />
          </svg>
        )}

        {/* 27. DECOR */}
        {artworkType === 'decor-plant' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ceramic Pot */}
            <polygon points="32,70 68,70 62,102 38,102" fill="#F97316" stroke="#C2410C" strokeWidth="2" />
            <ellipse cx="50" cy="70" rx="18" ry="4" fill="#EA580C" />
            {/* Monstera / Succulent Leaves */}
            <path d="M50 70 Q30 40 40 24 Q52 36 50 70" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
            <path d="M50 70 Q70 40 60 24 Q48 36 50 70" fill="#059669" stroke="#047857" strokeWidth="1.5" />
            <path d="M50 70 Q50 30 50 18 Q56 30 50 70" fill="#34D399" stroke="#059669" strokeWidth="1.5" />
          </svg>
        )}

        {(artworkType === 'decor-lamp' || artworkType === 'decor-general') && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="48" r="28" fill="#FEF08A" stroke="#F59E0B" strokeWidth="2.5" />
            <circle cx="50" cy="48" r="20" fill="#F43F5E" opacity="0.85" />
            <circle cx="50" cy="48" r="12" fill="#FB923C" />
            <line x1="50" y1="76" x2="50" y2="104" stroke="#1C1917" strokeWidth="3" strokeLinecap="round" />
            <rect x="30" y="104" width="40" height="6" rx="2" fill="#1C1917" />
            <circle cx="24" cy="30" r="3.5" fill="#FBBF24" />
            <circle cx="78" cy="34" r="3" fill="#F43F5E" />
            <circle cx="28" cy="72" r="2.5" fill="#F59E0B" />
            <circle cx="74" cy="74" r="3" fill="#FB923C" />
          </svg>
        )}

        {/* 28. GENERAL BOOKS */}
        {artworkType === 'books-general' && (
          <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="16" width="56" height="88" rx="4" fill="#78350F" stroke="#451A03" strokeWidth="2.5" />
            <rect x="26" y="20" width="48" height="80" rx="3" fill="#92400E" />
            <line x1="34" y1="16" x2="34" y2="104" stroke="#FBBF24" strokeWidth="2" />
            <circle cx="54" cy="48" r="12" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
            <path d="M48 48 L54 42 L60 48 L54 54 Z" fill="#F59E0B" />
            <rect x="42" y="68" width="24" height="4" rx="1" fill="#FDE68A" />
            <rect x="44" y="76" width="20" height="3" rx="1" fill="#FDE68A" />
            <path d="M52 16 V32 L56 28 L60 32 V16" fill="#DC2626" />
          </svg>
        )}
      </div>
    </div>
  );
};

