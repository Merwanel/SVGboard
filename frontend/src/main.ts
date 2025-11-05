import { createApp } from 'vue'
import App from './App.vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('xml', xml)

createApp(App)
  .use(hljsVuePlugin)
  .mount('#app')
