import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./monitoring/presentation/views/dashboard-view/dashboard-view.component').then(
        (m) => m.DashboardViewComponent,
      ),
    data: { animation: 'DashboardPage' },
  },
  {
    path: 'monitoring/location',
    loadComponent: () =>
      import('./monitoring/presentation/views/location-view/location-view.component').then(
        (m) => m.LocationViewComponent,
      ),
    data: { animation: 'LocationPage' },
  },
  {
    path: 'monitoring/safe-zones',
    loadComponent: () =>
      import('./monitoring/presentation/views/safe-zones-view/safe-zones-view.component').then(
        (m) => m.SafeZonesViewComponent,
      ),
    data: { animation: 'SafeZonesPage' },
  },
  {
    path: 'alerts',
    loadComponent: () =>
      import('./alerts/presentation/views/alerts-view/alerts-view.component').then(
        (m) => m.AlertsViewComponent,
      ),
    data: { animation: 'AlertsPage' },
  },
  {
    path: 'care-network',
    loadComponent: () =>
      import('./care-network/presentation/views/care-network-view/care-network-view.component').then(
        (m) => m.CareNetworkViewComponent,
      ),
    data: { animation: 'CareNetworkPage' },
  },
  {
    path: 'activity',
    loadComponent: () =>
      import('./activity/presentation/views/activity-view/activity-view.component').then(
        (m) => m.ActivityViewComponent,
      ),
    data: { animation: 'ActivityPage' },
  },
  {
    path: 'devices',
    loadComponent: () =>
      import('./devices/presentation/views/devices-view/devices-view.component').then(
        (m) => m.DevicesViewComponent,
      ),
    data: { animation: 'DevicesPage' },
  },
  {
    path: 'account',
    loadComponent: () =>
      import('./account/presentation/views/account-view/account-view.component').then(
        (m) => m.AccountViewComponent,
      ),
    data: { animation: 'AccountPage' },
  },
  {
    path: 'help',
    loadComponent: () =>
      import('./account/presentation/views/help-view/help-view.component').then(
        (m) => m.HelpViewComponent,
      ),
    data: { animation: 'HelpPage' },
  },
  { path: '**', redirectTo: '' },
];
