export class Auth {}

export class SessionPayload {
  id: string;
  name: string;
  email: string;
}

export enum TokenPurpose {
  SESSION = 'SESSION',
  REFRESH = 'REFRESH',
}
