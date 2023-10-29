import React from 'react';

import './money-back-guarantee.less';

export interface MoneyBackGuaranteeComponentContextProps {
    is_enabled: boolean;
    cta_refund_policy?: {
        text: string;
        url: string;
    };
}

interface MoneyBackGuaranteeProps {
    moneyBackGuarantee?: MoneyBackGuaranteeComponentContextProps;
    style?: string;
}

export const MoneyBackGuarantee = ({moneyBackGuarantee, style}: MoneyBackGuaranteeProps) => {
    let refundPolicyLink = null;
    if (!moneyBackGuarantee?.is_enabled) {
        return null;
    }
    if (moneyBackGuarantee?.cta_refund_policy) {
        const ctaRefundPolicy = moneyBackGuarantee.cta_refund_policy;
        refundPolicyLink = (
            <>
                {' | '}
                <a
                    className="ud-link-underline"
                    styleName="refund-policy"
                    data-purpose="refund-policy-link"
                    href={ctaRefundPolicy.url}
                >
                    {ctaRefundPolicy.text}
                </a>
            </>
        );
    }
    return (
        <div
            styleName={style ?? 'money-back-guarantee'}
            data-purpose="money-back-guarantee"
            className="dark-bg-text"
        >
            <span className="money-back">
                {gettext('30-Day Money-Back Guarantee')}
                {refundPolicyLink}
            </span>
        </div>
    );
};
