<script setup lang="ts">
import { AtomicExpression } from '@/util/QueryBuilder';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { ref } from 'vue';
import PolygonEditor from './PolygonEditor.vue';

const props = defineProps({ ae: AtomicExpression })

let distVals = ref<string[]>([])

async function updateDistinct() {
  if (!['String', 'Option < String >'].includes(props.ae!.cmp_target?.type!)) return
  const distinctVals = await fetch("http://localhost:8080/distinct/" + props.ae!.cmp_target?.name!);

  distVals.value = await distinctVals.json() as string[]

  distVals.value = distVals.value.filter(x => x !== undefined && x !== "")
}

function formatDate(date: Date): string {
  return date.toISOString();
}
</script>

<template>
  <div id="ae">
    <v-select :options="$schema" label="name" v-model="props.ae!.cmp_target"
      style="background-color: white; color: black;" @option:selected="updateDistinct()"></v-select>
    <select v-model="props.ae!.expr_string">
      <!-- Comparator set for integer/float/datetime -->
      <template v-if="['i32', 'i64', 'f64', 'Option < NaiveDateTime >',
        'NaiveDateTime'].includes(props.ae!.cmp_target?.type!)">
        <option name="geq">&gt;=</option>
        <option name="leq">&lt;=</option>
        <option name="eq">=</option>
        <option name="gr">&gt;</option>
        <option name="le">&lt;</option>
      </template>
      <!-- Comparator set for string -->
      <template v-if="['Option < String >', 'String'].includes(props.ae!.cmp_target?.type!)">
        <option name="like">=</option>
        <option name="notlike">!=</option>
      </template>
      <!-- Comparator set for polygon> -->
      <template v-if="['GeometryContainer < Point >'].includes(props.ae!.cmp_target?.type!)">
        <option name="intersect">=</option>
      </template>
    </select>
    <div>
      <!-- Input  -->

      <!-- String input -->
      <v-select v-if="['String', 'Option < String >'].includes(props.ae!.cmp_target?.type!)"
        v-model="props.ae!.input_var" :options="distVals" style="background-color: white; color: black;"></v-select>

      <!-- Datetime input -->
      <VueDatePicker v-if="['NaiveDateTime', 'Option < NaiveDateTime >'].includes(props.ae!.cmp_target?.type!)"
        v-model="props.ae!.input_var as Date"></VueDatePicker>

      <!-- Number input -->
      <div v-if="['f32', 'f64', 'i32', 'i64'].includes(props.ae!.cmp_target?.type!)">
        <input type="number" step="any" v-model="props.ae!.input_var"><button
          @click="props.ae!.input_var = null">X</button>
      </div>

      <!-- Polygon input -->
      <div v-if="['GeometryContainer < Point >'].includes(props.ae!.cmp_target?.type!)">
        <PolygonEditor @mapUpdate="props.ae!.input_var = $event"></PolygonEditor>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "vue-select/dist/vue-select.css";

#ae {
  padding: 10px;
  background-color: green;
  border: 2px white solid;
}
</style>
