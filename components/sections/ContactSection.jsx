import {
  FaEnvelope,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPhoneSquareAlt,
  FaSnapchat,
  FaTelegram,
} from "react-icons/fa";
import Image from "next/image";
import { FaThreads, FaXTwitter } from "react-icons/fa6";
import "@/app/(public)/Contact.css";
import "@/app/(public)/Home.css";
import { FiSend, FiFacebook, FiMessageSquare, FiGhost } from "react-icons/fi";

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  threads: FaThreads,
  snapchat: FaSnapchat,
  telegram: FaTelegram,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  github: FaGithub,
  email: FaEnvelope,
  website: FaLinkedin,
};

const SOCIAL_URL_PREFIXES = {
  linkedin: 'https://linkedin.com/in/',
  github: 'https://github.com/',
  twitter: 'https://x.com/',
  facebook: 'https://facebook.com/',
  instagram: 'https://instagram.com/',
  threads: 'https://threads.net/@',
  snapchat: 'https://snapchat.com/add/',
  telegram: 'https://t.me/',
  website: '',
};

function normalizeSocialUrl(value, key) {
  if (!value) return '';
  const trimmed = value.trim();
  if (key === 'email' && !trimmed.includes('@')) return '';
  if (key === 'email' && !trimmed.startsWith('mailto:')) return `mailto:${trimmed}`;
  if (['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'threads', 'snapchat', 'telegram', 'website'].includes(key)) {
    if (trimmed.startsWith('http')) return trimmed;
    if (trimmed.includes('.')) return `https://${trimmed}`;
    return `${SOCIAL_URL_PREFIXES[key] || ''}${trimmed}`;
  }
  return trimmed;
}

const SOCIAL_ORDER = {
  // First half - Personal/Social
  personal: ['facebook', 'instagram', 'threads', 'snapchat', 'telegram'],
  // Divider
  divider: ['codolio'],
  // Second half - Professional
  professional: ['linkedin', 'github', 'twitter'],
};

export default function ContactSection({ socialLinks = {} }) {
  return (
    <section id="contact" className="contact section reveal" suppressHydrationWarning>
      <h2 className="section__title reveal delay-1">
        Get In <span>Touch</span>
      </h2>
      <div className="contact__container container grid reveal delay-2">
        <div className="contact__data">
          <h3 className="contact__title">Don&apos;t be Shy !</h3>
          <p className="contact__description">
            Feel free to get in touch with me. I am always open to discussing
            new projects, creative ideas or opportunities to be part of your
            visions.
          </p>
          <div className="contact__info">
            {socialLinks.email && (
              <a href={`mailto:${socialLinks.email}`} className="info__link">
                <div className="info__item">
                  <FaEnvelope className="info__icon" />
                  <div className="info__content">
                    <span className="info__title">Email</span>
                    <h4 className="info__desc">{socialLinks.email}</h4>
                  </div>
                </div>
              </a>
            )}
            {socialLinks.phone && (
              <a href={`tel:${socialLinks.phone}`} className="info__link">
                <div className="info__item">
                  <FaPhoneSquareAlt className="info__icon" />
                  <div className="info__content">
                    <span className="info__title">Phone</span>
                    <h4 className="info__desc">{socialLinks.phone}</h4>
                  </div>
                </div>
              </a>
            )}
          </div>

          <div className="contact__socials-card">
            <span className="contact__socials-title">Connect</span>
            <div className="contact__socials">
              {/* Personal/Social - First half */}
              {SOCIAL_ORDER.personal.map(key => {
                const url = socialLinks[key];
                if (!url) return null;
                const Icon = SOCIAL_ICONS[key];
                if (!Icon) return null;
                const normalizedUrl = normalizeSocialUrl(url, key);
                return (
                  <a key={key} href={normalizedUrl} className="contact__social-link" aria-label={key.charAt(0).toUpperCase() + key.slice(1)}>
                    <Icon />
                  </a>
                );
              })}
              
              {/* Divider - Codolio */}
              {SOCIAL_ORDER.divider.map(key => {
                const url = socialLinks[key];
                if (!url) return null;
                return (
                  <a key={key} href={url} className="contact__social-link contact__social-link--divider" aria-label="Codolio">
                    <div className="contact__social-icon-wrapper" style={{ width: '1.2rem', height: '1.2rem', position: 'relative' }}>
                      <Image src="https://res.cloudinary.com/amank736836/image/upload/v1785565558/portfolio/portfolio/codolio.svg" alt="Codolio" fill className="contact__social-icon" style={{ objectFit: 'contain' }} />
                    </div>
                  </a>
                );
              })}
              
              {/* Professional - Second half */}
              {SOCIAL_ORDER.professional.map(key => {
                const url = socialLinks[key];
                if (!url) return null;
                const Icon = SOCIAL_ICONS[key];
                if (!Icon) return null;
                const normalizedUrl = normalizeSocialUrl(url, key);
                return (
                  <a key={key} href={normalizedUrl} className="contact__social-link" aria-label={key.charAt(0).toUpperCase() + key.slice(1)}>
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <form
          action="https://formspree.io/f/mgvwardg"
          method="POST"
          className="contact__form"
          suppressHydrationWarning
        >
          <div className="form__input-group">
            <div className="form__input-div">
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                className="form__control"
                required
              />
            </div>
            <div className="form__input-div">
              <input
                name="email"
                type="email"
                placeholder="Your Email"
                className="form__control"
                required
              />
            </div>

            <div className="form__input-div">
              <select name="subject" className="form__control" required defaultValue="">
                <option value="" disabled>Select Subject</option>
                <option value="Project Inquiry">Project Inquiry</option>
                <option value="Internship Opportunity">Internship Opportunity</option>
                <option value="Freelance Work">Freelance Work</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form__input-div">
            <textarea
              name="message"
              placeholder="Tell me about your project..."
              className="form__control textarea"
              required
            ></textarea>
          </div>
          <div className="button-center">
            <button className="button" type="Submit">
              Send Message
              <span className="button__icon contact__button-icon">
                <FiSend />
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}