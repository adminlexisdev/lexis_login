export interface JwtPayload {
  user_name: string;
  client_id: string;
  jti: string;
  authorities: string[];
  scope: string[];
  data: JwtPayloadData;
}
interface JwtPayloadData {
  cueId: number;
  cuenta: string;
  sadId?: number;
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
