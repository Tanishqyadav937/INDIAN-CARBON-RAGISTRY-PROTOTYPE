import { useEffect, useRef, useState } from 'react';
import { ScrollReveal } from './scroll-reveal';

interface ImageItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  id: string;
}

interface ImageScrollerProps {
  images: ImageItem[];
  className?: string;
}

export function ImageScroller({ images, className = '' }: ImageScrollerProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  // const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgId = entry.target.getAttribute('data-image-id');
            if (imgId) {
              // setVisibleImages(prev => new Set([...prev, imgId]));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '100px 0px'
      }
    );

    const imageElements = containerRef.current?.querySelectorAll('[data-image-id]');
    imageElements?.forEach((el) => observer.observe(el));

    return () => {
      imageElements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
  };

  return (
    <div ref={containerRef} className={`grid md:grid-cols-2 lg:grid-cols-4 gap-8 ${className}`}>
      {images.map((image, index) => (
        <ScrollReveal
          key={image.id}
          delay={index * 100}
          direction="up"
          distance={30}
          duration={0.8}
        >
          <div className="group">
            <div className="relative overflow-hidden rounded-2xl bg-tea-green-50 aspect-[4/3] mb-4">
              <div 
                className={`absolute inset-0 transition-opacity duration-500 ${
                  loadedImages.has(image.id) ? 'opacity-0' : 'opacity-100 image-loading'
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-tea-green-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
              <img
                data-image-id={image.id}
                src={image.src}
                alt={image.alt}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  loadedImages.has(image.id) 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-105'
                } group-hover:scale-105`}
                onLoad={() => handleImageLoad(image.id)}
                loading="lazy"
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-500 ${
                loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
              }`}></div>
            </div>
            <ScrollReveal delay={index * 100 + 200} direction="up" distance={20}>
              <h3 className="text-lg font-display font-medium text-foreground mb-2">
                {image.title}
              </h3>
              <p className="text-tea-green-200 text-sm">
                {image.description}
              </p>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
