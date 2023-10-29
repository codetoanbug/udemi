export function formatNumberCompact(value: number) {
    const ranges = [
        {divider: 1e6, suffix: 'M', decimalPlaces: 1},
        {divider: 1e3, suffix: 'K', decimalPlaces: 0},
    ];

    for (let i = 0; i < ranges.length; i++) {
        if (value >= ranges[i].divider) {
            return (value / ranges[i].divider).toFixed(ranges[i].decimalPlaces) + ranges[i].suffix;
        }
    }
    return value.toString();
}
