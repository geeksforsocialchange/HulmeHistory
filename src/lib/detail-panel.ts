// Detail panel management

interface EventData {
  id: string;
  title: string;
  desc: string;
  year: number;
}

export class DetailPanel {
  private panel: HTMLElement;
  private image: HTMLImageElement;
  private yearEl: HTMLElement;
  private titleEl: HTMLElement;
  private textEl: HTMLElement;

  constructor() {
    this.panel = document.getElementById('detail-panel')!;
    this.image = document.getElementById('detail-image') as HTMLImageElement;
    this.yearEl = document.getElementById('detail-year')!;
    this.titleEl = document.getElementById('detail-title')!;
    this.textEl = document.getElementById('detail-text')!;
  }

  async show(eventId: string, year: number, eventData: EventData[]): Promise<void> {
    const event = eventData.find(e => e.id === eventId);

    this.yearEl.textContent = String(year);
    this.titleEl.textContent = event?.title || eventId;

    // Load cover image
    await this.loadCoverImage(eventId);

    // Load content
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

    try {
      const res = await fetch(`/events/${eventId}/`);
      if (res.ok) {
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const content = doc.querySelector('.content') || doc.querySelector('article');
        if (content) {
          this.textEl.innerHTML = content.innerHTML;
        }
      }
    } catch (e) {
      // Keep default description
    }
  }

  hide(): void {
    this.panel.classList.add('hidden');
  }

  isVisible(): boolean {
    return !this.panel.classList.contains('hidden');
  }
}
