import {useI18n} from '@udemy/i18n';
import {MarketplaceOnly} from '@udemy/react-brand-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

// Note, `ud-full-viewport-container` provided by scaffolding.global.less from `@udemy/styles`
const RefundNotice = (props) => {
    const {gettext} = useI18n();
    return (
        <MarketplaceOnly>
            <div
                className={classNames(props.className, {
                    'ud-full-viewport-container': props.fullWidth,
                })}
            >
                <AlertBanner
                    showCta={false}
                    title={gettext('Not sure? All courses have a 30-day money-back guarantee')}
                />
            </div>
        </MarketplaceOnly>
    );
};

RefundNotice.propTypes = {
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
};

RefundNotice.defaultProps = {
    className: '',
    fullWidth: false,
};

export default React.memo(RefundNotice);
