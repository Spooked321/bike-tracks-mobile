// Stub — auth flow is deferred to a future phase
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export function useAuth(): { user: User | null; loading: boolean } {
  return { user: null, loading: false };
}
