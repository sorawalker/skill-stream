export interface JwtPayload {
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface JwtUser {
  userId: number;
  username: string;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}
