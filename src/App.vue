<script setup lang="ts">
import { ref } from 'vue'
import PCFilter from './components/PCFilter.vue'
import PolygonCanvas from './components/PolygonCanvas.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import PolygonEditor from './components/PolygonEditor.vue'
import { isMultiPolygon, isPolygon, type MultiPolygon } from './util/Polygon'

type GeoreferencedPointCloud = { file: File, crs: String | undefined }

const pc_metas = ref(null)
const upload_pcs = ref<GeoreferencedPointCloud[]>([])
const upload_status = ref<{ text: string, error: boolean } | undefined>(undefined)

async function get_pc_metas() {

  const req = await fetch("http://localhost:8080/list/", { method: 'GET', headers: { Accept: 'application/json' } })

  pc_metas.value = await req.json()
}

get_pc_metas()

function fileSelect(e: Event) {
  const input = e.target as HTMLInputElement;
  const filesAsArray = Array.from(input?.files || [])
  upload_pcs.value = filesAsArray.map((v) => { return { file: v, crs: undefined } })
}

async function upload() {
  upload_status.value = { text: "Uploading " + upload_pcs.value[0]!.file.name + "...", error: false }
  const res = await fetch("http://localhost:8080/upload/" + upload_pcs.value[0]!.crs, {
    method: 'POST', body: await
      upload_pcs.value[0]!.file.arrayBuffer()
    , headers: { "Content-Type": "multipart/form-data" }
  })

  if (res.status == 200) {
    upload_status.value = { text: upload_pcs.value[0]!.file.name + ": Upload successful.", error: false }
  } else {
    upload_status.value = { text: await res.text() as string, error: true }
  }
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
    <!-- File select -->
    <div>
      <input id="file-input" type="file" multiple="false" @change="fileSelect" hidden>
      <label class="btn" for="file-input">Select LAS</label>
    </div>

    <ul v-for="(pc, i) in upload_pcs">
      <li>{{ pc.file.name }}</li>
      <li><input type="string" placeholder="CRS" v-model="upload_pcs[i]!.crs"></li>
    </ul>

    <!-- Start upload -->
    <div>
      <button id="upload-btn" @click="upload" hidden></button>
      <label class="btn" for="upload-btn" v-if="upload_pcs.length > 0">Start Upload</label>
    </div>

    <div v-if="upload_status">
      <p v-if="!upload_status!.error">{{ upload_status.text }}</p>
      <p v-if="upload_status!.error">
      <p style="font-weight: bold; margin-right: 5px;">ERR:</p>
      <p>{{ upload_status.text }}</p>
      </p>
    </div>
  </div>
</template>

<style scoped>
#container {
  border: 2px solid #ffffff;
  padding: 10px;
  display: flex;
  flex-direction: column;

  >* {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}

.btn {
  background-color: darkblue;
  border: 1px solid lightblue;
  padding: 10px;
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
