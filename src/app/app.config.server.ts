import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom  } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ReactiveFormsModule } from '@angular/forms';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    importProvidersFrom(ReactiveFormsModule) 
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
