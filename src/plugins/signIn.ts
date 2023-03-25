export default defineNuxtPlugin(async () => {
  const isSignedIn = useIsSignedIn()

  if (isSignedIn.value && useRoute().path !== '/') {
    await navigateTo('/')
  }

  watch(isSignedIn, async (updatedValue) => {
    if (updatedValue && useRoute().path !== '/') {
      await navigateTo('/')
    } else if (!updatedValue && useRoute().path !== '/sign-in') {
      await navigateTo('/sign-in')
    }
  })
})
