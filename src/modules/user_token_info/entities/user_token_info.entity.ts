import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'user_token_info' })
export class UserTokenInfo {
  @ViewColumn()
  cueId: number;

  @ViewColumn()
  cuenta: string;

  @ViewColumn()
  usuId: number;

  @ViewColumn()
  usuNombre: string;

  @ViewColumn()
  usuApellido: string;

  @ViewColumn()
  usuEmail: string;

  @ViewColumn()
  services: string;

  @ViewColumn()
  authorities: string;

  @ViewColumn()
  service: string;

  @ViewColumn()
  usuLitigant: boolean;

  @ViewColumn()
  usuLitigantServices: string;

  @ViewColumn()
  usuLitigantEstado: string;

  @ViewColumn()
  usuLitigantRole: string;

  @ViewColumn()
  usuCredendialExpirada: boolean;

  @ViewColumn()
  usuHasMfa: boolean;

  @ViewColumn()
  sector: string;

  @ViewColumn()
  hasServices: boolean;
}
