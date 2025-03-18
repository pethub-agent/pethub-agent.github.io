import { HttpContextToken } from '@angular/common/http';

export interface ApiConfig {
  host: string;
}

export const API_CONFIG_CONTEXT = new HttpContextToken<ApiConfig>(() => {
  const config: ApiConfig = {
    host: '',
  };
  return config;
});
