export interface JwtPayload {
  email: string;
  name: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}
