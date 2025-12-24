// Detail panel management

interface EventData {
  id: string;
  title: string;
  desc: string;
  year: number;
  end: number | null;
  author: string | null;
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
  private authorEl: HTMLElement;
  private authorNameEl: HTMLElement;
  private textEl: HTMLElement;
  private galleryEl: HTMLElement;
  private lightbox: HTMLElement;
  private lightboxImg: HTMLImageElement;
  private lightboxIframe: HTMLIFrameElement;
  private lightboxCaption: HTMLElement;
  private galleryItems: GalleryFile[] = [];
  private currentItemIndex = 0;

  constructor() {
    this.panel = document.getElementById('detail-panel')!;
    this.image = document.getElementById('detail-image') as HTMLImageElement;
    this.yearEl = document.getElementById('detail-year')!;
    this.titleEl = document.getElementById('detail-title')!;
    this.authorEl = document.getElementById('detail-author')!;
    this.authorNameEl = this.authorEl.querySelector('.author-name')!;
    this.textEl = document.getElementById('detail-text')!;
    this.galleryEl = document.getElementById('detail-gallery')!;
    this.lightbox = document.getElementById('detail-lightbox')!;
    this.lightboxImg = this.lightbox.querySelector('img')!;
    this.lightboxIframe = this.lightbox.querySelector('iframe')!;
    this.lightboxCaption = this.lightbox.querySelector('.lightbox-caption')!;

    this.setupLightbox();
    this.setupCoverImageClick();
  }

  private setupCoverImageClick(): void {
    this.image.addEventListener('click', () => {
      // Find the cover image in galleryItems
      const coverIndex = this.galleryItems.findIndex(item =>
        item.url.includes('cover.') && item.type === 'image'
      );
      if (coverIndex >= 0) {
        this.openLightbox(coverIndex);
      } else if (this.image.src) {
        // Fallback: show the cover image directly
        this.lightboxImg.src = this.image.src;
        this.lightboxIframe.src = '';
        this.lightbox.dataset.type = 'image';
        this.lightboxCaption.textContent = 'Cover image';
        this.lightbox.classList.add('active');
      }
    });
    this.image.style.cursor = 'pointer';
  }

  private setupLightbox(): void {
    const closeBtn = this.lightbox.querySelector('.lightbox-close');
    const prevBtn = this.lightbox.querySelector('.lightbox-prev');
    const nextBtn = this.lightbox.querySelector('.lightbox-next');

    closeBtn?.addEventListener('click', () => this.closeLightbox());
    prevBtn?.addEventListener('click', () => this.showPrevItem());
    nextBtn?.addEventListener('click', () => this.showNextItem());

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('active')) return;
      // Stop propagation to prevent event navigation while lightbox is open
      e.stopPropagation();
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.showPrevItem();
      if (e.key === 'ArrowRight') this.showNextItem();
    });
  }

  async show(eventId: string, year: number, eventData: EventData[]): Promise<void> {
    const event = eventData.find(e => e.id === eventId);

    // Display year range if end date exists
    if (event?.end) {
      this.yearEl.textContent = `${year} - ${event.end}`;
    } else {
      this.yearEl.textContent = String(year);
    }
    this.titleEl.textContent = event?.title || eventId;

    // Display author if present
    if (event?.author) {
      this.authorNameEl.textContent = event.author;
      this.authorEl.classList.remove('hidden');
    } else {
      this.authorNameEl.textContent = '';
      this.authorEl.classList.add('hidden');
    }

    // Load cover image
    await this.loadCoverImage(eventId);

    // Load content and gallery
    await this.loadContent(eventId, event?.desc || '');

    this.panel.classList.remove('hidden');
  }

  private async loadCoverImage(eventId: string): Promise<void> {
    this.image.src = '';

    try {
      const webpRes = await fetch(`/events/${eventId}/cover.webp`, { method: 'HEAD' });
      if (webpRes.ok) {
        this.image.src = `/events/${eventId}/cover.webp`;
        return;
      }

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
    this.galleryItems = [];

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

    // Store images and PDFs for lightbox navigation
    this.galleryItems = files.filter(f => f.type === 'image' || f.type === 'pdf');

    const html = `
      <h4>Documents & Images</h4>
      <div class="detail-gallery-grid">
        ${files.map((file) => {
          if (file.type === 'image') {
            const itemIndex = this.galleryItems.findIndex(item => item.url === file.url);
            return `
              <div class="detail-gallery-item" data-type="image" data-index="${itemIndex}">
                <img src="${file.url}" alt="${file.name}" loading="lazy" />
                <span class="file-name">${file.name}</span>
              </div>
            `;
          } else if (file.type === 'pdf') {
            const itemIndex = this.galleryItems.findIndex(item => item.url === file.url);
            return `
              <div class="detail-gallery-item" data-type="pdf" data-index="${itemIndex}">
                <div class="file-icon">📄</div>
                <span class="file-name">${file.name}</span>
              </div>
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

    // Add click handlers for images and PDFs
    this.galleryEl.querySelectorAll('.detail-gallery-item[data-type="image"], .detail-gallery-item[data-type="pdf"]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const index = parseInt((item as HTMLElement).dataset.index || '0', 10);
        this.openLightbox(index);
      });
    });
  }

  private openLightbox(index: number): void {
    this.currentItemIndex = index;
    this.showItem(index);
    this.lightbox.classList.add('active');
  }

  private closeLightbox(): void {
    this.lightbox.classList.remove('active');
    // Clear iframe src to stop any PDF loading
    this.lightboxIframe.src = '';
  }

  private showItem(index: number): void {
    const item = this.galleryItems[index];
    if (!item) return;

    // Set data-type attribute to control which element is visible
    this.lightbox.dataset.type = item.type;
    this.lightboxCaption.textContent = item.name;

    if (item.type === 'image') {
      this.lightboxImg.src = item.url;
      this.lightboxIframe.src = '';
    } else if (item.type === 'pdf') {
      this.lightboxImg.src = '';
      this.lightboxIframe.src = item.url;
    }
  }

  private showPrevItem(): void {
    this.currentItemIndex = (this.currentItemIndex - 1 + this.galleryItems.length) % this.galleryItems.length;
    this.showItem(this.currentItemIndex);
  }

  private showNextItem(): void {
    this.currentItemIndex = (this.currentItemIndex + 1) % this.galleryItems.length;
    this.showItem(this.currentItemIndex);
  }

  hide(): void {
    this.panel.classList.add('hidden');
  }

  isVisible(): boolean {
    return !this.panel.classList.contains('hidden');
  }
}
