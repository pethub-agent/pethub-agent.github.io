import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { delay, Observable, of, tap } from 'rxjs';
import { LazyLoadComponent } from './lazy-load/lazy-load.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LazyLoadComponent, RouterOutlet, CommonModule],
  template: `
    <router-outlet></router-outlet>
    <style>
      .ctx {
        display: flex;
        gap: 20px;
      }
      .ctx section {
        padding: 18px;
        border: 1px solid black;
        border-radius: 5%;
      }
    </style>
    <h1>Meu app angular</h1>
    <main class="ctx">
      <section>
        <h2>Combine</h2>
        <button #btn (click)="loadData()">Interaction</button>

        @defer (when loadData) {
        <app-lazy-load></app-lazy-load>
        } @placeholder {

        <div class="skeleton-loader">placeholder</div>
        } @loading {
        <div class="skeleton-loader">loader</div>
        }
      </section>
      <section>
        <h2>viewport</h2>
        @defer (on viewport) {
        <app-lazy-load></app-lazy-load>
        } @placeholder {
        <div class="skeleton-loader">loader</div>
        }
      </section>

      <section>
        <h2>hover</h2>

        @defer (on hover) {
        <app-lazy-load></app-lazy-load>
        }@placeholder {
        <p>Componente não foi carregado</p>
        }@loading (minimum 1s) {
        <p>Carregando componente...</p>
        }@error {
        <p>Ocorreu um erro ao carregar o componente.</p>
        }
      </section>
      <section>
        <h2>When</h2>
        <button (click)="showComponent = true">Carregar Componente</button>

        @defer (when showComponent) {
        <app-lazy-load></app-lazy-load>
        }@placeholder {
        <p>Componente não foi carregado</p>
        }@loading {
        <p>Carregando componente...</p>
        }@error {
        <p>Ocorreu um erro ao carregar o componente.</p>
        }
      </section>
    </main>
  `,
})
export class AppComponent {
  showComponent = false;
  loaded = false;

  loadData(): Observable<boolean> {
    return of(true).pipe(
      delay(2000),
      tap(() => alert('ok'))
    );
  }
}
