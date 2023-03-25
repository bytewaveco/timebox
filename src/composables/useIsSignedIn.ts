const result = ref(false)

export default function useIsSignedIn() {
  useSupabase()
    .auth.getSession()
    .then(({ data }) => {
      const state = Boolean(data.session)

      if (result.value !== state) {
        result.value = state
      }
    })

  watch(useSupabaseAuthState(), (updatedValue) => {
    const state = updatedValue.every((value) => value !== null)

    if (result.value !== state) {
      result.value = state
    }
  })

  return result
}
