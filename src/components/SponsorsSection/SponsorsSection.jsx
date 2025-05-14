import React, { useState, useEffect } from 'react';
import styles from './SponsorsSection.module.css';

// Vite-specific way to import multiple images
// Updated to include uppercase extensions
const sponsorImageModules = import.meta.glob('../../assets/sponsors/*.(png|PNG|jpg|JPG|jpeg|JPEG|svg|SVG|gif|GIF)', { eager: true });

const SponsorsSection = () => {
  const [logos, setLogos] = useState([]);

  useEffect(() => {
    const loadedLogos = Object.values(sponsorImageModules).map(module => module.default);
    setLogos(loadedLogos);
  }, []);

  return (
    <section className={styles.sponsorsSection}>
      <div className={styles.container}>
        <h2>Our Previous Sponsors</h2>
        {logos.length > 0 ? (
          <div className={styles.logoGrid}>
            {logos.map((logo, index) => (
              <div key={index} className={styles.logoItem}>
                <img src={logo} alt={`Sponsor logo ${index + 1}`} />
              </div>
            ))}
          </div>
        ) : (
          <p>Sponsor logos will be displayed here.</p> // Updated message
        )}
        <div className={styles.ctaContainer}>
          <h3>Become a Sponsor</h3>
          <p>Join us in making Inquivesta XII a grand success. For sponsorship opportunities, please contact us at:</p>
          <a href="mailto:inquivesta@iiserkol.ac.in" className={styles.emailLink}>
            inquivesta@iiserkol.ac.in
          </a>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;