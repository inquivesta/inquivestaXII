import React from 'react';
import styles from './Footer.module.css';
import { Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>&copy; {new Date().getFullYear()} Inquivesta XII - IISER Kolkata. All rights reserved.</p>
        <p>
          Stay tuned for more updates and announcements!
        </p>
        <div className={styles.socialLinks}>
          <a
            href="https://www.instagram.com/inquivesta_iiserk/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={styles.socialLink}
          >
            <Instagram size={24} />
          </a>
          <a
            href="mailto:inquivesta@iiserkol.ac.in"
            aria-label="Email Inquivesta"
            className={styles.socialLink}
          >
            <Mail size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;