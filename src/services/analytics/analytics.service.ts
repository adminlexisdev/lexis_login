import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';

interface LoginSendData {
  usuEmail: string;
  cuenta: string;
  sectorCuenta: string;
  proNombre: string;
  dispositivo: string;
  ip?: string;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly url: string;

  constructor(private readonly config: ConfigService) {
    this.url = this.config.get<string>('ANALYTICS_URL') || '';
  }

  saveLoginAnalytics(data: LoginSendData): void {
    const endpoint = `${this.url}/analytics/login`;
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    data.dispositivo = 'WEB';

    axios
      .post(endpoint, data, config)
      .then((response) => {
        this.logger.log(
          `Login analytics saved successfully: ${response.status}`,
        );
      })
      .catch((error) => {
        this.logger.error(
          `Failed to save login analytics: ${
            error.response?.status || error.message
          }`,
        );
      });
  }
}
