export default function snakeToCamelCase(str) {
    return str.replace(/([-_]\w)/g, (s) => s[1].toUpperCase());
}
