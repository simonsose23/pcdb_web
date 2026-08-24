// The serialization interface will only be used for the transmission via the API. It is not
// intended for UI rendering.

import type { Column } from "./Schema";

export interface SerializableExpression {
  serialize(): string
}

export class AtomicExpression implements SerializableExpression {
  expr_string: string;
  input_var: string | number | Date = 0
  cmp_target: Column | undefined = undefined

  constructor(expr_string: string) {
    this.expr_string = expr_string
  }

  serialize(): string {
    let s = '('

    s += this.cmp_target?.name as string

    s += this.expr_string

    let input_var = this.input_var;

    if (input_var instanceof Date) {
      input_var = (input_var as Date).toISOString()
      console.log("instanceof Date!")
    } else {
      console.log("NOT date")
    }

    s += input_var + ')'

    return s
  }
}

export class Operator implements SerializableExpression {
  op_string: string;
  expressions: SerializableExpression[] = []

  constructor(op_string: string) {
    this.op_string = op_string;
  }

  serialize(): string {
    let s = "("

    if (this.expressions.length > 0) {
      s += this.expressions[0]!.serialize()

      for (let i = 1; i < this.expressions.length; i++) {
        s += ' ' + this.op_string + ' '
        s += this.expressions[i]!.serialize()
      }
    }

    s += ")"

    return s
  }
}

export class Negation implements SerializableExpression {
  expression: SerializableExpression | null = null;

  constructor() { }

  serialize(): string {
    if (this.expression) {
      return "(not " + this.expression!.serialize() + ")";
    }
    else {
      return "(not ...)"
    }
  }
}

// TODO: extend to also support atomic expressions
export class QueryBuilder {
  base_expression: SerializableExpression | null = null

  constructor() { }

  serialize(): string {
    if (this.base_expression) {
      return this.base_expression.serialize()
    }

    return "NO OPERATOR"
  }
}

export function isOp(obj?: any) {
  return obj !== null && (obj as Operator).op_string !== undefined
}

export function isNeg(obj?: any) {
  return obj !== null && (obj as Negation).expression !== undefined
}

export function isAe(obj?: any) {
  return obj !== null && (obj as AtomicExpression).expr_string !== undefined
}
