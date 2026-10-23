import { Component, EventEmitter, Input, Output, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalDbService, CardData } from '../../../../core/infrastructure/local-db.service';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-subscription-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-backdrop" (mousedown)="close.emit()">
      <div class="modal" (mousedown)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()">
          <app-icon name="close"></app-icon>
        </button>

        @if (step() === 'select') {
          <p class="eyebrow">PLANES DISPONIBLES</p>
          <h2>Elige un nuevo plan</h2>
          <div class="plans-list">
            <div class="plan-item card" (click)="pickPlan('Familiar Plus', 18.99)">
              <h3>Familiar Plus</h3>
              <p>1 adulto mayor + 10 cuidadores adicionales</p>
              <strong>PEN 18,99 <small>/mes</small></strong>
              <button class="primary-btn">Seleccionar plan</button>
            </div>
            <div class="plan-item card" (click)="pickPlan('Familiar Premium', 29.99)">
              <h3>Familiar Premium</h3>
              <p>1 adulto mayor + cuidadores ilimitados</p>
              <strong>PEN 29,99 <small>/mes</small></strong>
              <button class="primary-btn">Seleccionar plan</button>
            </div>
          </div>
        }

        @if (step() === 'confirm-saved') {
          <p class="eyebrow">CONFIRMAR CAMBIO</p>
          <h2>¿Está seguro de que desea cambiar de plan?</h2>
          <p class="modal-sub">
            Se cambiará tu suscripción a <strong>{{ selectedPlan }}</strong> por
            <strong>PEN {{ selectedPrice }} / mes</strong> usando tu tarjeta guardada terminada en
            •••• {{ db.currentUser()?.subscription?.savedCard?.cardNumber?.slice(-4) }}.
          </p>
          <div class="btn-row">
            <button class="primary-btn full-btn" (click)="applyUpgradeWithExistingCard()">
              Sí, cambiar plan
            </button>
            <button class="wide-secondary full-btn" (click)="step.set('select')">No, volver</button>
          </div>
        }

        @if (step() === 'checkout') {
          <p class="eyebrow">CONFIRMAR ORDEN</p>
          <h2>{{ mode === 'update-card' ? 'Actualizar método de pago' : selectedPlan }}</h2>

          @if (mode !== 'update-card') {
            <div class="order-summary">
              <div class="sum-row">
                <span>Precio mensual</span><strong>PEN {{ selectedPrice }}</strong>
              </div>
              <label
                >Código promocional
                <input type="text" placeholder="Ingresa tu cupón" />
              </label>
              <div class="sum-row total">
                <span>Total mensual</span><strong>PEN {{ selectedPrice }}</strong>
              </div>
            </div>
          }

          <form class="form" (ngSubmit)="submitCard()">
            <h3>Datos de facturación</h3>
            <label
              >Nombre y apellido del titular
              <input type="text" [(ngModel)]="card.holderName" name="hname" required />
            </label>
            <label
              >Dirección de facturación
              <input type="text" [(ngModel)]="card.billingAddress" name="baddr" required />
            </label>

            <h3>Datos de la tarjeta</h3>
            <label
              >Número de tarjeta
              <input
                type="text"
                [(ngModel)]="card.cardNumber"
                name="cnum"
                maxlength="16"
                placeholder="4111222233334444"
                required
              />
            </label>
            <div class="two-inputs">
              <label
                >Fecha de vencimiento
                <input
                  type="text"
                  [(ngModel)]="card.expDate"
                  name="edate"
                  placeholder="MM/AA"
                  maxlength="5"
                  required
                />
              </label>
              <label
                >CVV
                <input type="password" [(ngModel)]="card.cvv" name="cvv" maxlength="4" required />
              </label>
            </div>

            <button type="submit" class="primary-btn full-btn">
              {{ mode === 'update-card' ? 'Guardar y reemplazar tarjeta' : 'Completar compra' }}
            </button>
            <button type="button" class="link-danger-btn" (click)="close.emit()">
              Cancelar compra
            </button>
          </form>
        }

        @if (step() === 'success') {
          <div class="success-box">
            <div class="check-icon"><app-icon name="check" [size]="38"></app-icon></div>
            <h2>¡Se ha completado la compra con éxito!</h2>
            <p>Actualizando tus datos de cuenta...</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .plans-list {
        display: grid;
        gap: 14px;
        margin-top: 16px;
      }
      .plan-item {
        cursor: pointer;
        border: 1px solid var(--line);
        transition: 0.2s;
      }
      .plan-item:hover {
        border-color: var(--accent);
      }
      .order-summary {
        background: #f8faf9;
        padding: 14px;
        border-radius: 10px;
        margin: 15px 0;
      }
      .sum-row {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin-bottom: 8px;
      }
      .sum-row.total {
        border-top: 1px solid var(--line);
        padding-top: 8px;
        font-weight: 700;
        font-size: 15px;
      }
      .two-inputs {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }
      .full-btn {
        width: 100%;
        margin-top: 12px;
      }
      .link-danger-btn {
        display: block;
        width: 100%;
        border: 0;
        background: transparent;
        color: #a84936;
        margin-top: 10px;
        font-weight: 600;
        font-size: 11px;
      }
      .success-box {
        text-align: center;
        padding: 30px 10px;
      }
      .check-icon {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: #dcfce7;
        color: #166534;
        display: grid;
        place-items: center;
        margin: 0 auto 16px;
      }
      .btn-row {
        display: flex;
        gap: 10px;
        margin-top: 20px;
      }
    `,
  ],
})
export class SubscriptionModalComponent implements OnInit {
  @Input() mode: 'upgrade' | 'update-card' = 'upgrade';
  @Output() close = new EventEmitter<void>();

  db = inject(LocalDbService);
  step = signal<'select' | 'confirm-saved' | 'checkout' | 'success'>('select');

  selectedPlan: 'Familiar Plus' | 'Familiar Premium' = 'Familiar Premium';
  selectedPrice = 29.99;

  card: CardData = {
    holderName: '',
    billingAddress: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  };

  ngOnInit(): void {
    if (this.mode === 'update-card') {
      this.step.set('checkout');
    }
  }

  pickPlan(plan: 'Familiar Plus' | 'Familiar Premium', price: number): void {
    this.selectedPlan = plan;
    this.selectedPrice = price;

    const user = this.db.currentUser();
    if (user?.subscription.savedCard) {
      this.step.set('confirm-saved');
    } else {
      this.step.set('checkout');
    }
  }

  applyUpgradeWithExistingCard(): void {
    const user = this.db.currentUser();
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);

    this.db.updateSubscription({
      planType: this.selectedPlan,
      priceMonthly: this.selectedPrice,
      currency: 'PEN',
      renewalDate: renewal.toISOString(),
      isCancelled: false,
      savedCard: user?.subscription.savedCard,
    });

    this.finishAndReload();
  }

  submitCard(): void {
    const renewal = new Date();
    renewal.setMonth(renewal.getMonth() + 1);

    const user = this.db.currentUser();
    const planToSave =
      this.mode === 'update-card'
        ? user?.subscription.planType || 'Familiar Premium'
        : this.selectedPlan;

    const priceToSave =
      this.mode === 'update-card' ? user?.subscription.priceMonthly || 29.99 : this.selectedPrice;

    this.db.updateSubscription({
      planType: planToSave as any,
      priceMonthly: priceToSave,
      currency: 'PEN',
      renewalDate: renewal.toISOString(),
      isCancelled: false,
      savedCard: { ...this.card },
    });

    this.finishAndReload();
  }

  private finishAndReload(): void {
    this.step.set('success');
    setTimeout(() => {
      window.location.reload();
    }, 1800);
  }
}
