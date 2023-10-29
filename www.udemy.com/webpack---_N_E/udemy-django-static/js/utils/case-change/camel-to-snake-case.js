export default function camelToSnakeCase(str) {
  str = str.replace(
    /([^A-Z])([A-Z])/g,
    (_, $1, $2) => `${$1}_${$2.toLowerCase()}`
  );
  return str.toLowerCase();
}
