import { Component, inject } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { fadeRouteAnimation } from './shared/animations/route-animations';
import { SidebarComponent } from './shared/presentation/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  animations: [fadeRouteAnimation],
  template: `
    <div class="app-shell">
      <app-sidebar></app-sidebar>
      <main>
        <div [@fadeRouteAnimation]="getRouteAnimationData()">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
})
export class AppComponent {
  private contexts = inject(ChildrenOutletContexts);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
