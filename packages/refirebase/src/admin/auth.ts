import type { Auth } from 'firebase-admin/auth';

export class AdminAuth {
  constructor(private readonly auth: Auth) {}

  get native(): Auth {
    return this.auth;
  }

  createCustomToken(uid: string, developerClaims?: object): Promise<string> {
    return this.auth.createCustomToken(uid, developerClaims);
  }

  verifyIdToken(token: string, checkRevoked = false) {
    return this.auth.verifyIdToken(token, checkRevoked);
  }
}
