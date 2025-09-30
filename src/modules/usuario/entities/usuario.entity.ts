import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usu_id' })
  usuId: number;

  @Column({ name: 'usu_nombre' })
  usuNombre: string;

  @Column({ name: 'usu_apellido' })
  usuApellido: string;

  @Column({ unique: true, name: 'usu_email' })
  usuEmail: string;

  @Column({ name: 'usu_password' })
  usuPassword: string;

  @Column({ default: false, name: 'usu_has_mfa' })
  usuHasMfa: boolean;

  @Column({ default: true, name: 'usu_cuenta_bloqueda' })
  usuCuentaBloqueada: boolean;

  @Column({ default: true, name: 'usu_cuenta_expirada' })
  usuCuentaExpirada: boolean;

  @Column({ default: true, name: 'usu_credencial_expirada' })
  usuCredencialExpirada: boolean;

  @Column({ default: true, name: 'usu_habilitado' })
  usuHabilitado: boolean;

  @Column({ name: 'status_register', default: true })
  usuStatusRegister: boolean;
}
