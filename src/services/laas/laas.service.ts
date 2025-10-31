import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { CreateUsuarioDto } from 'src/modules/usuario/dto/create-usuario.dto';

interface LaasTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number; // seconds
  refresh_token?: string;
  scope?: string;
}

@Injectable()
export class LaasService {
  private readonly logger = new Logger(LaasService.name);

  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private expiresAtEpochMs: number | null = null;

  private readonly url: string;
  private readonly username: string;
  private readonly password: string;
  private readonly basicAuth: string; // Base64 client credentials header value

  constructor(private readonly config: ConfigService) {
    this.url = this.config.get<string>('LAAS_URL') || '';
    this.username = this.config.get<string>('LAAS_USERNAME') || '';
    this.password = this.config.get<string>('LAAS_PASSWORD') || '';
    this.basicAuth =
      this.config.get<string>('LAAS_BASIC_AUTH') ||
      'Basic TEFBUzpMRVhJU19TRVJWSUNFX0xBQVM=';
  }

  private isTokenValid(): boolean {
    if (!this.accessToken || !this.expiresAtEpochMs) return false;
    // Add a small safety window of 10 seconds
    return Date.now() + 10_000 < this.expiresAtEpochMs;
  }

  async getValidAccessToken(): Promise<string> {
    if (this.isTokenValid() && this.accessToken) {
      return this.accessToken;
    }

    // Try refresh first if we have a refresh token
    if (this.refreshToken) {
      try {
        await this.refreshAccessToken();
        if (this.isTokenValid() && this.accessToken) {
          return this.accessToken;
        }
      } catch (e: any) {
        this.logger.warn(
          `Refresh token failed, falling back to password grant: ${
            e?.message || e
          }`,
        );
      }
    }

    await this.fetchTokenWithPasswordGrant();
    if (!this.accessToken)
      throw new Error('Unable to obtain LAAS access token');
    return this.accessToken;
  }

  async fetchTokenWithPasswordGrant(): Promise<LaasTokenResponse> {
    const params = new URLSearchParams();
    params.append('username', this.username);
    params.append('password', this.password);
    params.append('grant_type', 'password');

    const url = `${this.url}/security/oauth/token`;
    const options: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: this.basicAuth,
      },
      data: params,
      url,
    };

    const resp = await axios(options);
    this.applyTokenResponse(resp.data as LaasTokenResponse);
    return resp.data as LaasTokenResponse;
  }

  async refreshAccessToken(): Promise<LaasTokenResponse> {
    if (!this.refreshToken) throw new Error('No refresh token available');

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', this.refreshToken);

    const url = `${this.url}/security/oauth/token`;
    const options: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: this.basicAuth,
      },
      data: params,
      url,
    };

    const resp = await axios(options);
    this.applyTokenResponse(resp.data as LaasTokenResponse);
    return resp.data as LaasTokenResponse;
  }

  invalidateToken() {
    this.accessToken = null;
    this.refreshToken = null;
    this.expiresAtEpochMs = null;
  }

  private applyTokenResponse(data: LaasTokenResponse) {
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token || this.refreshToken;
    if (data.expires_in) {
      this.expiresAtEpochMs = Date.now() + data.expires_in * 1000;
    } else {
      // Default to 1 hour if not provided
      this.expiresAtEpochMs = Date.now() + 3600 * 1000;
    }
  }

  async addLitigantUser(usuarioDto: CreateUsuarioDto, sadId: number) {
    const token = await this.getValidAccessToken();
    const url = `${this.url}/subscripcion/add_litigant_user`;

    const options: AxiosRequestConfig = {
      method: 'POST',
      url,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Api-Key': '4ede89bd-1ae3-4b2a-8202-6f77050c2199',
      },
      data: {
        ...usuarioDto,
        sadId: sadId,
      },
    };

    const resp = await axios(options).catch((error) => {
      throw error?.response?.data || error;
    });
    return resp.data;
  }

  async deleteLitigantUser(
    invId: number,
    usuId: number,
    cueId: number,
    cuenta: string,
  ) {
    const token = await this.getValidAccessToken();
    const url = `${this.url}/subscripcion/delete_litigant_invitacion`;

    const options: AxiosRequestConfig = {
      method: 'POST',
      url,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        invId,
        usuId,
        cueId,
        cuenta,
      },
    };

    const resp = await axios(options).catch((error) => {
      throw error?.response?.data || error;
    });
    return resp.data;
  }
}
