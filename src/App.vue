<script setup lang="ts">
import { ref } from 'vue'
import PCFilter from './components/PCFilter.vue'
import PolygonCanvas from './components/PolygonCanvas.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import PolygonEditor from './components/PolygonEditor.vue'
import { isMultiPolygon, isPolygon, type MultiPolygon } from './util/Polygon'

const pc_metas = ref(null)
const upload_files = ref<File[]>([])

async function get_pc_metas() {

  const req = await fetch("http://localhost:8080/list/", { method: 'GET', headers: { Accept: 'application/json' } })

  pc_metas.value = await req.json()

  console.log(pc_metas.value)
}

get_pc_metas()

function fileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const filesAsArray = Array.from(input?.files || [])
  upload_files.value = filesAsArray

}

async function upload() {
  const res = await fetch("http://localhost:8080/upload", {
    method: 'POST', body: await
      upload_files.value[0]!.arrayBuffer()
    , headers: { "Content-Type": "multipart/form-data" }
  })
}
</script>

<template>
  <h2>Point Cloud Database</h2>
  <PCFilter v-model="pc_metas" />
  <template v-if="Array.isArray(pc_metas) && (pc_metas as Object[]).length > 0">
    <table>
      <tr>
        <template v-for="key in Object.keys(pc_metas[0])">
          <td>{{ key }}</td>
        </template>
        <td>
          Get SHP
        </td>
      </tr>
      <template v-for="pc in pc_metas">
        <tr>
          <template v-for="val in Object.values(pc)">
            <td v-if="isMultiPolygon(val) || isPolygon(val)">
              <PolygonCanvas :data="val" :extent="{ width: 100, height: 80 }"></PolygonCanvas>
            </td>
            <td v-if="!isMultiPolygon(val) && !isPolygon(val)">
              {{ val }}
            </td>
          </template>
          <td><a :href="'http://localhost:8080/shp/' + pc.ogc_fid">SHP</a></td>
        </tr>
      </template>
    </table>

  </template>
  <div id="container">
    <h2>Upload</h2>
    <input id="file-input" type="file" multiple="false" @change="fileSelect" hidden>
    <label class="btn" for="file-input">Select LAS</label>
    <ul v-for="file in upload_files">
      <li>{{ file.name }}</li>
    </ul>
    <button id="upload-btn" @click="upload" hidden></button>
    <label class="btn" for="upload-btn">Start Upload</label>
  </div>
</template>

<style scoped>
#container {
  border: 2px solid #ffffff;
  padding: 10px;
}

.btn {
  background-color: darkblue;
  border: 1px solid lightblue;
  padding: 10px;
  margin-left: 10px;
  margin-right: 10px;
}

.btn:first-of-type {
  margin-left: 0;
}

.btn:last-of-type {
  margin-right: 0;
}

th {
  text-align: left;
  font-weight: bold;
}

th,
td {
  padding: 0px 10px 0px 10px;
}
</style>
