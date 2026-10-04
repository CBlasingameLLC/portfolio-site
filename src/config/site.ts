// Single source of truth for identity and contact details.
// Swap `url` to the custom domain once it is claimed (spec §8).
export const site = {
  name: 'Cayl Blasingame',
  initials: 'C. BLASINGAME',
  url: 'https://portfolio-site.vercel.app',
  description:
    'Electrical engineering student at Texas State University. Builds the hardware first, then the software that runs on it.',
  school: 'Texas State University',
  contact: {
    email: 'TODO@yourdomain', // TODO(Cayl): dedicated public address
    github: 'https://github.com/CBlasingameLLC',
    linkedin: '', // TODO(Cayl): LinkedIn profile URL
  },
} as const;
