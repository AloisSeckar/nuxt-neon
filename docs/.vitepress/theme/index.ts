import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// import Comp from './components/Comp.vue'

import './neon.css'

import 'vitepress/dist/client/theme-default/styles/components/vp-code-group.css'
import 'virtual:group-icons.css'

export default {
  extends: DefaultTheme,
  enhanceApp(/* { app } */) {
    // register your custom global components
    // app.component('Comp', Comp)
  },
} satisfies Theme
