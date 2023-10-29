export function shouldSampleVisitor(visitorUuid: string, sampleRate: number) {
    const uuidChunk = visitorUuid.slice(0, 8);
    const visitorInt = parseInt(uuidChunk, 16);
    return visitorInt % 1000 < sampleRate * 1000;
}

export function warn(message: string) {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(message);
    }
}
