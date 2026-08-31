<script setup lang="ts">
import "leaflet/dist/leaflet.css"
import { LMap, LTileLayer, LPolygon } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";

const zoom = ref(10)

const polyLatLngs = ref<number[][]>([])


function mapClick(e: any) {
  const latLng = e.latlng;

  polyLatLngs.value.push([latLng.lat, latLng.lng])

  console.log(polyLatLngs)
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
</template>

<style scoped></style>
