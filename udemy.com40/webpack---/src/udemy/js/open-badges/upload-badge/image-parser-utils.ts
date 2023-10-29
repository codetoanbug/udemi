import extractChunks from 'png-chunks-extract';

export class BakedBadgeParsingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BakedBadgeParsingError';
    }
}

const PNG_ASSERTION_CHUNK_TYPE = 'iTXt';
const PNG_ASSERTION_DATA_OFFSET_BYTES = 5;
const PNG_ASSERTION_KEYWORD = 'openbadges';
const SVG_ASSERTION_TAG = 'openbadges:assertion';

// Done to make the method testable
export const extractPNGChunks = (buffer: Buffer) => extractChunks(buffer);

export const parseSVGFile = async (file: File) => {
    const svgData = new DOMParser().parseFromString(await file.text(), 'image/svg+xml');
    try {
        const assertion = svgData.getElementsByTagName(SVG_ASSERTION_TAG)[0];
        return assertion.getAttribute('verify'); // Do we need security related checks here?
    } catch (e) {
        throw new BakedBadgeParsingError('Unable to parse baked badge');
    }
};

/**
 * Parses the PNG file and returns the assertion id
 * Note: This method only supports raw JSON for now. Support for `signature`(Signed assertions) will be added soon.
 * @param file
 */
export const parsePNGFile = async (file: File) => {
    const pngArrayBuffer = await file.arrayBuffer();
    const nodeBuffer = Buffer.from(pngArrayBuffer);
    const chunks = extractPNGChunks(nodeBuffer);
    const iTXtChunks = chunks.filter((chunk: any) => chunk.name === PNG_ASSERTION_CHUNK_TYPE);
    const assertionChunk = getAssertionChunk(iTXtChunks);
    if (!assertionChunk) {
        throw new BakedBadgeParsingError('No assertion found in PNG file');
    }
    const assertionChunkData = parseAssertionDataFromChunk(assertionChunk);
    // TODO: check for type of verification
    const assertionData = JSON.parse(assertionChunkData);
    return assertionData.id;
};

const getAssertionChunk = (chunks: any[]) => {
    const textDecoder = new TextDecoder();

    const assertionChunk = chunks
        .map((chunk: any) => {
            return textDecoder.decode(chunk.data);
        })
        .find((chunkData: string) => {
            return chunkData.startsWith(PNG_ASSERTION_KEYWORD);
        });
    if (!assertionChunk) {
        throw new BakedBadgeParsingError('No assertion found in PNG file');
    }
    return assertionChunk;
};

/**
 * Parses assertion data from the PNG iTXT chunk
 * iTXt chunk is a text chunk that contains international textual data.
 *
 * The structure of the chunk is described here:
 *    Keyword:             1-79 bytes (character string)
 *    Null separator:      1 byte
 *    Compression flag:    1 byte
 *    Compression method:  1 byte
 *    Language tag:        0 or more bytes (character string)
 *    Null separator:      1 byte
 *    Translated keyword:  0 or more bytes
 *    Null separator:      1 byte
 *    Text:                0 or more bytes
 *
 * http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html
 *
 * Compression is not supposed to used while baking PNG images with assertion data.
 * So, we can safely ignore the compression flag and compression method.
 * Similarly, we can ignore the language tag and translated keyword
 * as per the baking instructions mentioned at the below link.
 * https://www.imsglobal.org/sites/default/files/Badges/OBv2p0Final/baking/index.html
 *
 * Therefore, we can safely assume that the assertion data starts after the keyword and another 5 bytes.
 *
 * @param chunkData
 */
const parseAssertionDataFromChunk = (chunkData: string) => {
    return chunkData.slice(PNG_ASSERTION_KEYWORD.length + PNG_ASSERTION_DATA_OFFSET_BYTES);
};
