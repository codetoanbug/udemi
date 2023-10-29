import React from 'react';

export interface StaticCurrencyProps {
    value: string;
}

export const StaticCurrency = ({value}: StaticCurrencyProps) => <span>{value}</span>;
