export default defineNuxtRouteMiddleware(async (to) => {
  if (!useIsSignedIn().value && to.path !== '/sign-in') {
    return navigateTo('/sign-in')
  }
})
