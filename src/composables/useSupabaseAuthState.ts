import { type AuthChangeEvent, type Session } from '@supabase/supabase-js'

const state = ref<[AuthChangeEvent | null, Session | null]>([null, null])

export function useSupabaseAuthState() {
  useSupabase().auth.onAuthStateChange((event, session) => {
    if (process.client && event !== state.value[0]) {
      state.value = [event, session]

      if (
        (event === 'SIGNED_IN' ||
          event === 'USER_UPDATED' ||
          event === 'TOKEN_REFRESHED') &&
        session
      ) {
        const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
        document.cookie =
          `x-supabase-access-token=${session.access_token}; ` +
          `path=/; max-age=${maxAge}; SameSite=Lax; secure`
        document.cookie =
          `x-supabase-refresh-token=${session.refresh_token}; ` +
          `path=/; max-age=${maxAge}; SameSite=Lax; secure`
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        const expires = new Date(0).toUTCString()
        document.cookie =
          'x-supabase-access-token=; path=/; ' +
          `expires=${expires}; SameSite=Lax; secure`
        document.cookie =
          'x-supabase-refresh-token=; path=/; ' +
          `expires=${expires}; SameSite=Lax; secure`
      }
    }
  })

  return state
}
