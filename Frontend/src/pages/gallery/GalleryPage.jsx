import React, { useEffect, useState } from 'react';
import { photos } from '../../assets/data/galleryPhotos';
import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const GalleryPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Dorze Tours - Gallery';
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FFDA32]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Gallery
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Discover the breathtaking landscapes and rich cultural heritage of
            Ethiopia through our lens
          </p>
        </div>

        <div className="gallery-container">
          <div className="gallery-grid">
            {photos.map((photo, index) => (
              <div key={index} className="gallery-item">
                <LightGallery plugins={[lgThumbnail, lgZoom]} mode="lg-fade">
                  <a
                    href={photo.src}
                    className="gallery-link"
                    data-sub-html={`<h4>Ethiopia's Beauty</h4><p>Location: ${photo.location || 'Ethiopia'}</p>`}
                  >
                    <div className="image-wrapper">
                      <img
                        src={photo.src}
                        alt={`Gallery image ${index + 1}`}
                        className="gallery-image"
                        loading="lazy"
                      />
                      <div className="overlay">
                        <span className="view-text">View Image</span>
                      </div>
                    </div>
                  </a>
                </LightGallery>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
