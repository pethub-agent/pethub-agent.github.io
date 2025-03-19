import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { JwtModule } from '@auth0/angular-jwt';
import { provideTransloco } from '@jsverse/transloco';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { TranslocoHttpLoader } from './core/providers/transloco-loader/transloco-loader';
import { StorageKeys } from './core/services/storage/storage.enum';
import { StorageService } from './core/services/storage/storage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideTransloco({
      config: {
        availableLangs: ['pt-BR', 'en'],
        defaultLang: 'pt-BR',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    // Aplicação PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            const storage = inject(StorageService);
            return storage.get(StorageKeys.token);
          },
          allowedDomains: [environment.apiUrl, 'localhost:3000'],
          disallowedRoutes: [
            environment.apiUrl + 'login',
            environment.apiUrl + 'register',
          ],
        },
      })
    ),
  ],
};
