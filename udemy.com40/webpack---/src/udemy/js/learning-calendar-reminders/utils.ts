export function lowercaseFirstChar(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export function uppercaseFirstChar(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
