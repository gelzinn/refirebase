import type { FirebaseApp } from 'firebase/app';

import {
  type Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  type UserCredential,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from 'firebase/auth';

import { MESSAGES } from '../config/messages';
import { toRefirebaseError } from '../types/firebase/error';

/**
 * Options for Google sign-in on React Native.
 * Requires `@react-native-google-signin/google-signin` to be installed.
 */
export interface GoogleSignInOptions {
  /** ID token from `GoogleSignin.signIn()` */
  idToken: string;
  accessToken?: string;
}

/**
 * Options for Facebook sign-in on React Native.
 * Requires `react-native-fbsdk-next` or similar to be installed.
 */
export interface FacebookSignInOptions {
  /** Access token from Facebook Login SDK */
  accessToken: string;
}

/**
 * NativeFirebaseAuth
 *
 * Auth class designed for React Native / Expo.
 * Uses `signInWithCredential` instead of `signInWithPopup`, which is
 * incompatible with mobile environments.
 *
 * **Google setup (Expo/RN):**
 * ```ts
 * import { GoogleSignin } from '@react-native-google-signin/google-signin';
 *
 * GoogleSignin.configure({ webClientId: 'YOUR_WEB_CLIENT_ID' });
 * const { idToken } = await GoogleSignin.signIn();
 * await auth.handleGoogleSignIn({ idToken });
 * ```
 *
 * **Facebook setup:**
 * ```ts
 * import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
 *
 * await LoginManager.logInWithPermissions(['public_profile', 'email']);
 * const data = await AccessToken.getCurrentAccessToken();
 * await auth.handleFacebookSignIn({ accessToken: data.accessToken });
 * ```
 */
export class NativeFirebaseAuth {
  private readonly auth: Auth;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }
    this.auth = getAuth(app);
  }

  /**
   * Sign in with a Google credential obtained from the native Google Sign-In SDK.
   *
   * @param options - `{ idToken, accessToken? }` from `GoogleSignin.signIn()`
   */
  async handleGoogleSignIn(options: GoogleSignInOptions): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      const credential = GoogleAuthProvider.credential(
        options.idToken,
        options.accessToken,
      );
      const data = await signInWithCredential(this.auth, credential);
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Sign in with a Facebook access token obtained from the native Facebook Login SDK.
   *
   * @param options - `{ accessToken }` from `AccessToken.getCurrentAccessToken()`
   */
  async handleFacebookSignIn(options: FacebookSignInOptions): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      const credential = FacebookAuthProvider.credential(options.accessToken);
      const data = await signInWithCredential(this.auth, credential);
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Sign in with a custom OAuth credential.
   * Use this for GitHub, Twitter or any other provider where you
   * manually obtain the credential outside of Firebase.
   *
   * @param provider - One of 'google' | 'github' | 'twitter' | 'facebook'
   * @param credential - The AuthCredential obtained from the native SDK
   */
  async handleCredentialSignIn(credential: ReturnType<typeof GoogleAuthProvider.credential>): Promise<{
    data: UserCredential | null;
    error?: ReturnType<typeof toRefirebaseError>;
  }> {
    try {
      const data = await signInWithCredential(this.auth, credential);
      return { data };
    } catch (error) {
      return { data: null, error: toRefirebaseError(error) };
    }
  }

  /**
   * Sign out the current user.
   */
  async handleSignOut(): Promise<{ error?: ReturnType<typeof toRefirebaseError> }> {
    try {
      await signOut(this.auth);
      return {};
    } catch (error) {
      return { error: toRefirebaseError(error) };
    }
  }

  /**
   * Subscribe to auth state changes.
   */
  onAuthStateChanged(callback: Parameters<typeof onAuthStateChanged>[1]): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  get native(): Auth {
    return this.auth;
  }
}
