<script setup lang="ts">
import { AtomicExpression, Negation, Operator, type SerializableExpression, isOp, isAe, isNeg } from '@/util/QueryBuilder';
import FilterAtomicExpression from './FilterAtomicExpression.vue';
import FilterOperator from './FilterOperator.vue';

const props = defineProps({ neg: Negation })

function addOp(new_op: Operator) {
  props.neg!.expression = new_op
}

function addAe(new_ae: AtomicExpression) {
  props.neg!.expression = new_ae
}

function removeExpr() {
  props.neg!.expression = null
}


</script>

<template>
  <div id="negation">
    NOT

    <!-- Render the negated expression -->
    <FilterOperator v-if="isOp(neg?.expression)" :op="neg!.expression as Operator" />
    <FilterAtomicExpression v-if="isAe(neg?.expression)" :ae="neg!.expression as AtomicExpression" />

    <button v-if="neg?.expression !== null" @click="removeExpr()">X</button>
    <template v-if="neg?.expression == null">
      <!-- Button to add new operator -->
      <button @click="addOp(new Operator('xor'))">
        NEW OP
      </button>

      <!-- Button to add new atomic expression -->
      <button @click="addAe(new AtomicExpression('geq'))">
        NEW AE
      </button>
    </template>
  </div>
</template>

<style scoped>
#negation {
  padding: 10px;
  background-color: red;
  border: 2px white solid;
}
</style>
