export interface AuthSignUpOptions {
  displayName?: string;
  photoURL?: string;
}

export interface UpdateProfileOptions {
  displayName?: string | null;
  photoURL?: string | null;
}
