import {camelToSnakeCase} from './camel-to-snake-case';

/* Copy object while converting all keys from camel to snake case */
export function snakeCaseCopy(object: Record<string, unknown>) {
    const output: Record<string, unknown> = {};
    Object.keys(object).forEach((key) => {
        output[camelToSnakeCase(key)] = object[key];
    });
    return output;
}
