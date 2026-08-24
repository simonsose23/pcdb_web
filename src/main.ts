import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import type { Column, Schema } from './util/Schema'

import VueSelect from 'vue-select'

import "vue-select/dist/vue-select.css";

const app = createApp(App)

// Get database schema and parse it
const resp = await fetch('http://localhost:8080/schema/')

const schema = await resp.json() as Schema;

const parsedSchema = new Array<Column>();

const len = schema[0].length;

for (let i = 0; i < len; i++) {
  parsedSchema.push({ name: schema[0][i]!, type: schema[1][i]! });
}

app.config.globalProperties.$schema = parsedSchema;

// Mount app
app
  .component('v-select', VueSelect)
  .mount('#app')
