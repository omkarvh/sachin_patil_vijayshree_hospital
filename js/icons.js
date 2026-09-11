/* ==========================================================
   Lightweight inline icon set (stroke-style, currentColor)
   Used across the site — referenced by name from content.js
   ========================================================== */
const ICONS = {
  "activity": '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  "heart-pulse": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/><path d="M3.5 12H7l1.5-3 2 5 1.5-3H17"/>',
  "utensils": '<path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2M5 11v11M9 2v9M19 2c-1.5 0-3 1.5-3 5v3.5c0 1 .5 1.5 1.5 1.5H19M19 2v20"/>',
  "shield-check": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  "syringe": '<path d="m18 2 4 4M14 4l6 6M7.5 10.5 2 16l1 5 5 1 5.5-5.5M13 8l3 3M9 12l3 3M11 6l3-3"/>',
  "salad": '<path d="M7 21h10M12 21c-4 0-7-2-7-7 0-3 2-5 4-5M12 21c4 0 7-2 7-7 0-3-2-5-4-5M9 9c0-3 1.5-6 3-7 1.5 1 3 4 3 7"/>',
  "footprints": '<path d="M4 16v-3a3 3 0 0 1 3-3 3 3 0 0 1 3 3v3M4 16c0 1.5 1 2 2 2s2-.5 2-2M4 10c0-1 .5-2 1.5-2M13 21v-3a3 3 0 0 1 3-3 3 3 0 0 1 3 3v3M13 21c0 1.5 1 2 2 2s2-.5 2-2M13 15c0-1 .5-2 1.5-2"/>',
  "baby": '<circle cx="12" cy="7" r="3.5"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6M9 7c-1 0-2-1-2-2M15 7c1 0 2-1 2-2"/>',
  "brain-circuit": '<path d="M8 4a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 3 3M16 4a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-3 3M12 4v16"/>',
  "smartphone": '<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>',
  "check": '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<circle cx="12" cy="12" r="9.5"/><path d="m8.5 12 2.5 2.5 5-5"/>',
  "chevron-down": '<path d="m6 9 6 6 6-6"/>',
  "phone": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 2 2.3Z"/>',
  "mail": '<rect x="2" y="4" width="20" height="16" rx="2.5"/><path d="m3 6 9 7 9-7"/>',
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  "clock": '<circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3.5 2"/>',
  "arrow-right": '<path d="M5 12h14M13 6l6 6-6 6"/>',
  "play": '<path d="M6 3.5v17l14-8.5z"/>',
  "x": '<path d="M18 6 6 18M6 6l12 12"/>',
  "star": '<path d="m12 2.5 3 6.3 6.9.9-5 4.9 1.2 6.9L12 18l-6.1 3.5L7 14.6l-5-4.9 6.9-.9Z"/>',
  "menu": '<path d="M3 6h18M3 12h18M3 18h18"/>',
  "award": '<circle cx="12" cy="8" r="6"/><path d="m9 13.5-1.5 7L12 18l4.5 2.5-1.5-7"/>',
  "book-open": '<path d="M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5Z"/><path d="M12 6.5v13"/>',
  "calendar": '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M16 2.5v4M8 2.5v4M3 9.5h18"/>',
  "send": '<path d="m22 2-20 8 8 3 3 8Z"/>',

  "whatsapp": '<path fill="currentColor" stroke="none" d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.5.1-.2 0-.4 0-.5C10 9 9.4 7.6 9.2 7c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.5-.3Z"/><path fill="currentColor" stroke="none" d="M20.5 3.5A11.8 11.8 0 0 0 2.1 17.8L1 23l5.4-1.4A11.8 11.8 0 1 0 20.5 3.5ZM12 21.2a9.3 9.3 0 0 1-4.8-1.3l-.3-.2-3.2.8.9-3.1-.2-.3A9.4 9.4 0 1 1 21.4 12 9.4 9.4 0 0 1 12 21.2Z"/>',
  "instagram": '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.3" cy="6.7" r="1"/>',
  "facebook": '<path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h4v-7.5h3l.5-3.5h-3.5V7.8c0-1 .3-1.7 1.7-1.7H15V3Z"/>',
  "youtube": '<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor" stroke="none"/>',
  "linkedin": '<rect x="2.5" y="2.5" width="19" height="19" rx="3"/><path d="M7 10v7M7 6.8v.1M11 17v-4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17M11 12v0"/>'
};

function icon(name, cls){
  const inner = ICONS[name] || ICONS["check"];
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="${cls||''}">${inner}</svg>`;
}
