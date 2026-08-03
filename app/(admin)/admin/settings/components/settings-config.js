'use client';

import { 
  FiLinkedin, FiGithub, FiTwitter, FiMail, FiGlobe, FiFileText, FiUpload, FiCheck, FiX, FiEdit3, FiTrash2, FiExternalLink, FiPlus, FiGrid, FiLayout, FiColumns, FiToggleRight, FiToggleLeft, FiImage, FiStar, FiTrash, FiEdit2, FiFacebook, FiInstagram, FiMessageSquare, FiSend, FiEye, FiEyeOff, FiDownload, FiHeart, FiActivity, FiSettings, FiLayers, FiCode, FiDatabase, FiServer, FiGlobe as FiGlobe2
} from 'react-icons/fi';
import { Ghost, Send } from 'lucide-react';

export const SOCIAL_PLATFORMS = [
  { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin, placeholder: 'username or full URL', urlPrefix: 'https://linkedin.com/in/', brandColor: '#0A66C2', brandGlow: 'rgba(10, 102, 194, 0.3)' },
  { key: 'github', label: 'GitHub', icon: FiGithub, placeholder: 'username or full URL', urlPrefix: 'https://github.com/', brandColor: '#24292E', brandGlow: 'rgba(36, 41, 46, 0.3)' },
  { key: 'twitter', label: 'Twitter / X', icon: FiTwitter, placeholder: 'username or full URL', urlPrefix: 'https://x.com/', brandColor: '#000000', brandGlow: 'rgba(0, 0, 0, 0.3)' },
  { key: 'facebook', label: 'Facebook', icon: FiFacebook, placeholder: 'username or full URL', urlPrefix: 'https://facebook.com/', brandColor: '#1877F2', brandGlow: 'rgba(24, 119, 242, 0.3)' },
  { key: 'instagram', label: 'Instagram', icon: FiInstagram, placeholder: 'username or full URL', urlPrefix: 'https://instagram.com/', brandColor: '#E4405F', brandGlow: 'rgba(228, 64, 95, 0.3)' },
  { key: 'threads', label: 'Threads', icon: FiMessageSquare, placeholder: 'username or full URL', urlPrefix: 'https://threads.net/@', brandColor: '#000000', brandGlow: 'rgba(0, 0, 0, 0.3)' },
  { key: 'snapchat', label: 'Snapchat', icon: Ghost, placeholder: 'username or full URL', urlPrefix: 'https://snapchat.com/add/', brandColor: '#FFFC00', brandGlow: 'rgba(255, 252, 0, 0.3)' },
  { key: 'telegram', label: 'Telegram', icon: Send, placeholder: 'username or full URL', urlPrefix: 'https://t.me/', brandColor: '#0088CC', brandGlow: 'rgba(0, 136, 204, 0.3)' },
  { key: 'email', label: 'Email', icon: FiMail, placeholder: 'email@example.com', urlPrefix: 'mailto:', brandColor: '#EA4335', brandGlow: 'rgba(234, 67, 53, 0.3)' },
  { key: 'website', label: 'Website', icon: FiGlobe, placeholder: 'https://example.com', urlPrefix: '', brandColor: '#6366F1', brandGlow: 'rgba(99, 102, 241, 0.3)' },
];

export const PORTFOLIO_LAYOUTS = [
  { key: 'masonry', label: 'Masonry (Pinterest-style)', desc: 'Images keep original aspect ratios, brick wall layout', icon: FiGrid },
  { key: 'fixed', label: 'Fixed Ratio (Grid)', desc: 'All images same 5:2 ratio, uniform grid', icon: FiLayout },
];

export const SITE_MODES = [
  { key: 'multi', label: 'Multi-Page', desc: 'Separate pages for each section (default)', icon: FiLayout },
  { key: 'single', label: 'Single Page', desc: 'All sections on one continuous page', icon: FiColumns },
];

export const UI_FEATURES = [
  { key: 'enable_scroll_reveal', label: 'Scroll Reveal Animations', desc: 'Fade/slide animations when sections enter viewport', icon: FiActivity },
  { key: 'enable_typewriter', label: 'Typewriter Effect', desc: 'Animated typing text in hero section', icon: FiCode },
  { key: 'enable_open_to_work', label: 'Open to Opportunities Badge', desc: 'Show availability badge in hero section', icon: FiHeart },
];

export function normalizeSocialValue(value, platform) {
  if (!value) return '';
  const trimmed = value.trim();
  if (platform.key === 'email' && !trimmed.includes('@')) return '';
  if (platform.key === 'email' && !trimmed.startsWith('mailto:')) return `mailto:${trimmed}`;
  if (['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'website'].includes(platform.key)) {
    if (trimmed.startsWith('http')) return trimmed;
    if (trimmed.includes('.')) return `https://${trimmed}`;
    return `${platform.urlPrefix}${trimmed}`;
  }
  return trimmed;
}

export function extractDisplayValue(storedValue, platform) {
  if (!storedValue) return '';
  if (platform.key === 'email') return storedValue.replace('mailto:', '');
  if (['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'website'].includes(platform.key)) {
    if (storedValue.startsWith(platform.urlPrefix)) {
      return storedValue.replace(platform.urlPrefix, '');
    }
    if (storedValue.startsWith('https://') || storedValue.startsWith('http://')) {
      return storedValue;
    }
  }
  return storedValue;
}