<template>
  <section>
    <div id="header">
      <h1>Timebox</h1>
      <button @click="signOut">
        <icon name="ph:sign-out" />
        Sign Out
      </button>
    </div>
    <div v-if="app.project" id="timers">
      <button class="full-width" @click="app.project = null">
        <icon name="ph:caret-left" /> Back to projects
      </button>
      <h3>
        <span id="name">{{ app.project.name }}</span> |
        {{
          useHMS(
            app.projectTimers.reduce((acc, curr) => {
              if (curr.end_at) {
                return acc + useTime(curr.end_at).diff(useTime(curr.start_at), 's')
              } else {
                return acc + useTime(app.time).diff(useTime(curr.start_at), 's')
              }
            }, 0),
          )
        }}
      </h3>
      <div v-if="!isAddingDuration" class="timer-buttons">
        <button class="full-width" @click="addTimer">Start Timer</button>
        <button class="full-width" @click="isAddingDuration = true">Add Duration</button>
      </div>
      <form v-if="isAddingDuration" @submit.prevent="addDuration">
        <timer-input v-model="duration" />
        <br />
        <div class="timer-buttons">
          <button class="full-width" @click="resetDuration">Cancel</button>
          <button
            type="submit"
            class="full-width"
            :disabled="
              Object.values(duration).every(
                (value) => String(value).length === 0 || value === 0,
              )
            ">
            Add Duration
          </button>
        </div>
      </form>
      <div v-for="timer in app.projectTimers" :key="timer.id" class="timer">
        <span>
          Started on
          {{ useTime(timer.start_at).format('ddd [the] d [of] MMM YY, hh:mm a') }}
          <br />
          Duration:
          {{
            useHMS(
              timer.end_at
                ? useTime(timer.end_at).diff(useTime(timer.start_at), 's')
                : useTime(app.time).diff(timer.start_at, 's'),
            )
          }}
        </span>
        <button v-if="timer.end_at" @click="deleteTimer(timer)">Delete</button>
        <button v-else @click="endTimer(timer)">End</button>
      </div>
    </div>
    <div v-else id="projects">
      <template v-if="app.projects.length">
        <h3>Projects</h3>
        <button
          v-if="isAddingProject"
          class="full-width"
          @click="isAddingProject = false">
          <icon name="ph:caret-left" /> Back
        </button>
        <button v-else class="full-width" @click="isAddingProject = true">
          Add Project
        </button>
        <add-project v-if="isAddingProject" @close="isAddingProject = false" />
        <template v-else>
          <div
            v-for="project in app.projects"
            :key="project.id"
            class="project"
            @click="app.project = project">
            <h5>
              {{ project.name }}
              {{
                app.timers
                  .filter((timer) => timer.project_id === project.id)
                  .every((timer) => timer.end_at)
                  ? ''
                  : '⏳'
              }}
            </h5>
            <button @click.stop.prevent="deleteProject(project)">
              <icon name="ph:trash" />
            </button>
          </div>
        </template>
      </template>
      <div v-else>
        <p>Create a project to get started.</p>
        <add-project />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['auth'],
})

const app = useApp()
const supabase = useSupabase()
const duration = ref<{
  hours: string | number
  minutes: string | number
  seconds: string | number
}>({
  hours: '',
  minutes: '',
  seconds: '',
})
const isAddingProject = ref(false)
const isAddingDuration = ref(false)

async function addTimer() {
  for (const timer of app.activeTimers) {
    await endTimer(timer)
  }

  const { error } = await supabase.from('timers').insert({
    user_id: (await supabase.auth.getUser()).data?.user?.id,
    project_id: app.project?.id,
    start_at: useTime().toISOString(),
  })

  if (error) {
    console.error(error)
  }
}

function resetDuration() {
  duration.value = {
    hours: '',
    minutes: '',
    seconds: '',
  }

  isAddingDuration.value = false
}

async function addDuration() {
  const { error } = await supabase.from('timers').insert({
    user_id: (await supabase.auth.getUser()).data?.user?.id,
    project_id: app.project?.id,
    start_at: useTime()
      .subtract(Number(duration.value.hours), 'h')
      .subtract(Number(duration.value.minutes), 'm')
      .subtract(Number(duration.value.seconds), 's')
      .toISOString(),
    end_at: useTime().toISOString(),
  })

  if (error) {
    console.error(error)
  }

  resetDuration()
}

async function endTimer(timer: Timer) {
  const { error } = await supabase
    .from('timers')
    .update({ end_at: useTime().toISOString() })
    .eq('id', timer.id)

  if (error) {
    console.error(error)
  }
}

async function deleteTimer(timer: Timer) {
  const { error } = await supabase.from('timers').delete().eq('id', timer.id)

  if (error) {
    console.error(error)
  }
}

async function deleteProject(project: Project) {
  const { error } = await supabase.from('projects').delete().eq('id', project?.id)

  if (error) {
    console.error(error)
  }
}

async function signOut() {
  await supabase.auth.signOut()

  app.project = null
  app.projects = []
  app.timers = []

  app.setHead()
}
</script>

<style lang="scss" scoped>
#header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#name {
  display: inline-block;
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30vw;
}

.timer-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  input {
    width: 2ch !important;
  }
}

#timers {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .timer {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid rgb(var(--c-primary));
    border-radius: 4px;
  }
}

#projects {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .project {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border: 1px solid rgb(var(--c-primary));
    border-radius: 4px;
    cursor: pointer;
  }
}
</style>
