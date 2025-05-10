import Aura from '@primeuix/themes/aura';
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: true, // 유니버설 렌더링 모드
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  debug: true,
  modules: ['@nuxt/eslint', '@nuxt/icon',  '@primevue/nuxt-module'],
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  imports: {
    dirs: [],
    imports: [
      {
        from: 'zod',
        name: 'z',
      },
      {
        from: '@primevue/forms/resolvers/zod',
        name: 'zodResolver',
      },
    ]
  }
})