import {signal} from '@angular/core';

export function createSupabaseServiceStub() {
  return {
    user: signal(undefined),
    session: null,
    isAuthenticated: () => Promise.resolve(false),
    exchangeCodeForSession: () => Promise.resolve(undefined),
    signInGithub: () => Promise.resolve(undefined),
    signInGoogle: () => Promise.resolve(undefined),
    signOut: () => Promise.resolve(undefined)
  };
}
