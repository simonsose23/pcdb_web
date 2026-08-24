<script setup lang="ts">
import { AtomicExpression } from '@/util/QueryBuilder';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import { ref } from 'vue';

const props = defineProps({ ae: AtomicExpression })

let distVals = ref<string[]>([])

async function updateDistinct() {
  const distinctVals = await fetch("http://localhost:8080/distinct/" + props.ae!.cmp_target?.name!);

  distVals.value = await distinctVals.json() as string[]

  delete distVals.value[0]
  console.log("updated distVals!")
  console.log(distVals.value)
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
    </select>
    <div>
      <!-- Input  -->
      <v-select v-if="['String', 'Option < String >'].includes(props.ae!.cmp_target?.type!)"
        v-model="props.ae!.input_var" :options="distVals" style="background-color: white; color: black;"></v-select>
      <input v-if="['i32', 'i64'].includes(props.ae!.cmp_target?.type!)" type="number" step="1"
        v-model="props.ae!.input_var">
      <input v-if="['f32', 'f64'].includes(props.ae!.cmp_target?.type!)" type="number" step="any"
        v-model="props.ae!.input_var">
      <VueDatePicker v-if="['NaiveDateTime', 'Option < NaiveDateTime >'].includes(props.ae!.cmp_target?.type!)"
        v-model="props.ae!.input_var"></VueDatePicker>
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
