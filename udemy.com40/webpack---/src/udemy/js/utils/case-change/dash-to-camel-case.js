export default function dashToCamelCase(str) {
    return str.replace(/([-][a-z])/gi, ($1) => $1.toUpperCase().replace('-', ''));
}
