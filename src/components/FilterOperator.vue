<script setup lang="ts">
import { AtomicExpression, Operator, type SerializableExpression, isOp, isAe, isNeg, Negation } from '@/util/QueryBuilder';
import { ref } from 'vue';
import FilterAtomicExpression from './FilterAtomicExpression.vue';
import FilterNegation from './FilterNegation.vue';

const props = defineProps({ op: Operator })

function addOpA(new_op: SerializableExpression) {
  props.op!.expression_a = new_op
}

function removeExprA() {
  props.op!.expression_a = undefined
}

function exprASet() {
  return props.op!.expression_a !== undefined
}

function addOpB(new_op: SerializableExpression) {
  props.op!.expression_b = new_op
}

function removeExprB() {
  props.op!.expression_b = undefined
}

function exprBSet() {
  return props.op!.expression_b !== undefined
}

</script>

<template>
  <div id="operator">
    <div id="sub_op">
      <template v-if="!exprASet()">
        <!-- Button to add new operator -->
        <button @click="addOpA(new Operator('xor'))">
          NEW OP
        </button>

        <!-- Button to add new atomic expression -->
        <button @click="addOpA(new AtomicExpression('geq'))">
          NEW AE
        </button>

        <!-- Button to add new negated expression -->
        <button @click="addOpA(new Negation())">
          NEW NEGATION
        </button>
      </template>
      <template v-if="exprASet()">
        <FilterOperator v-if="isOp(op!.expression_a)" :op="op!.expression_a as Operator" />
        <FilterAtomicExpression v-if="isAe(op!.expression_a)" :ae="op!.expression_a as AtomicExpression" />
        <FilterNegation v-if="isNeg(op!.expression_a)" :neg="op!.expression_a as Negation" />
        <button @click="removeExprA()">X</button>
      </template>
    </div>

    <div id="cmp_select">
      <!-- operator mode selector -->
      <select v-model="op!.op_string">
        <option name="and">and</option>
        <option name="or">or</option>
        <option name="xor">xor</option>
      </select>
    </div>

    <div id="sub_op">
      <template v-if="!exprBSet()">
        <!-- Button to add new operator -->
        <button @click="addOpB(new Operator('xor'))">
          NEW OP
        </button>

        <!-- Button to add new atomic expression -->
        <button @click="addOpB(new AtomicExpression('geq'))">
          NEW AE
        </button>

        <!-- Button to add new negated expression -->
        <button @click="addOpB(new Negation())">
          NEW NEGATION
        </button>
      </template>
      <template v-if="exprBSet()">
        <FilterOperator v-if="isOp(op!.expression_b)" :op="op!.expression_b as Operator" />
        <FilterAtomicExpression v-if="isAe(op!.expression_b)" :ae="op!.expression_b as AtomicExpression" />
        <FilterNegation v-if="isNeg(op!.expression_b)" :neg="op!.expression_b as Negation" />
        <button @click="removeExprB()">X</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
#operator {
  padding: 10px;
  background-color: blue;
  border: 2px white solid;
  display: flex;
  flex-direction: column;
}

#operator> :nth-child(n) {
  margin-bottom: 10px;
}

#operator>:last-child {
  margin-bottom: 0;
}

#sub_op {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>
