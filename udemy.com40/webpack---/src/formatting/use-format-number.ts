import React from 'react';

import {useI18n} from '../use-i18n';
import {formatNumber, formatRoundNumber} from './format-number';

export function useFormatNumber() {
    const i18n = useI18n();

    const _formatNumber = React.useCallback(
        (value: number | string, options: Intl.NumberFormatOptions = {}) => {
            return formatNumber(value, i18n.locale, options);
        },
        [i18n.locale],
    );

    return {formatNumber: _formatNumber};
}

export function useFormatRoundNumber() {
    const i18n = useI18n();

    const _formatRoundNumber = React.useCallback(
        (value: number | string, precision = 0, options: Intl.NumberFormatOptions = {}) => {
            return formatRoundNumber(value, precision, i18n.locale, options);
        },
        [i18n.locale],
    );

    return {formatRoundNumber: _formatRoundNumber};
}
