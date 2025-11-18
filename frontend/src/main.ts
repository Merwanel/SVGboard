import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('xml', xml)

const app = createApp(App)

app.use(createPinia())
app.use(hljsVuePlugin)
app.mount('#app')
