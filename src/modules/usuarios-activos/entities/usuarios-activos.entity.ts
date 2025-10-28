import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'usuarios_activos' })
export class UsuariosActivos {
  @ViewColumn({ name: 'pro_nombre' })
  proNombre: string;

  @ViewColumn({ name: 'usu_id' })
  usuId: number;

  @ViewColumn({ name: 'usu_nombre' })
  usuNombre: string;

  @ViewColumn({ name: 'usu_apellido' })
  usuApellido: string;

  @ViewColumn({ name: 'usu_email' })
  usuEmail: string;

  @ViewColumn({ name: 'cue_nombre' })
  cueNombre: string;

  @ViewColumn({ name: 'cue_id' })
  cueId: number;

  @ViewColumn({ name: 'sad_id' })
  sadId: number;
}
