export default {
  flavor: 'clin',
  emailFlavor: 'artmed+clin@artmed.com.br',
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Artmed+CLIN',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'O seu guia para a tomada de decisão clínica.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://use.typekit.net/rhv4hzr.css'
      }
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/vue-safe-html.js',
    '~/plugins/infinite-loading.js',
    '~/plugins/api.js',
    '~/plugins/helpers.js',
    '~/plugins/iframeResize.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/svg',
    '@nuxtjs/style-resources'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/auth-next',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap'
  ],

  bootstrapVue: {
    icons: true
  },

  styleResources: {
    scss: [
      './assets/scss/_bootstrap.scss',
      './assets/scss/_color-system.scss',
      './assets/scss/_color-clin.scss',
      './assets/scss/_mixins.scss'
    ]
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'https://api.consultamaisrapida.com.br/',
    headers: {
      common: {
        'X-APP': '1'
      }
    }
  },

  auth: {
    plugins: [{ src: '~/plugins/api.js', ssr: true }],
    strategies: {
      custom: {
        scheme: '~/schemes/customScheme.js',
        token: {
          property: 'data.token',
          global: true,
          required: true,
          type: 'Bearer'
        },
        user: {
          property: 'data'
        },
        endpoints: {
          login: { url: 'sessions?version=1', method: 'post' },
          logout: false,
          user: { url: 'users/id?version=3', method: 'get' }
        }
      }
    },
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/'
    }
  },

  router: {
    middleware: ['auth']
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'pt-BR'
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  generate: {
    dir: 'public'
  },

  build: {
    babel: {
      compact: true
    }
  },

  server: {
    host: '0.0.0.0'
  }
}
