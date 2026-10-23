import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, ChildrenOutletContexts } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/presentation/components/sidebar/sidebar.component';
import { HeaderComponent } from './shared/presentation/components/header/header.component';
import { BottomNavComponent } from './shared/presentation/components/bottom-nav/bottom-nav.component';
import { fadeRouteAnimation } from './shared/animations/route-animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, BottomNavComponent],
  animations: [fadeRouteAnimation],
  template: `
    <div class="app-shell">
      <app-sidebar [isOpen]="isMobileMenuOpen()" (closeSidebar)="isMobileMenuOpen.set(false)">
      </app-sidebar>

      <main>
        <app-header (openMenu)="isMobileMenuOpen.set(true)"></app-header>

        <div class="route-wrapper" [@fadeRouteAnimation]="getRouteAnimationData()">
          <router-outlet></router-outlet>
        </div>

        <footer>
          <span>FamiCare · Cuidado que conecta</span>
          <span>Privacidad · Términos · Soporte</span>
        </footer>
      </main>

      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
})
export class App {
  private contexts = inject(ChildrenOutletContexts);
  isMobileMenuOpen = signal(false);

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
