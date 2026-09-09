import type { WhereFilterOp } from 'firebase/firestore';
import type { WhereCondition } from '../types/firebase/firestore';

export type WhereClause = {
  field: string;
  operator: WhereFilterOp;
  value: unknown;
};

/**
 * Flatten nested where objects into dotted field paths.
 */
export function flattenWhereConditions<T>(
  conditions: WhereCondition<T>,
  prefix = '',
): Record<string, unknown> {
  return Object.entries(conditions).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null) {
        if ('operator' in value || 'not' in value) {
          acc[newKey] = value;
        } else {
          Object.assign(
            acc,
            flattenWhereConditions(value as WhereCondition<T>, newKey),
          );
        }
      } else {
        acc[newKey] = value;
      }

      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function whereClauses<T>(conditions?: WhereCondition<T>): WhereClause[] {
  if (!conditions) {
    return [];
  }

  return Object.entries(flattenWhereConditions(conditions)).map(
    ([field, condition]) => {
      if (
        typeof condition === 'object' &&
        condition !== null &&
        'operator' in condition
      ) {
        const { operator, value } = condition as {
          operator: WhereFilterOp;
          value: unknown;
        };
        return { field, operator, value };
      }

      if (
        typeof condition === 'object' &&
        condition !== null &&
        'not' in condition
      ) {
        const { not } = condition as { not: unknown };
        return { field, operator: '!=', value: not };
      }

      return { field, operator: '==', value: condition };
    },
  );
}
