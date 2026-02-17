// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/i18n", "nuxt-auth-utils"],
  components: [
    "~/components/pages/product-management",
    "~/components/pages/systems-setting",
    "~/components/"],
  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
        files: [
          "en/label.json",
          "en/common.json",
          "en/tableColumn.json",
          "en/validation.json",
          "en/placeholder.json",
          "en/message.json",
        ],
      },
      {
        code: "km",
        name: "ខ្មែរ",
        files: [
          "kh/label.json",
          "kh/common.json",
          "kh/tableColumn.json",
          "kh/validation.json",
          "kh/placeholder.json",
          "kh/message.json",
        ],
      },
    ],
    defaultLocale: "en",
    strategy: "no_prefix",
  },

  devtools: {
    enabled: true,
  },

  css: ["~/assets/css/main.css"],

  routeRules: {},

  compatibilityDate: "2025-01-15",

  eslint: {
    config: {
      stylistic: {
        commaDangle: "never",
        braceStyle: "1tbs",
      },
    },
  },
  typescript: {
    tsConfig: {
      include: ["../types/**/*.d.ts"],
    },
  },
  runtimeConfig: {
    apiUrlBase: process.env.API_URL_BASE || "http://localhost:4000/admin/v1",
  },
});
