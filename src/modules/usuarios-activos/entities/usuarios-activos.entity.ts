import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'usuarios_activos' })
export class UsuariosActivos {
  @ViewColumn({ name: 'pro_nombre' })
  proNombre: string;

  @ViewColumn({ name: 'usu_email' })
  usuEmail: string;

  @ViewColumn({ name: 'cue_nombre' })
  cueNombre: string;
}
