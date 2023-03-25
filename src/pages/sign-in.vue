<template>
  <form @submit.stop.prevent="signIn">
    <h1>Sign up or in</h1>
    <p>
      If you don't have an account, you can sign up by entering a valid email and
      password.
    </p>
    <label for="email">Email</label>
    <input v-model="email" type="email" name="email" placeholder="Email" />
    <span></span>
    <br />
    <br />
    <label for="password">Password</label>
    <input v-model="password" type="password" name="password" placeholder="Password" />
    <span>Password must be at least 10 characters.</span>
    <br />
    <br />
    <button
      class="full-width"
      type="submit"
      :disabled="!(email.length && password.length)">
      Sign in
    </button>
  </form>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['unauth'],
})

const email = ref('')
const password = ref('')
const supabase = useSupabase()

async function signIn() {
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error && error.message !== 'User already registered') {
      console.error(error)
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (signInError) {
      console.error(signInError)
    }
  } catch (error) {
    console.error(error)
  }
}
</script>
