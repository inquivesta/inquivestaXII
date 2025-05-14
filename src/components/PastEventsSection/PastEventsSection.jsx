import React from 'react';
import styles from './PastEventsSection.module.css';
import miProniteImage from '../../assets/pronite/MI.png';
import bandProniteImage from '../../assets/pronite/band.png';
import djProniteImage from '../../assets/pronite/dj.png';

const PastEventsSection = () => {
  return (
    <section className={styles.pastEventsSection}>
      <div className={styles.container}>
        <h2>Past Inquivestas</h2>
        <div className={styles.timeline}>
          {/* Placeholder for timeline items - can be dynamically generated */}
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Inquivesta XI</h3>
              <p>A grand success with diverse events and enthusiastic participation. Helmed to be the largest Science Fest of India!</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>Inquivesta X</h3>
              <p>Celebrated a decade of cultural extravaganza.</p>
            </div>
          </div>
        </div>
        <div className={styles.stats}>
          <p><strong>7000+</strong> attendees over <strong>3</strong> days</p>
        </div>
        <div className={styles.guestArtists}>
          <h3>Guest Artists</h3>
          <div className={styles.artistImages}>
            <img src={miProniteImage} alt="MI Pronite" className={styles.artistImage} />
            <img src={bandProniteImage} alt="Band Pronite" className={styles.artistImage} />
            <img src={djProniteImage} alt="DJ Pronite" className={styles.artistImage} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastEventsSection;