import React from 'react';
import styles from './LandingSection.module.css';
import backgroundImage from '../../assets/background.png'; 

const LandingSection = () => {
  return (
    <section
      className={styles.landingSection}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.content}>
        <h1 className={styles.headline}>
          Inquivesta XII <br /> is Coming Soon!
        </h1>
        <p className={styles.date}>2026</p>
        <a
          href="https://inquivesta.in" 
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaButton}
        >
          Stay Updated
        </a>
      </div>
    </section>
  );
};

export default LandingSection;
