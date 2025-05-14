import React from 'react';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <h2>About Inquivesta</h2>
        <p>
          Inquivesta, the annual socio-cultural festival of IISER Kolkata, is a vibrant celebration of creativity, talent, and culture. 
          Our mission is to provide a platform for students from across the nation to showcase their skills, engage in stimulating discussions, and experience a confluence of diverse art forms. 
          With a rich legacy of memorable events and performances, Inquivesta aims to foster a spirit of community and intellectual curiosity.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;