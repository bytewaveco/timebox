<template>
  <form @submit.stop.prevent="createProject">
    <h3>New Project</h3>
    <label for="name">Project name</label>
    <input v-model="name" placeholder="Project name" />
    <br />
    <br />
    <button class="full-width" type="submit" :disabled="!name.length">
      Create Project
    </button>
  </form>
</template>

<script lang="ts" setup>
const emits = defineEmits(['close'])
const supabase = useSupabase()
const name = ref('')

async function createProject() {
  const { data, error } = await supabase
    .from('projects')
    .insert({ user_id: (await supabase.auth.getUser()).data?.user?.id, name: name.value })
    .select('*')
    .single()

  if (error) {
    console.error(error)
    return
  }

  useApp().project = data as Project

  emits('close')
}
</script>
