export function range(n: number) {
    return (
        Array(n)
            .fill('_')
            // eslint-disable-next-line @typescript-eslint/naming-convention
            .map((_, i) => i)
    );
}
