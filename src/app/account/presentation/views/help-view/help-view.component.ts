import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-help-view',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Soporte FamiCare</p>
          <h1>¿En qué podemos ayudarte hoy?</h1>
          <p>Encuentra respuestas o habla con nuestro equipo</p>
        </div>
      </div>

      <div class="help-search">
        <app-icon name="search"></app-icon>
        <input type="text" placeholder="Buscar guías, preguntas o temas..." />
      </div>

      <div class="two-col help-grid">
        <section class="card faq">
          <h3>Preguntas frecuentes</h3>
          @for (q of questions; track q; let i = $index) {
            <button (click)="toggle(i)">
              <span>{{ q }}</span>
              <b>{{ openIndex() === i ? '−' : '+' }}</b>
              @if (openIndex() === i) {
                <p>
                  Desde la configuración correspondiente puedes revisar esta opción paso a paso. Si
                  necesitas ayuda, nuestro equipo está disponible las 24 horas.
                </p>
              }
            </button>
          }
        </section>

        <section class="support-box">
          <span>ATENCIÓN 24/7</span>
          <h2>Estamos para ayudarte</h2>
          <p>Habla con una persona de nuestro equipo de cuidado cuando lo necesites.</p>
          <button class="primary-btn">Contactar por chat</button>
          <button class="outline-light">Línea telefónica de asistencia</button>
          <small>Términos y condiciones del servicio</small>
        </section>
      </div>
    </div>
  `,
})
export class HelpViewComponent {
  openIndex = signal<number>(0);
  questions = [
    'Cómo calibrar la pulsera inteligente',
    '¿Qué hacer si una alerta de pánico no se silencia?',
    'Cómo invitar a un médico o enfermera temporal',
    'Configuración de geocercas y precisión GPS',
  ];

  toggle(index: number): void {
    this.openIndex.update((cur) => (cur === index ? -1 : index));
  }
}
