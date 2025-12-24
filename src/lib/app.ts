// Main app - ties together map, timeline, and detail panel

import 'maplibre-gl/dist/maplibre-gl.css';
import { MapManager } from './map-manager';
import { DetailPanel } from './detail-panel';

interface EventData {
  id: string;
  title: string;
  desc: string;
  year: number;
  end: number | null;
}

export function initApp(eventData: EventData[]): void {
  const mapManager = new MapManager('map');
  let detailPanel: DetailPanel;
  let activeEventId: string | null = null;

  mapManager.onLoad(async () => {
    await mapManager.loadTracedLayers();
    detailPanel = new DetailPanel();

    setupEventHandlers();
    mapManager.updateSlider(0); // Start at Victorian
  });

  function setupEventHandlers(): void {
    // Traced layer toggles
    document.querySelectorAll('.traced-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const era = (btn as HTMLElement).dataset.traced!;
        mapManager.toggleTracedLayer(era);
        updateTracedButtons();
      });
    });

    // Slider
    const slider = document.getElementById('os-slider') as HTMLInputElement;
    slider?.addEventListener('input', () => {
      mapManager.updateSlider(parseInt(slider.value));
    });

    // Timeline events
    document.querySelectorAll('.event').forEach(el => {
      el.addEventListener('click', () => selectEvent(el as HTMLElement));
    });

    // Panel controls
    document.getElementById('close-panel')?.addEventListener('click', () => {
      detailPanel.hide();
    });

    document.getElementById('prev-event')?.addEventListener('click', () => navEvent(-1));
    document.getElementById('next-event')?.addEventListener('click', () => navEvent(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        navEvent(-1);
      } else if (e.key === 'ArrowRight') {
        navEvent(1);
      }
    });
  }

  function updateTracedButtons(): void {
    document.querySelectorAll('.traced-btn').forEach(btn => {
      const era = (btn as HTMLElement).dataset.traced!;
      btn.classList.toggle('active', mapManager.activeTraced.has(era));
    });
  }

  async function selectEvent(el: HTMLElement): Promise<void> {
    const id = el.dataset.id!;
    const year = parseInt(el.dataset.year!);

    // Update active state
    document.querySelectorAll('.event').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    activeEventId = id;

    // Update URL hash
    history.pushState(null, '', `#${id}`);

    // Update base map to appropriate era
    const sliderValue = getSliderValueForYear(year);
    const slider = document.getElementById('os-slider') as HTMLInputElement;
    if (slider) {
      slider.value = String(sliderValue);
      mapManager.updateSlider(sliderValue);
    }

    // Set marker
    await mapManager.setMarker(id);

    // Show panel
    await detailPanel.show(id, year, eventData);
  }

  function getSliderValueForYear(year: number): number {
    if (year < 1940) return 0;       // Victorian 1890s
    if (year < 1990) return 33;      // 1940s
    if (year < 2014) return 66;      // 2014 aerial
    return 100;                       // Modern
  }

  function navEvent(direction: number): void {
    const events = Array.from(document.querySelectorAll('.event'));
    const currentIndex = events.findIndex(e => (e as HTMLElement).dataset.id === activeEventId);
    const newIndex = Math.max(0, Math.min(events.length - 1, currentIndex + direction));

    if (newIndex !== currentIndex) {
      const el = events[newIndex] as HTMLElement;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      selectEvent(el);
    }
  }
}
