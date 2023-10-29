import handleImportError from 'utils/handle-import-error';

const BIT_MASK = [0x00, 0x80, 0xc0, 0xe0, 0xf0, 0xf8, 0xfc, 0xfe, 0xff];

function intToAlphastring(i) {
    // Convert numbers to cap alpha strings 0 -> A,  26 -> AA, etc
    if (i < 0) {
        return '';
    }
    return intToAlphastring(Math.floor(i / 26) - 1) + String.fromCharCode(65 + (i % 26));
}

function leadingBitsZero(numBits, barray) {
    // Test the leading bits of a byte array for zero.
    let nbyte = 0;
    while (numBits > 0) {
        if (numBits > 7) {
            if (barray[nbyte] != 0) {
                return false;
            }
            numBits -= 8;
            nbyte += 1;
        } else if (numBits > 0) {
            if ((barray[nbyte] & BIT_MASK[numBits]) != 0) {
                return false;
            }
            break;
        }
    }
    return true;
}

// eslint-disable-next-line import/prefer-default-export
export function generateUpow(salt, email, powdt) {
    return import(/* webpackChunkName: "create-hmac" */ 'create-hmac')
        .then(({default: createHmac}) => {
            // Generate proof of work string
            // ie hash(email+powdt+upow) meets the current criteria
            // We use this to ensure that unauthenticated api clients have to
            // show some effort to use the api.
            let len = 0;
            while (true) {
                const powhash = intToAlphastring(len);
                const thash = createHmac('sha256', salt);
                thash.update(email + powdt + powhash);
                if (leadingBitsZero(16, thash.digest())) {
                    return powhash;
                }
                len += 1;
            }
        })
        .catch(handleImportError);
}
