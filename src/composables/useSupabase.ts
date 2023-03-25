import { type PublicRuntimeConfig } from '@nuxt/schema'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const client = ref<SupabaseClient | null>(null)

export default function useSupabase() {
  if (!client.value) {
    let config: Partial<PublicRuntimeConfig> = {}

    try {
      config = useRuntimeConfig().public
    } catch (error) {
      if (process.server) {
        config.supabase = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        }
      }
    }

    client.value = createClient(config.supabase?.url ?? '', config.supabase?.key ?? '')
  }

  return client.value
}
