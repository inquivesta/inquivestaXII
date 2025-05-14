import React from 'react';
import styles from './App.module.css';
import LandingSection from './components/LandingSection/LandingSection';
import AboutSection from './components/AboutSection/AboutSection';
import PastEventsSection from './components/PastEventsSection/PastEventsSection';
import GallerySection from './components/GallerySection/GallerySection';
import SponsorsSection from './components/SponsorsSection/SponsorsSection';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className={styles.app}>
      <LandingSection />
      <AboutSection />
      <PastEventsSection />
      <GallerySection />
      <SponsorsSection />
      <Footer />
    </div>
  );
}

export default App;
