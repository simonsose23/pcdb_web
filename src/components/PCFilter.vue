<script setup lang="ts">
import { AtomicExpression, Negation, Operator, QueryBuilder, isOp, isAe, isNeg } from '@/util/QueryBuilder';
import { ref } from 'vue'
import FilterOperator from './FilterOperator.vue';
import FilterAtomicExpression from './FilterAtomicExpression.vue';
import FilterNegation from './FilterNegation.vue';

const model = defineModel()

let customText = ""

function addAe(new_ae: AtomicExpression) {
  qBuilder.value.base_expression = new_ae
}

function addOp(new_op: Operator) {
  qBuilder.value.base_expression = new_op
}

function addNeg(new_neg: Negation) {
  qBuilder.value.base_expression = new_neg
}

async function sendCustomRequest() {
  const res = await fetch("http://localhost:8080/filter/", {
    method: "POST", body:
      customText, headers: { "Content-Type": "text/plain" }
  })

  model.value = await res.json()
  console.log(model.value)
}

async function sendFilterRequest() {
  const res = await fetch("http://localhost:8080/filter/", {
    method: "POST", body:
      qBuilder.value.base_expression?.serialize(), headers: { "Content-Type": "text/plain" }
  })

  if (res.status == 200) {
    model.value = await res.json()
    console.log(model.value)
  } else {
    model.value = null
  }

}

let qBuilder = ref(new QueryBuilder())

</script>

<template>
  <div id="container">
    <h3>Filter</h3>
    <p>Write own expression:</p>
    <input type="text" v-model="customText">
    <button @click="sendCustomRequest()">Send</button>

    <p>Serialized expression: {{ qBuilder.serialize() }}</p>
    <FilterOperator v-if="isOp(qBuilder.base_expression)" :op="qBuilder.base_expression as Operator" />
    <FilterAtomicExpression v-if="isAe(qBuilder.base_expression)" :ae="qBuilder.base_expression as
      AtomicExpression" />
    <FilterNegation v-if="isNeg(qBuilder.base_expression)" :neg="qBuilder.base_expression as Negation" />

    <button v-if="qBuilder.base_expression !== null" @click="qBuilder.base_expression = null">X</button>

    <template v-if="qBuilder.base_expression == null">
      <!-- Button to add new operator -->
      <button @click="addOp(new Operator('xor'))">
        NEW OP
      </button>

      <!-- Button to add new atomic expression -->
      <button @click="addAe(new AtomicExpression('geq'))">
        NEW AE
      </button>

      <!-- Button to add new negated expression -->
      <button @click="addNeg(new Negation())">
        NEW NEGATION
      </button>
    </template>

    <!-- Send the request -->
    <button @click="sendFilterRequest()">Filter</button>
  </div>
</template>

<style scoped></style>
