export default {
  head: {
    title: 'markdown-inText-search',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: ['@nuxtjs/tailwindcss'],

  modules: ['@nuxtjs/markdownit', ['vue-scrollto/nuxt', { duration: 1000 }]],

  build: {},

  tailwindcss: {
    viewer: false,
  },

  render: {
    bundleRenderer: {
      runInNewContext: false,
    },
  },

  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    runtime: true,
    injected: true,
    html: true,
    use: ['markdown-it-div', 'markdown-it-attrs', '@markspec/markdown-it-link'],
  },
}
