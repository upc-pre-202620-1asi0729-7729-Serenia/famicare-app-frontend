import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/presentation/components/icon/icon.component';

@Component({
  selector: 'app-account-view',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="content">
      <div class="page-heading inner">
        <div>
          <p class="eyebrow">Configuración</p>
          <h1>Cuenta y suscripción</h1>
          <p>Administra tu perfil, familiares y plan</p>
        </div>
      </div>

      <div class="two-col account">
        <section class="card">
          <h3>Datos de cuenta</h3>
          <div class="account-profile">
            <div class="avatar big">VR</div>
            <div>
              <strong>Valeria Ríos</strong>
              <span>valeria.rios&#64;email.com</span>
            </div>
            <button class="outline-btn">Editar</button>
          </div>
          <hr />
          <h3>Adultos mayores asignados</h3>
          <div class="assigned">
            <div class="avatar elder">EM</div>
            <div>
              <strong>Elena Martínez</strong>
              <span>78 años · Perfil principal</span>
            </div>
            <app-icon name="arrow"></app-icon>
          </div>
        </section>

        <section class="card plan-card">
          <span class="status-pill safe">PLAN ACTIVO</span>
          <h2>Familiar Premium</h2>
          <p>1 adulto mayor + cuidadores ilimitados</p>
          <strong class="price">29,90 €<small>/mes</small></strong>
          <div class="renew">
            <app-icon name="check"></app-icon> Se renovará el 15 de noviembre de 2026
          </div>
          <div class="payment">
            <span>VISA</span>
            <div><strong>•••• 4321</strong><small>Vence 08/28</small></div>
            <button class="text-btn">Actualizar</button>
          </div>
          <button class="primary-btn">Cambiar de plan</button>
          <button class="link-danger">Cancelar suscripción</button>
        </section>
      </div>
    </div>
  `,
})
export class AccountViewComponent {}
