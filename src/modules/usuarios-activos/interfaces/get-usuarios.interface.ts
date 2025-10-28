import { UsuariosActivos } from '../entities/usuarios-activos.entity';

export interface GetUsuariosActivosInterface {
  usuarios: UsuariosActivos[];
  total: number;
  registrados: number;
  sadId: number;
}
