<script setup lang="ts">
import { AtomicExpression, Negation, Operator, QueryBuilder, isOp, isAe, isNeg } from '@/util/QueryBuilder';
import { ref } from 'vue'
import FilterOperator from './FilterOperator.vue';
import FilterAtomicExpression from './FilterAtomicExpression.vue';
import FilterNegation from './FilterNegation.vue';

const model = defineModel()

const err_msgs = ref<{ err_custom?: string, err_query?: string }>({
  err_custom: undefined,
  err_query: undefined
})

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

  console.log(model.value)

  if (res.status == 200) {
    model.value = await res.json()
    err_msgs.value!.err_custom = undefined
  } else {
    err_msgs.value!.err_custom = await res.text() as string
  }
}

async function sendFilterRequest() {
  const res = await fetch("http://localhost:8080/filter/", {
    method: "POST", body:
      qBuilder.value.base_expression?.serialize(), headers: { "Content-Type": "text/plain" }
  })

  if (res.status == 200) {
    model.value = await res.json()
    err_msgs.value.err_query = undefined
  } else {
    err_msgs.value!.err_query = await res.text() as string
  }

}

let qBuilder = ref(new QueryBuilder())

</script>

<template>
  <div id="container">
    <h3>Filter</h3>
    <div id="section">
      <p>Write own expression:</p>
      <div id="own_query">
        <input type="text" v-model="customText">
        <button @click="sendCustomRequest()">Send</button>
      </div>
      <!-- Error display -->
      <span v-if="err_msgs.err_custom" style="display: flex;">
        <p style="font-weight: bold; margin-right: 5px;">ERR</p>
        <p>{{ err_msgs.err_custom }}</p>
      </span>
    </div>

    <div id="section">
      <p>Serialized expression: {{ qBuilder.serialize() }}</p>

      <div id="op_base">
        <FilterOperator v-if="isOp(qBuilder.base_expression)" :op="qBuilder.base_expression as Operator" />
        <FilterAtomicExpression v-if="isAe(qBuilder.base_expression)" :ae="qBuilder.base_expression as
          AtomicExpression" />
        <FilterNegation v-if="isNeg(qBuilder.base_expression)" :neg="qBuilder.base_expression as Negation" />

        <button v-if="qBuilder.base_expression !== null" @click="qBuilder.base_expression = null">X</button>
      </div>

      <template v-if="qBuilder.base_expression == null">
        <div id="btns">
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
        </div>
      </template>

      <div>
        <!-- Send the request -->
        <button @click="sendFilterRequest()">Send Filter Request</button>

        <!-- Error display -->
        <span v-if="err_msgs.err_query" style="display: flex;">
          <p style="font-weight: bold; margin-right: 5px;">ERR</p>
          <p>{{ err_msgs.err_query }}</p>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
#section {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

#section:last-child {
  margin-bottom: 0;
}

#op_base {
  display: flex;
  flex-direction: row;
}
</style>
