import { authServiceApi } from "./service";

export type Session = typeof authServiceApi.$Infer.Session;
export type User = typeof authServiceApi.$Infer.Session.user;
export type AuthServiceApi = typeof authServiceApi;