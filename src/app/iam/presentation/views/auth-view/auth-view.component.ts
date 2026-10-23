import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalDbService } from '../../../../core/infrastructure/local-db.service';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-auth-view',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card card">
        <div class="logo-box">
          <div class="logo-mark"><app-icon name="pulse" [size]="24"></app-icon></div>
          <h2>Fami<span>Care</span></h2>
        </div>

        <div class="auth-tabs">
          <button [class.active]="isLogin()" (click)="switchTab(true)">Iniciar sesión</button>
          <button [class.active]="!isLogin()" (click)="switchTab(false)">Registrarse</button>
        </div>

        @if (errorMessage()) {
          <div class="auth-error">{{ errorMessage() }}</div>
        }

        @if (isLogin()) {
          <form (ngSubmit)="doLogin()" class="form">
            <label
              >Correo electrónico
              <input type="email" [(ngModel)]="loginEmail" name="email" required />
            </label>
            <label
              >Contraseña
              <input type="password" [(ngModel)]="loginPass" name="password" required />
            </label>
            <button type="submit" class="primary-btn full-btn">Acceder al panel</button>
            <small class="hint">Usuario demo: admin&#64;serenia.com / admintest</small>
          </form>
        } @else {
          <form (ngSubmit)="doRegister()" class="form">
            <div class="form-row-2">
              <label
                >Nombre
                <input type="text" [(ngModel)]="regData.firstName" name="fn" required />
              </label>
              <label
                >Apellido
                <input type="text" [(ngModel)]="regData.lastName" name="ln" required />
              </label>
            </div>
            <label
              >Correo electrónico
              <input type="email" [(ngModel)]="regData.email" name="em" required />
            </label>
            <label
              >Fecha de Nacimiento
              <input type="date" [(ngModel)]="regData.birthDate" name="bd" required />
            </label>
            <label
              >País de residencia
              <select [(ngModel)]="regData.country" name="ctry">
                @for (c of countries; track c.name) {
                  <option [value]="c.name">{{ c.flag }} {{ c.name }}</option>
                }
              </select>
            </label>
            <label
              >Número de teléfono
              <div class="phone-input-row">
                <select [(ngModel)]="selectedPrefix" name="pfx">
                  @for (c of countries; track c.name) {
                    <option [value]="c.dialCode">{{ c.flag }} {{ c.dialCode }}</option>
                  }
                </select>
                <input
                  type="tel"
                  [(ngModel)]="rawPhone"
                  name="phn"
                  placeholder="987654321"
                  required
                />
              </div>
            </label>
            <div class="form-row-2">
              <label
                >Contraseña
                <input type="password" [(ngModel)]="regData.password" name="pw1" required />
              </label>
              <label
                >Repetir contraseña
                <input type="password" [(ngModel)]="repeatPassword" name="pw2" required />
              </label>
            </div>
            <button type="submit" class="primary-btn full-btn">Crear cuenta</button>
          </form>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .auth-wrapper {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: var(--canvas);
      }
      .auth-card {
        width: 100%;
        max-width: 500px;
        padding: 32px;
      }
      .logo-box {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 24px;
        font-size: 22px;
        font-weight: 700;
      }
      .logo-box span {
        color: var(--accent);
      }
      .auth-tabs {
        display: flex;
        border-bottom: 1px solid var(--line);
        margin-bottom: 20px;
      }
      .auth-tabs button {
        flex: 1;
        border: 0;
        background: transparent;
        padding: 12px;
        font-weight: 600;
        color: var(--muted);
        border-bottom: 2px solid transparent;
      }
      .auth-tabs button.active {
        color: var(--forest);
        border-color: var(--accent);
      }
      .auth-error {
        background: #fee2e2;
        color: #991b1b;
        padding: 11px 14px;
        border-radius: 8px;
        margin-bottom: 14px;
        font-size: 12px;
      }
      .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .phone-input-row {
        display: flex;
        gap: 8px;
      }
      .phone-input-row select {
        width: 120px;
      }
      .full-btn {
        width: 100%;
        margin-top: 14px;
      }
      .hint {
        display: block;
        text-align: center;
        color: var(--muted);
        margin-top: 12px;
        font-size: 11px;
      }
    `,
  ],
})
export class AuthViewComponent implements OnInit {
  private db = inject(LocalDbService);
  private router = inject(Router);

  isLogin = signal(true);
  errorMessage = signal('');

  loginEmail = 'admin@serenia.com';
  loginPass = 'admintest';

  rawPhone = '';
  selectedPrefix = '+51';
  repeatPassword = '';
  regData = {
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    country: 'Perú',
    password: '',
  };

  countries = [
    { name: 'Perú', flag: '🇵🇪', dialCode: '+51' },
    { name: 'España', flag: '🇪🇸', dialCode: '+34' },
    { name: 'México', flag: '🇲🇽', dialCode: '+52' },
    { name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
    { name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
    { name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
    { name: 'Estados Unidos', flag: '🇺🇸', dialCode: '+1' },
  ];

  ngOnInit(): void {
    if (this.db.currentUser()) {
      this.router.navigate(['/']);
    }
  }

  switchTab(login: boolean): void {
    this.isLogin.set(login);
    this.errorMessage.set('');
  }

  doLogin(): void {
    const success = this.db.login(this.loginEmail, this.loginPass);
    if (success) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('Credenciales incorrectas o usuario inexistente.');
    }
  }

  doRegister(): void {
    if (this.regData.password !== this.repeatPassword) {
      this.errorMessage.set('Las contraseñas no coinciden.');
      return;
    }
    const success = this.db.register({
      firstName: this.regData.firstName,
      lastName: this.regData.lastName,
      email: this.regData.email,
      birthDate: this.regData.birthDate,
      country: this.regData.country,
      phone: `${this.selectedPrefix} ${this.rawPhone}`,
      password: this.regData.password,
    });

    if (success) {
      this.db.login(this.regData.email, this.regData.password);
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set('El correo ya se encuentra registrado.');
    }
  }
}
