import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'servicios_activos_adquiridos' })
export class ServiciosActivosAdquirido {
  @ViewColumn({ name: 'sad_id' })
  sadId: number;

  @ViewColumn({ name: 'cue_id' })
  cueId: number;

  @ViewColumn({ name: 'cue_nombre' })
  cueNombre: string;

  @ViewColumn({ name: 'pro_nombre' })
  proNombre: string;

  @ViewColumn({ name: 'paq_accesos' })
  paqAccesos: number;
}
