import React from 'react';

interface StaticCurrencyProps {
    value: string;
}

const StaticCurrency = ({value}: StaticCurrencyProps) => <span>{value}</span>;

// eslint-disable-next-line import/no-default-export
export default StaticCurrency;
