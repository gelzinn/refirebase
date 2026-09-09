import type { FirebaseApp } from 'firebase/app';

import {
  type Auth,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  type User,
  type UserCredential,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  linkWithPopup,
  onAuthStateChanged,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { MESSAGES } from '../config/messages';
import { toRefirebaseError } from '../types/firebase/error';
import type { UpdateProfileOptions } from '../types/firebase/auth';

type Provider = 'google' | 'github' | 'twitter' | 'facebook';

function buildProvider(
  provider: Provider,
): GoogleAuthProvider | GithubAuthProvider | TwitterAuthProvider | FacebookAuthProvider {
  switch (provider) {
    case 'google':
      return new GoogleAuthProvider();
    case 'github':
      return new GithubAuthProvider();
    case 'twitter':
      return new TwitterAuthProvider();
    case 'facebook':
      return new FacebookAuthProvider();
    default:
      throw new Error(MESSAGES.AUTH.INVALID_PROVIDER(provider));
  }
}

export class FirebaseAuth {
  private readonly auth: Auth;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }
    this.auth = getAuth(app);
  }

  /**
   * Sign in with a third-party provider (Google, GitHub, Twitter, Facebook).
   * Uses a popup flow — for React Native use `refirebase/native`.
   */
  async handleProviderSignIn(
    provider: Provider,
    options?: { scopes?: string[] },
  ): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    const authProvider = buildProvider(provider);

    if (options?.scopes) {
      for (const scope of options.scopes) {
        if (typeof scope !== 'string') {
          throw new Error(MESSAGES.AUTH.INVALID_SCOPE(scope));
        }
        (authProvider as GoogleAuthProvider).addScope(scope);
      }
    }

    try {
      const data = await signInWithPopup(this.auth, authProvider);
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Sign in with a Firebase custom token (e.g. minted after Better Auth).
   */
  async handleCustomTokenSignIn(token: string): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      const data = await signInWithCustomToken(this.auth, token);
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Sign in with an email and password.
   */
  async handleEmailSignIn(
    email: string,
    password: string,
  ): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      const data = await signInWithEmailAndPassword(this.auth, email, password);
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Create a new account with email and password.
   * Optionally updates display name and photo URL right after creation.
   */
  async handleEmailSignUp(
    email: string,
    password: string,
    options?: { displayName?: string; photoURL?: string },
  ): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      if (options?.displayName || options?.photoURL) {
        await updateProfile(credential.user, {
          displayName: options.displayName,
          photoURL: options.photoURL,
        });
      }
      return { data: credential };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Send a password reset email to the given address.
   */
  async handlePasswordReset(email: string): Promise<{
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return {};
    } catch (error) {
      return { error: toRefirebaseError(error) };
    }
  }

  /**
   * Send an email verification to the currently signed-in user.
   */
  async handleEmailVerification(): Promise<{
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    const user = this.auth.currentUser;
    if (!user) {
      return {
        error: {
          code: 'unauthenticated',
          message: 'No user is currently signed in.',
        },
      };
    }
    try {
      await sendEmailVerification(user);
      return {};
    } catch (error) {
      return { error: toRefirebaseError(error) };
    }
  }

  /**
   * Update the current user's display name and/or photo URL.
   */
  async updateProfile(options: UpdateProfileOptions): Promise<{
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    const user = this.auth.currentUser;
    if (!user) {
      return {
        error: {
          code: 'unauthenticated',
          message: 'No user is currently signed in.',
        },
      };
    }
    try {
      await updateProfile(user, options);
      return {};
    } catch (error) {
      return { error: toRefirebaseError(error) };
    }
  }

  /**
   * Permanently delete the current user's account.
   * Note: Recent sign-in may be required. Re-authenticate if you get a credential error.
   */
  async deleteAccount(): Promise<{
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    const user = this.auth.currentUser;
    if (!user) {
      return {
        error: {
          code: 'unauthenticated',
          message: 'No user is currently signed in.',
        },
      };
    }
    try {
      await deleteUser(user);
      return {};
    } catch (error) {
      return { error: toRefirebaseError(error) };
    }
  }

  /**
   * Link the current account with an additional third-party provider.
   * Allows a user to sign in with multiple providers.
   */
  async linkProvider(provider: Provider): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    const user = this.auth.currentUser;
    if (!user) {
      return {
        data: null,
        error: {
          code: 'unauthenticated',
          message: 'No user is currently signed in.',
        },
      };
    }
    try {
      const data = await linkWithPopup(user, buildProvider(provider));
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Sign out the current user.
   */
  async handleSignOut(): Promise<{
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      await signOut(this.auth);
      return {};
    } catch (error) {
      return { error: toRefirebaseError(error) };
    }
  }

  /**
   * Get the current user synchronously.
   * @returns The current user or null if not signed in.
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Get the current user's Firebase ID token.
   * @param forceRefresh Force token refresh (useful before API calls).
   */
  getAccessToken(forceRefresh = false): Promise<string | null> {
    return (
      this.auth.currentUser?.getIdToken(forceRefresh) ?? Promise.resolve(null)
    );
  }

  /**
   * Underlying Auth instance (escape hatch).
   */
  get native(): Auth {
    return this.auth;
  }

  /**
   * Listen for changes to the user's sign-in state.
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Listen for changes to the user's ID token (including automatic token refresh).
   */
  onIdTokenChanged(callback: (user: User | null) => void): () => void {
    return onIdTokenChanged(this.auth, callback);
  }
}
