import { jwtDecode } from "jwt-decode";
import { UserRoles } from "../models/user-roles";

export interface JwtPayload {
  username: string;
  eamil: string;
  roles: UserRoles[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

export function decodeToken(token: string): JwtPayload {
  const decoded = jwtDecode<JwtPayload>(token);

  return decoded;
}
