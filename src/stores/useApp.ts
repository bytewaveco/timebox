let isSubscribed = false

export default definePiniaStore('app', {
  state: () => ({
    projects: [] as Project[],
    project: null as Project | null,
    timers: [] as Timer[],
    time: useTime(),
  }),
  getters: {
    allActiveTimers(state) {
      return state.timers
        .filter((timer) => timer && !timer.end_at)
        .sort((a, b) => (useTime(a.start_at).isBefore(useTime(b.start_at)) ? 1 : -1))
    },
    activeTimers(state) {
      return state.timers
        .filter(
          (timer) => timer && !timer.end_at && timer.project_id === state.project?.id,
        )
        .sort((a, b) => (useTime(a.start_at).isBefore(useTime(b.start_at)) ? 1 : -1))
    },
    projectTimers(state) {
      return state.timers
        .filter((timer) => timer && timer.project_id === state.project?.id)
        .sort((a, b) => (useTime(a.start_at).isBefore(useTime(b.start_at)) ? 1 : -1))
    },
  },
  actions: {
    async hook() {
      const supabase = useSupabase()
      const authState = useSupabaseAuthState()

      if (authState.value[1]?.user.id) {
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', authState.value[1]?.user.id)

        if (projectsError) {
          console.error(projectsError)
        } else {
          this.projects = projects as Project[]
        }

        const { data: timers, error: timersError } = await supabase
          .from('timers')
          .select('*')
          .eq('user_id', authState.value[1]?.user.id)

        if (timersError) {
          console.error(timersError)
        } else {
          this.timers = timers as Timer[]
        }
      }

      this.setHead()

      useIntervalFn(() => {
        this.time = useTime()
      }, 1000)

      watch(authState, async ([_event, session]) => {
        if (session?.user) {
          const { data: projects, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', session?.user.id)

          if (projectsError) {
            console.error(projectsError)
          } else {
            this.projects = projects as Project[]
          }

          const { data: timers, error: timersError } = await supabase
            .from('timers')
            .select('*')
            .eq('user_id', session?.user.id)

          if (timersError) {
            console.error(timersError)
          } else {
            this.timers = timers as Timer[]
          }

          this.setHead()

          if (!isSubscribed && process.client) {
            useSupabase()
              .channel('sync')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  filter: `user_id=eq.${session?.user.id}`,
                },
                async (payload) => {
                  if (payload.table === 'projects') {
                    if (payload.eventType === 'DELETE') {
                      this.projects = this.projects.filter(
                        (project) => project.id !== payload.old.id,
                      )
                    } else if (payload.eventType === 'UPDATE') {
                      this.projects = this.projects.map((project) => {
                        if (project.id === payload.new.id) {
                          return payload.new
                        }
                      }) as Project[]
                    } else if (payload.eventType === 'INSERT') {
                      this.projects.push(payload.new as Project)
                    }
                  } else if (payload.table === 'timers') {
                    if (payload.eventType === 'DELETE') {
                      this.timers = this.timers.filter(
                        (timer) => timer && timer.id !== payload.old.id,
                      )
                    } else if (payload.eventType === 'UPDATE') {
                      this.timers = this.timers.map((timer) => {
                        if (timer.id === payload.new.id) {
                          return payload.new
                        }
                        return timer
                      }) as Timer[]
                    } else if (payload.eventType === 'INSERT') {
                      this.timers.push(payload.new as Timer)
                    }
                  }

                  this.setHead()
                },
              )
              .subscribe()

            isSubscribed = true
          }
        }
      })
    },
    setHead() {
      useHead({
        title: this.allActiveTimers.length
          ? `⏳ ${this.allActiveTimers.length} Active | Timebox`
          : 'Timebox',
      })
    },
  },
})
