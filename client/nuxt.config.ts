// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  alias: {
    assets: "/<rootDir>/assets"
  },
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/ui'],
  app: {
    head: {
      title: 'SAI'
    }
  },
  css: [
    "~/assets/css/main.scss",
    "~/assets/css/colors.scss"
  ],
  ui: {
    global: true,
    icons: ['mdi'],
  },
  ssr: false
})
