export interface LoginResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: string;
  scope: string[];
  data: UserData;
  jti: string;
}

interface UserData {
  cueId: number;
  cuenta: string;
  usuId: number;
  usuNombre: string;
  usuApellido: string;
  usuEmail: string;
  services: string[];
  authorities: string[];
  service: string;
  usuLitigant: boolean;
  usuLitigantServices: string;
  usuLitigantEstado: string;
  usuLitigantRole: string;
  usuCredendialExpirada: boolean;
  hasServices: boolean;
  sector: string;
  usuHasMfa: boolean;
}
