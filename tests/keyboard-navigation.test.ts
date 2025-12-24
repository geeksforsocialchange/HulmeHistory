import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Keyboard Navigation', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('Lightbox keyboard handling', () => {
    it('should check for lightbox active state before timeline navigation', () => {
      // Create lightbox element
      const lightbox = document.createElement('div');
      lightbox.id = 'detail-lightbox';
      document.body.appendChild(lightbox);

      // When lightbox is NOT active, timeline navigation should proceed
      const navCallback = vi.fn();

      // Simulate the app.ts keyboard handler logic
      const handleKeydown = (e: KeyboardEvent) => {
        const lb = document.getElementById('detail-lightbox');
        if (lb?.classList.contains('active')) return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          navCallback();
        }
      };

      document.addEventListener('keydown', handleKeydown);

      // Test: without active class, navigation should fire
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(navCallback).toHaveBeenCalledTimes(1);

      // Test: with active class, navigation should NOT fire
      lightbox.classList.add('active');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(navCallback).toHaveBeenCalledTimes(1); // Still 1, not 2

      // Test: removing active class restores navigation
      lightbox.classList.remove('active');
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(navCallback).toHaveBeenCalledTimes(2);

      document.removeEventListener('keydown', handleKeydown);
    });

    it('should handle missing lightbox element gracefully', () => {
      // No lightbox in DOM
      const navCallback = vi.fn();

      const handleKeydown = (e: KeyboardEvent) => {
        const lb = document.getElementById('detail-lightbox');
        if (lb?.classList.contains('active')) return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          navCallback();
        }
      };

      document.addEventListener('keydown', handleKeydown);

      // Without lightbox element, navigation should still work
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(navCallback).toHaveBeenCalledTimes(1);

      document.removeEventListener('keydown', handleKeydown);
    });
  });

  describe('Lightbox navigation', () => {
    it('should navigate gallery items with arrow keys when active', () => {
      const lightbox = document.createElement('div');
      lightbox.id = 'detail-lightbox';
      lightbox.classList.add('active');
      document.body.appendChild(lightbox);

      let currentIndex = 0;
      const galleryItems = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

      const showPrev = () => {
        currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      };
      const showNext = () => {
        currentIndex = (currentIndex + 1) % galleryItems.length;
      };

      const handleKeydown = (e: KeyboardEvent) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
      };

      document.addEventListener('keydown', handleKeydown);

      expect(currentIndex).toBe(0);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(currentIndex).toBe(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(currentIndex).toBe(2);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(currentIndex).toBe(0); // Wraps around

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(currentIndex).toBe(2); // Wraps back

      document.removeEventListener('keydown', handleKeydown);
    });

    it('should close lightbox on Escape key', () => {
      const lightbox = document.createElement('div');
      lightbox.id = 'detail-lightbox';
      lightbox.classList.add('active');
      document.body.appendChild(lightbox);

      const handleKeydown = (e: KeyboardEvent) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
          lightbox.classList.remove('active');
        }
      };

      document.addEventListener('keydown', handleKeydown);

      expect(lightbox.classList.contains('active')).toBe(true);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(lightbox.classList.contains('active')).toBe(false);

      document.removeEventListener('keydown', handleKeydown);
    });
  });

  describe('PDF and image lightbox content switching', () => {
    it('should set data-type attribute for image content', () => {
      const lightbox = document.createElement('div');
      lightbox.id = 'detail-lightbox';
      document.body.appendChild(lightbox);

      const galleryItems = [
        { type: 'image', url: 'photo.jpg', name: 'Photo' },
        { type: 'pdf', url: 'doc.pdf', name: 'Document' },
      ];

      const showItem = (index: number) => {
        const item = galleryItems[index];
        lightbox.dataset.type = item.type;
      };

      showItem(0);
      expect(lightbox.dataset.type).toBe('image');

      showItem(1);
      expect(lightbox.dataset.type).toBe('pdf');
    });
  });
});
