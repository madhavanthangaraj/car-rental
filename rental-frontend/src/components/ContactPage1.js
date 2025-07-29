import React from 'react';
import '../styles/ContactPage.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Header1 from './Header1';

const ContactPage = () => (
  <>
    <Header1 />
    <div className="contact-page-wrapper">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>We'd love to hear from you. Reach out anytime!</p>
        <div className="contact-info">
          <p>Email: support@carlyrent.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 Main Street, Chennai, India</p>
        </div>
      </div>

      <footer className="contact-footer">
        <div className="contact-footer-main">
          <div className="contact-footer-col brand-col">
            <div className="brand-logo">
              <span className="brand-icon">C</span>
              <span className="brand-steering">&#128663;</span>
              <span className="brand-name">rly <span className="brand-accent">Rent</span></span>
            </div>
            <p className="brand-desc">
              It's a never ending battle of<br />
              making your cars better and also<br />
              trying to be better yourself.
            </p>
            <div className="social-icons">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedinIn /></a>
            </div>
          </div>
          <div className="contact-footer-col">
            <h4>Account</h4>
            <ul>
              <li>Profile</li>
              <li>Settings</li>
              <li>Billing</li>
              <li>Notifications</li>
            </ul>
          </div>
          <div className="contact-footer-col">
            <h4>About</h4>
            <ul>
              <li>Services</li>
              <li>Pricing</li>
              <li>Contact</li>
              <li>Careers</li>
            </ul>
          </div>
          <div className="contact-footer-col">
            <h4>Company</h4>
            <ul>
              <li>Community</li>
              <li>Help center</li>
              <li>Support</li>
            </ul>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="contact-footer-bottom">
          <div className="footer-left">2020 All Right Reserved by Carly Rent</div>
          <div className="footer-links">
            <span>Terms</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  </>
);

export default ContactPage;
