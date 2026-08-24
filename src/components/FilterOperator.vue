<script setup lang="ts">
import { AtomicExpression, Operator, type SerializableExpression, isOp, isAe, isNeg, Negation } from '@/util/QueryBuilder';
import { ref } from 'vue';
import FilterAtomicExpression from './FilterAtomicExpression.vue';
import FilterNegation from './FilterNegation.vue';

const props = defineProps({ op: Operator })

function addOp(new_op: Operator) {
  props.op?.expressions.push(new_op)
}

function addAe(new_ae: AtomicExpression) {
  props.op?.expressions.push(new_ae)
}

function addNeg(new_neg: Negation) {
  props.op?.expressions.push(new_neg)
}

function removeExpr(expr: SerializableExpression) {
  let idx = props.op?.expressions.indexOf(expr)

  props.op?.expressions.splice(idx!, 1)
}

</script>

<template>
  <div id="operator">
    <!-- operator mode selector -->
    <select v-model="op!.op_string">
      <option name="and">and</option>
      <option name="or">or</option>
      <option name="xor">xor</option>
    </select>

    <!-- Iterate over its expressions recursively -->
    <template v-for="expr in op?.expressions">
      <FilterOperator v-if="isOp(expr)" :op="expr as Operator" />
      <FilterAtomicExpression v-if="isAe(expr)" :ae="expr as AtomicExpression" />
      <FilterNegation v-if="isNeg(expr)" :neg="expr as Negation" />
      <button @click="removeExpr(expr)">X</button>
    </template>

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

<style scoped>
#operator {
  padding: 10px;
  background-color: blue;
  border: 2px white solid;
}
</style>
