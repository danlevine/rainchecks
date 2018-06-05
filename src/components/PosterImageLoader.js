import React, { Component } from 'react';
import 'intersection-observer';

class PosterImageLoader extends Component {
//   constructor() {
//     super();
//   }

  componentDidMount() {
    // Create observer with options (either default or passed in as prop)
    this.observer = new IntersectionObserver((entries, self) => {
      entries.forEach((entry) => {
        this.loadImageOnIntersection(entry, self);
      });
    }, { rootMargin: '400px' });

    // Begin observing image
    this.observer.observe(this.imageRef);
  }

  componentWillUnmount() {
    // Disable entire IntersectionObserver
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  /**
   * loadImageOnIntersection
   * Function used with IntersectionObserver as callback to lazy load images
   * @param {Object} entry - Element being tracked by observer
   * @param {Object} self - Reference of observed object, used to unwire
   */
  loadImageOnIntersection(entry, self) {
    if (!entry.isIntersecting) {
      return;
    }

    // When image is intersected (displayed in viewport bounds):
    // Set element's src to initiate image request
    const img = entry.target;
    if (img.src !== img.dataset.src) {
      img.src = img.dataset.src;
    //   img.classList.add('img-lazyloader__img--loaded');
      // Stop watching once image is set up to be loaded
      self.unobserve(entry.target);
    }
  }

  render() {
    const { className,
            alt, 
            src } = this.props;

    return (
      <img
        className={className}
        alt={alt}
        data-src={src}
        ref={(Image) => {this.imageRef = Image;}}
      />
    );
  }
}

export default PosterImageLoader;

