import React, { useEffect } from 'react';
import { photos } from '../../assets/data/galleryPhotos';
import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

const GalleryPage = () => {
  useEffect(() => {
    document.title = 'Dorze Tours - Gallery';
  }, []);
  return (
    <div className="gallery w-full flex flex-col py-[50px] lg:py-[100px] items-center">
      <h1 className="gallery-title w-full text-center p-10 text-3xl lg:text-5xl font-semibold">
        Our Gallery
      </h1>
      <p
        className="lg:w-[60%] w-full px-6 lg:px-0 text-center
       text-gray-400 font-light"
      >
        Discover the breathtaking landscapes, rich cultural heritage, and unique
        experiences Ethiopia has to offer. Browse through our collection of
        photos to get a glimpse of what awaits you on your next adventure.
      </p>
      <div className="gallery-container w-full">
        <LightGallery plugins={[lgThumbnail, lgZoom]} mode="lg-fade">
          {photos.map((photo, index) => (
            <a
              key={index}
              data-lg-size="1406-1390"
              className="gallery-item"
              data-src={photo.src}
              data-sub-html="<h4>Photo by - </h4> <p> Location - Fushimi Ward, Kyoto, Japan</a></p>"
            >
              <img className="img-responsive" src={photo.src} />
            </a>
          ))}
        </LightGallery>
      </div>
    </div>
  );
};

export default GalleryPage;
