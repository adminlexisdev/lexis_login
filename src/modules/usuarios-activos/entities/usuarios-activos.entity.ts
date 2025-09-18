import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity()
export class UsuariosActivos {
  @ViewColumn()
  proNombre: string;

  @ViewColumn()
  usuEmail: string;

  @ViewColumn()
  cueNombre: string;
}
