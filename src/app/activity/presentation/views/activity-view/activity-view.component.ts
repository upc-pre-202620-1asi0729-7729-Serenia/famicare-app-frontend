import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../../shared/services/i18n.service';

@Component({
  selector: 'app-activity-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">{{ i18n.t('activity.eyebrow') }}</p>
          <h1>{{ i18n.t('activity.title') }}</h1>
          <p>{{ i18n.t('activity.subtitle') }}</p>
        </div>
        <button class="primary-btn">{{ i18n.t('activity.exportPdf') }}</button>
      </div>

      <div class="two-col">
        <section class="card chart-card">
          <h3>{{ i18n.t('activity.chartTitle') }}</h3>
          <p>{{ i18n.t('activity.chartSub') }}</p>
          <div class="bars">
            @for (bar of bars; track bar.key) {
              <div>
                <span [style.height.%]="bar.percent"></span>
                <small>{{ i18n.t(bar.key) }}</small>
              </div>
            }
          </div>
        </section>

        <section class="card routine-card">
          <h3>{{ i18n.t('activity.routinesTitle') }}</h3>
          <div>
            <span>{{ i18n.t('activity.activeTime') }}</span>
            <strong>4 h 24 min</strong>
            <small>+8%</small>
          </div>
          <div>
            <span>{{ i18n.t('activity.estimatedRest') }}</span>
            <strong>8 h 12 min</strong>
            <small>{{ i18n.t('activity.normal') }}</small>
          </div>
          <div>
            <span>{{ i18n.t('activity.outings') }}</span>
            <strong>12</strong>
            <small>{{ i18n.t('activity.thisWeek') }}</small>
          </div>
          <div>
            <span>{{ i18n.t('activity.unusualInactivity') }}</span>
            <strong>{{ i18n.t('activity.unusualEventCount') }}</strong>
            <small>{{ i18n.t('activity.reviewed') }}</small>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ActivityViewComponent {
  i18n = inject(I18nService);

  bars = [
    { key: 'day.mon', percent: 52 },
    { key: 'day.tue', percent: 68 },
    { key: 'day.wed', percent: 44 },
    { key: 'day.thu', percent: 82 },
    { key: 'day.fri', percent: 62 },
    { key: 'day.sat', percent: 38 },
    { key: 'day.sun', percent: 72 },
  ];
}
