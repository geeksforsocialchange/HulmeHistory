// Detail panel management

interface EventData {
  id: string;
  title: string;
  desc: string;
  year: number;
}

interface GalleryFile {
  name: string;
  type: 'image' | 'pdf' | 'other';
  url: string;
}

export class DetailPanel {
  private panel: HTMLElement;
  private image: HTMLImageElement;
  private yearEl: HTMLElement;
  private titleEl: HTMLElement;
  private textEl: HTMLElement;
  private galleryEl: HTMLElement;
  private lightbox: HTMLElement;
  private lightboxImg: HTMLImageElement;
  private lightboxCaption: HTMLElement;
  private images: GalleryFile[] = [];
  private currentImageIndex = 0;

  constructor() {
    this.panel = document.getElementById('detail-panel')!;
    this.image = document.getElementById('detail-image') as HTMLImageElement;
    this.yearEl = document.getElementById('detail-year')!;
    this.titleEl = document.getElementById('detail-title')!;
    this.textEl = document.getElementById('detail-text')!;
    this.galleryEl = document.getElementById('detail-gallery')!;
    this.lightbox = document.getElementById('detail-lightbox')!;
    this.lightboxImg = this.lightbox.querySelector('img')!;
    this.lightboxCaption = this.lightbox.querySelector('.lightbox-caption')!;

    this.setupLightbox();
  }

  private setupLightbox(): void {
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');

    closeBtn?.addEventListener('click', () => this.closeLightbox());
    prevBtn?.addEventListener('click', () => this.showPrevImage());
    nextBtn?.addEventListener('click', () => this.showNextImage());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.showPrevImage();
      if (e.key === 'ArrowRight') this.showNextImage();
    });
  }

  async show(eventId: string, year: number, eventData: EventData[]): Promise<void> {
    const event = eventData.find(e => e.id === eventId);

    this.yearEl.textContent = String(year);
    this.titleEl.textContent = event?.title || eventId;

    // Load cover image
    await this.loadCoverImage(eventId);

    // Load content and gallery
    await this.loadContent(eventId, event?.desc || '');

    this.panel.classList.remove('hidden');
  }

  private async loadCoverImage(eventId: string): Promise<void> {
    this.image.src = '';

    try {
      const jpgRes = await fetch(`/events/${eventId}/cover.jpg`, { method: 'HEAD' });
      if (jpgRes.ok) {
        this.image.src = `/events/${eventId}/cover.jpg`;
        return;
      }

      const pngRes = await fetch(`/events/${eventId}/cover.png`, { method: 'HEAD' });
      if (pngRes.ok) {
        this.image.src = `/events/${eventId}/cover.png`;
      }
    } catch (e) {
      // No cover image
    }
  }

  private async loadContent(eventId: string, defaultDesc: string): Promise<void> {
    this.textEl.innerHTML = `<p>${defaultDesc}</p>`;
    this.galleryEl.innerHTML = '';
    this.images = [];

    try {
      const res = await fetch(`/events/${eventId}/`);
      if (res.ok) {
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');

        // Load content
        const content = doc.querySelector('.content') || doc.querySelector('article');
        if (content) {
          this.textEl.innerHTML = content.innerHTML;
        }

        // Load gallery from data attribute
        const gallerySection = doc.querySelector('.gallery');
        if (gallerySection) {
          const filesData = gallerySection.getAttribute('data-files');
          if (filesData) {
            const files: GalleryFile[] = JSON.parse(filesData);
            this.renderGallery(files);
          }
        }
      }
    } catch (e) {
      // Keep default description
    }
  }

  private renderGallery(files: GalleryFile[]): void {
    if (files.length === 0) {
      this.galleryEl.innerHTML = '';
      return;
    }

    this.images = files.filter(f => f.type === 'image');

    const html = `
      <h4>Documents & Images</h4>
      <div class="detail-gallery-grid">
        ${files.map((file, index) => {
          if (file.type === 'image') {
            const imgIndex = this.images.findIndex(img => img.url === file.url);
            return `
              <div class="detail-gallery-item" data-type="image" data-index="${imgIndex}">
                <img src="${file.url}" alt="${file.name}" loading="lazy" />
                <span class="file-name">${file.name}</span>
              </div>
            `;
          } else if (file.type === 'pdf') {
            return `
              <a href="${file.url}" class="detail-gallery-item" data-type="pdf" target="_blank">
                <div class="file-icon">📄</div>
                <span class="file-name">${file.name}</span>
              </a>
            `;
          } else {
            return `
              <a href="${file.url}" class="detail-gallery-item" data-type="other" target="_blank">
                <div class="file-icon">📁</div>
                <span class="file-name">${file.name}</span>
              </a>
            `;
          }
        }).join('')}
      </div>
    `;

    this.galleryEl.innerHTML = html;

    // Add click handlers for images
    this.galleryEl.querySelectorAll('.detail-gallery-item[data-type="image"]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt((item as HTMLElement).dataset.index || '0', 10);
        this.openLightbox(index);
      });
    });
  }

  private openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.showImage(index);
    this.lightbox.classList.add('active');
  }

  private closeLightbox(): void {
    this.lightbox.classList.remove('active');
  }

  private showImage(index: number): void {
    if (this.images[index]) {
      this.lightboxImg.src = this.images[index].url;
      this.lightboxCaption.textContent = this.images[index].name;
    }
  }

  private showPrevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.showImage(this.currentImageIndex);
  }

  private showNextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.showImage(this.currentImageIndex);
  }

  hide(): void {
    this.panel.classList.add('hidden');
  }

  isVisible(): boolean {
    return !this.panel.classList.contains('hidden');
  }
}
