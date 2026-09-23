<script setup lang="ts">
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LPolygon } from "@vue-leaflet/vue-leaflet";
import { onMounted, ref } from "vue";
import { epsgFromShapefile, shapefileToArray } from "@/util/ShapefileImport";

const zoom = ref(10)

const emit = defineEmits(['mapUpdate'])

const polyLatLngs = ref<number[][]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)

function mapClick(e: any) {
  const latLng = e.latlng;

  polyLatLngs.value.push([latLng.lat, latLng.lng])

  emit('mapUpdate', polyLatLngs.value)
}

function clearPolygon() {
  polyLatLngs.value = []
  emit('mapUpdate', [])
}

function openFilePicker() {
  epsgFromShapefile();
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}


async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  polyLatLngs.value = await shapefileToArray(await file?.arrayBuffer()!);

  emit('mapUpdate', polyLatLngs.value);
}
</script>

<template>
  <div style="width: 600px; height: 400px;">
    <l-map @click="mapClick($event)" ref="map" v-model:zoom="zoom" :center="[52.40635, 13.05038]">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base"
        name="OpenStreetMap"></l-tile-layer>
      <l-polygon :latLngs="polyLatLngs" :key="polyLatLngs.length"></l-polygon>
    </l-map>
  </div>
  <button @click="clearPolygon()">Clear Polygon</button>
  <button @click="openFilePicker()">Load Polygon from File</button>
  <input ref="fileInputRef" type="file" accept=".zip" style="display: none;" @change="handleFileSelect($event)" />
</template>

<style scoped></style>
