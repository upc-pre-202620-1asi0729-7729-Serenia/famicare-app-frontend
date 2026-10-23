import {
  Component,
  AfterViewInit,
  OnDestroy,
  Input,
  effect,
  inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';

declare const L: any;

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [CommonModule],
  template: ` <div #mapContainer [class]="'map-box ' + (large ? 'map-large' : '')"></div> `,
  styles: [
    `
      .map-box {
        width: 100%;
        height: 250px;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--line);
        position: relative;
      }
      .map-large {
        height: 540px;
      }
    `,
  ],
})
export class LeafletMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;
  @Input() large = false;

  private db = inject(LocalDbService);
  private map: any;
  private circleLayers: any[] = [];
  private marker: any;

  constructor() {
    effect(() => {
      const zones = this.db.safeZones();
      if (this.map) {
        this.renderZones(zones);
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof L === 'undefined') return;

    const lat = 40.4168;
    const lng = -3.7038;

    this.map = L.map(this.mapContainer.nativeElement, {
      zoomControl: false,
      attributionControl: false,
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    const customIcon = L.divIcon({
      className: 'famicare-marker',
      html: `
        <div style="background:#0F291E;color:white;width:36px;height:36px;border-radius:50% 50% 50% 6px;transform:rotate(-45deg);display:grid;place-items:center;border:2px solid #FFFFFF;box-shadow:0 4px 10px rgba(0,0,0,0.35);">
          <span style="transform:rotate(45deg);font-size:12px;font-weight:700;">EM</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });

    this.marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);
    this.renderZones(this.db.safeZones());

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 250);
  }

  private renderZones(zones: any[]): void {
    if (!this.map) return;
    this.circleLayers.forEach((l) => this.map.removeLayer(l));
    this.circleLayers = [];

    zones.forEach((z) => {
      if (z.isActive) {
        const circle = L.circle([z.lat, z.lng], {
          color: '#39A86D',
          weight: 2,
          fillColor: '#39A86D',
          fillOpacity: 0.18,
          radius: z.radiusMeters,
        }).addTo(this.map);
        this.circleLayers.push(circle);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
