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
import { FiSend } from "react-icons/fi";

export default function ContactSection() {
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
            <a href="mailto:amankarguwal0@gmail.com" className="info__link">
              <div className="info__item">
                <FaEnvelope className="info__icon" />
                <div className="info__content">
                  <span className="info__title">Email</span>
                  <h4 className="info__desc">amankarguwal0@gmail.com</h4>
                </div>
              </div>
            </a>
            <a href="tel:6284736836" className="info__link">
              <div className="info__item">
                <FaPhoneSquareAlt className="info__icon" />
                <div className="info__content">
                  <span className="info__title">Phone</span>
                  <h4 className="info__desc">+91 6284 736 836</h4>
                </div>
              </div>
            </a>
          </div>

          <div className="contact__socials-card">
            <span className="contact__socials-title">Connect</span>
            <div className="contact__socials">
              <a
                href="https://www.facebook.com/amank736836"
                className="contact__social-link"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/amank736836"
                className="contact__social-link"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.threads.net/amank736836"
                className="contact__social-link"
                aria-label="Threads"
              >
                <FaThreads />
              </a>
              <a
                href="https://www.snapchat.com/add/amank736836"
                className="contact__social-link"
                aria-label="Snapchat"
              >
                <FaSnapchat />
              </a>
              <a
                href="https://codolio.com/profile/amank736836"
                className="contact__social-link"
                aria-label="Codolio"
              >
                <Image
                  src="/assets/codolio.svg"
                  alt="Codolio"
                  className="contact__social-icon"
                  width={20}
                  height={20}
                />
              </a>

              <a href="https://t.me/amank736836" className="contact__social-link" aria-label="Telegram">
                <FaTelegram />
              </a>

              <a
                href="https://www.twitter.com/amank736836"
                className="contact__social-link"
                aria-label="Twitter"
              >
                <FaXTwitter />
              </a>
              <a
                href="https://www.linkedin.com/in/amank736836"
                className="contact__social-link"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.github.com/amank736836"
                className="contact__social-link"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
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
            <button className="button button--primary" type="Submit">
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