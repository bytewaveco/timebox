import path from 'path'

export default defineNuxtConfig({
  ssr: true,
  srcDir: 'src',
  typescript: {
    shim: false,
  },
  nitro: {
    preset: 'vercel-edge',
  },
  runtimeConfig: {
    public: {
      supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      },
    },
  },
  app: {
    head: {
      title: 'Timebox',
      meta: [
        {
          name: 'description',
          content:
            /* eslint-disable-next-line max-len */
            'A free and useful tool for time tracking.',
        },
      ],
      link: [
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },

        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/favicon.svg',
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
      ],
    },
  },
  hooks: {
    'imports:dirs': (dirs: string[]) => {
      dirs.push(path.resolve(__dirname, 'src/stores'))
    },
  },
  modules: [
    'nuxt-icon',
    '@vueuse/nuxt',
    [
      '@pinia/nuxt',
      {
        autoImports: [['defineStore', 'definePiniaStore']],
      },
    ],
  ],
  telemetry: false,
})
