/**
 * @param form: a DOM element representating a <form>.
 * Returns an object representation of the form.
 */
export function serializeForm(form) {
    const params = {};
    serializeArray(form).forEach(({name, value}) => {
        if (typeof params[name] === 'undefined') {
            params[name] = value;
        } else if (Array.isArray(params[name])) {
            params[name].push(value);
        } else {
            params[name] = [params[name], value];
        }
    });
    return params;
}
// This is adapted from the latest jQuery source for serializeArray:
// https://github.com/jquery/jquery/blob/438b1a3e8a52d3e4efd8aba45498477038849c97/src/serialize.js#L101
function serializeArray(form) {
    const rCRLF = /\r?\n/g,
        rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
        rsubmittable = /^(?:input|select|textarea|keygen)/i,
        rcheckableType = /^(?:checkbox|radio)$/i;
    return Array.from(form.elements)
        .filter((elem) => {
            return (
                elem.name &&
                !elem.disabled &&
                rsubmittable.test(elem.nodeName) &&
                !rsubmitterTypes.test(elem.type) &&
                (elem.checked || !rcheckableType.test(elem.type))
            );
        })
        .map((elem) => {
            const val = elem.value;
            if (val === null) {
                return null;
            }
            if (Array.isArray(val)) {
                return val.map((val) => {
                    return {name: elem.name, value: val.replace(rCRLF, '\r\n')};
                });
            }

            return {name: elem.name, value: val.replace(rCRLF, '\r\n')};
        });
}
