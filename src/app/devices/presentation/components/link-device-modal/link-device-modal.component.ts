import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-link-device-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="close.emit()">
      <div class="modal" (mousedown)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()">
          <app-icon name="close"></app-icon>
        </button>

        @if (!isSuccess()) {
          <p class="eyebrow">NUEVO DISPOSITIVO</p>
          <h2>Vincular dispositivo</h2>
          <p class="modal-sub">Conecta una pulsera FamiCare a este perfil</p>

          @if (errorMessage()) {
            <div class="auth-error">{{ errorMessage() }}</div>
          }

          <form class="form" (ngSubmit)="submitCode()">
            <label
              >Código de vinculación
              <input
                type="text"
                [(ngModel)]="code"
                name="devCode"
                placeholder="0 0 0  0 0 0"
                class="code-input"
                maxlength="6"
                pattern="[0-9]*"
                required
              />
            </label>

            <div class="qr-box">
              <div class="qr-icon-wrapper">
                <app-icon name="watch" [size]="24"></app-icon>
              </div>
              <span>También puedes escanear el código QR</span>
            </div>

            <button type="submit" class="primary-btn full-btn">Vincular dispositivo</button>
          </form>
        } @else {
          <div class="success-box">
            <div class="check-icon">
              <app-icon name="check" [size]="36"></app-icon>
            </div>
            <h2>Has añadido un dispositivo</h2>
            <p>Ya puedes comenzar a utilizarlo</p>
            <button class="primary-btn full-btn" (click)="close.emit()">OK</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .code-input {
        font-size: 26px;
        letter-spacing: 10px;
        text-align: center;
        font-weight: 700;
        color: #23342d;
      }
      .qr-box {
        border: 1px dashed #b9c8c0;
        background: #f8faf9;
        border-radius: 12px;
        padding: 15px;
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 11px;
        color: var(--muted);
      }
      .qr-icon-wrapper {
        width: 38px;
        height: 38px;
        border-radius: 8px;
        background: #e8f4ed;
        color: var(--forest);
        display: grid;
        place-items: center;
      }
      .full-btn {
        width: 100%;
        margin-top: 15px;
      }
      .auth-error {
        background: #fee2e2;
        color: #991b1b;
        padding: 10px 14px;
        border-radius: 8px;
        font-size: 11px;
        margin-bottom: 12px;
      }
      .success-box {
        text-align: center;
        padding: 25px 10px;
      }
      .check-icon {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        background: #dcfce7;
        color: #166534;
        display: grid;
        place-items: center;
        margin: 0 auto 16px;
      }
    `,
  ],
})
export class LinkDeviceModalComponent {
  @Output() close = new EventEmitter<void>();

  private db = inject(LocalDbService);
  code = '';
  errorMessage = signal('');
  isSuccess = signal(false);

  submitCode(): void {
    const clean = this.code.trim();
    if (!/^\d{6}$/.test(clean)) {
      this.errorMessage.set('El código debe ser de exactamente 6 dígitos numéricos.');
      return;
    }

    if (this.db.VALID_NUMERIC_CODES.includes(clean)) {
      this.db.addDeviceToCurrentUser(clean);
      this.errorMessage.set('');
      this.isSuccess.set(true);
    } else {
      this.errorMessage.set('Código inválido. Prueba uno válido como 204800 o 100100.');
    }
  }
}
