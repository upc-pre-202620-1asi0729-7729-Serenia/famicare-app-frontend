import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-map-visual',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [class]="'map ' + (large ? 'map-large' : '')">
      <div class="road r1"></div>
      <div class="road r2"></div>
      <div class="road r3"></div>
      <div class="park">Parque<br />Castilla</div>
      <div class="map-label l1">Av. de la Ilustración</div>
      <div class="map-label l2">C. Santiago</div>
      <div class="radius">
        <div class="map-pin"><app-icon name="pin" [size]="19"></app-icon></div>
      </div>
      <div class="map-live"><span></span> En vivo</div>
      <div class="map-zoom">
        ＋
        <hr />
        −
      </div>
    </div>
  `,
})
export class MapVisualComponent {
  @Input() large = false;
}
