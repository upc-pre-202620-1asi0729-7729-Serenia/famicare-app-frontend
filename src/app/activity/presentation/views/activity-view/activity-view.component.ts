import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Resumen semanal</p>
          <h1>Actividad y rutinas</h1>
          <p>Tendencias de movilidad y descanso</p>
        </div>
        <button class="primary-btn">Exportar PDF</button>
      </div>

      <div class="two-col">
        <section class="card chart-card">
          <h3>Actividad semanal</h3>
          <p>Promedio de 4.260 pasos diarios</p>
          <div class="bars">
            @for (bar of bars; track bar.day) {
              <div>
                <span [style.height.%]="bar.percent"></span>
                <small>{{ bar.day }}</small>
              </div>
            }
          </div>
        </section>

        <section class="card routine-card">
          <h3>Resumen de rutinas</h3>
          <div><span>Tiempo activo</span><strong>4 h 24 min</strong><small>+8%</small></div>
          <div><span>Descanso estimado</span><strong>8 h 12 min</strong><small>Normal</small></div>
          <div><span>Salidas detectadas</span><strong>12</strong><small>Esta semana</small></div>
          <div>
            <span>Inactividad inusual</span><strong>1 evento</strong><small>Revisado</small>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class ActivityViewComponent {
  bars = [
    { day: 'L', percent: 52 },
    { day: 'M', percent: 68 },
    { day: 'X', percent: 44 },
    { day: 'J', percent: 82 },
    { day: 'V', percent: 62 },
    { day: 'S', percent: 38 },
    { day: 'D', percent: 72 },
  ];
}
