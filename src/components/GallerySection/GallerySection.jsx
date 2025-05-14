import React, { useState, useEffect } from 'react';
import styles from './GallerySection.module.css';

// Vite-specific way to import multiple images
const galleryImageModules = import.meta.glob('../../assets/gallery/*.(png|PNG|jpg|JPG|jpeg|JPEG|svg|SVG|gif|GIF)', { eager: true });

const INITIAL_IMAGES_COUNT = 4; // Number of images to show initially

const GallerySection = () => {
  const [allImages, setAllImages] = useState([]);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    const loadedImages = Object.values(galleryImageModules)
      .map(module => module.default)
      .filter(imageSrc => imageSrc !== null); // Ensure no null/undefined paths
    setAllImages(loadedImages);
  }, []);

  const imagesToDisplay = showAllImages ? allImages : allImages.slice(0, INITIAL_IMAGES_COUNT);

  if (allImages.length === 0) {
    return (
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <h2>Gallery</h2>
          <p>Loading images...</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.gallerySection}>
      <div className={styles.container}>
        <h2>Gallery</h2>
        <div className={styles.galleryGrid}>
          {imagesToDisplay.map((image, index) => (
            <div key={index} className={styles.galleryItem}>
              <img src={image} alt={`Gallery image ${index + 1}`} />
            </div>
          ))}
        </div>
        {allImages.length > INITIAL_IMAGES_COUNT && (
          <button
            onClick={() => setShowAllImages(!showAllImages)}
            className={styles.galleryToggleButton}
          >
            {showAllImages ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </section>
  );
};

export default GallerySection;