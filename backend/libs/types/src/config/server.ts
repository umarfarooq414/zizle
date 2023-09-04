export interface IServerConfigAdmin {
  email: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
  password: string;
}

export interface IServerConfig {
  port: number;
  admin: IServerConfigAdmin;
  productName: string;
  frontendUrlClient: string;
  frontendUrlAdmin: string;
  frontendUrlModerator: string;
  backendUrl: string;
  authOtpVerificationLink: string;
  authLoginLink: string;
}

export enum ServerConfigEnum {
  PORT = 'port',
  ADMIN = 'admin',
  PRODUCT_NAME = 'productName',
  FRONTEND_URL_CLIENT = 'frontendUrlClient',
  FRONTEND_URL_ADMIN = 'frontendUrlAdmin',
  FRONTEND_URL_MODERATOR = 'frontendUrlModerator',
  BACKEND_URL = 'backendUrl',
  AUTH_OTP_VERIFICATION_LINK = 'authOtpVerificationLink',
  AUTH_LOGIN_LINK = 'authLoginLink',
}
