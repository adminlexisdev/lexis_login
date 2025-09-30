export interface JwtPayload {
  sub: string; // user id (email en este caso)
  email: string;
  proNombre: string;
  cueNombre: string;
  iat?: number;
  exp?: number;
}
