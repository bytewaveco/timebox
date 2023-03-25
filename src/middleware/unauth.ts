export default defineNuxtRouteMiddleware(async (to) => {
  if (useIsSignedIn().value && to.path !== '/') {
    return navigateTo('/')
  }
})
