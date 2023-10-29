import {ClientSideRender} from '@udemy/design-system-utils';
import {LocalizedHtml} from '@udemy/i18n';
import UdemySymbolIcon from '@udemy/icons/dist/udemy-symbol.ud-icon';
import {toBusinessUdemy} from '@udemy/organization';
import {Image} from '@udemy/react-core-components';
import {ModalTrigger} from '@udemy/react-dialog-components';
import {TextSkeleton} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import TopCompaniesNotice from 'browse/components/notices/top-companies-notice.react-component';
import {UI_REGION} from 'browse/ui-regions';
import CourseLandingComponentsStore from 'course-landing-page/course-landing-components.mobx-store';
import {isomorphic} from 'utils/isomorphic-rendering';

import badge from './badge.svg';
import {CuratedForUBNoticeModal} from './curated-for-ub-notice-modal.react-component';
import styles from './curated-for-ufb-notice.less';

export const variants = {
    CONTROL: 'control',
    QUALITY: 'quality',
    TRUST: 'trust',
    QUALITY_AND_TRUST: 'quality_and_trust',
};

const refCodes = {
    QUALITY: 'quality-notice',
    TRUST: 'trust-notice',
    QUALITY_AND_TRUST: 'both-notice',
};

@isomorphic
@observer
export default class CuratedForUfbNotice extends Component {
    static propTypes = {
        clcStore: PropTypes.instanceOf(CourseLandingComponentsStore),
    };

    static defaultProps = {
        clcStore: undefined,
    };

    componentDidMount() {
        this.props.clcStore
            ?.getOrPopulate(['curated_for_ufb_notice_context', 'purchase'])
            .then(this.updateNoticeContext);
    }

    @observable.ref noticeContext;
    @observable isEnrolled;

    @autobind
    @action
    updateNoticeContext(componentContexts) {
        this.noticeContext = componentContexts.curated_for_ufb_notice_context?.noticeContext;
        this.isEnrolled = componentContexts.purchase?.data?.is_valid_student;
    }

    @autobind
    qualityBadge() {
        return (
            <Image
                styleName="curated-for-ufb-notice-left-icon"
                src={badge}
                alt=""
                height={39}
                width={32}
            />
        );
    }

    @autobind
    ufbLink() {
        return toBusinessUdemy(undefined, {
            ref: `clp-body_control_${this.noticeContext.courseCategory}`,
            mx_pg: this.noticeContext.ufbLinkParams.mx_pg,
        });
    }

    @autobind
    learnMore(ubLinkRefCode) {
        return (
            <ModalTrigger
                trigger={<a className="ud-link-underline">{gettext('Learn more')}</a>}
                renderModal={(props) => (
                    <CuratedForUBNoticeModal
                        courseCategory={this.noticeContext.courseCategory}
                        ubLinkParams={{
                            ...this.noticeContext.ufbLinkParams,
                            ref: `clp-body_${ubLinkRefCode}_${this.noticeContext.courseCategory}`,
                        }}
                        {...props}
                    />
                )}
            />
        );
    }

    @autobind
    content() {
        if (this.noticeContext.variant === variants.QUALITY) {
            return (
                <>
                    {this.qualityBadge()}
                    <div styleName="curated-for-ufb-notice-text">
                        <span className="ud-heading-md" data-purpose="title-text">
                            {gettext('One of our best')}
                        </span>
                        <span className="ud-text-sm" styleName="curated-for-ufb-notice-text-body">
                            {gettext(
                                'This top-rated course was selected for the Udemy Business Collection.',
                            )}{' '}
                            {this.learnMore(refCodes.QUALITY)}
                        </span>
                    </div>
                </>
            );
        }

        if (this.noticeContext.variant === variants.TRUST) {
            return (
                <>
                    <div styleName="curated-for-ufb-notice-text">
                        <span className="ud-heading-md" data-purpose="title-text">
                            {gettext('Top companies offer this course to their employees')}
                        </span>
                        <span className="ud-text-sm" styleName="curated-for-ufb-notice-text-body">
                            {gettext(
                                'This course was selected for our collection of top-rated courses trusted by businesses worldwide.',
                            )}{' '}
                            {this.learnMore(refCodes.TRUST)}
                        </span>
                    </div>
                    <div styleName="curated-for-ufb-notice-logos">
                        {TopCompaniesNotice.renderLogos({
                            className: styles['top-companies-logos'],
                            imageHeight: 38,
                        })}
                    </div>
                </>
            );
        }

        if (this.noticeContext.variant === variants.QUALITY_AND_TRUST) {
            return (
                <>
                    {this.qualityBadge()}
                    <div styleName="curated-for-ufb-notice-text">
                        <span className="ud-heading-md" data-purpose="title-text">
                            {gettext('One of our best')}
                        </span>
                        <span className="ud-text-sm" styleName="curated-for-ufb-notice-text-body">
                            {gettext(
                                'This course was selected for our collection of top-rated courses trusted by businesses worldwide.',
                            )}{' '}
                            {this.learnMore(refCodes.QUALITY_AND_TRUST)}
                        </span>
                    </div>
                    <div styleName="curated-for-ufb-notice-logos">
                        {TopCompaniesNotice.renderLogos({
                            className: styles['top-companies-logos'],
                            imageHeight: 38,
                        })}
                    </div>
                </>
            );
        }

        return (
            <>
                <UdemySymbolIcon
                    size="large"
                    styleName="curated-for-ufb-notice-left-icon"
                    label={false}
                />
                <LocalizedHtml
                    className="ud-heading-md"
                    styleName="curated-for-ufb-notice-title"
                    data-purpose="title-text"
                    html={gettext(
                        'Curated for the <a class="ufbLink">Udemy Business</a> collection',
                    )}
                    interpolate={{
                        ufbLink: (
                            <a
                                href={this.ufbLink()}
                                /* eslint-disable-next-line react/jsx-no-target-blank */
                                target="_blank"
                                className="ud-link-underline"
                            />
                        ),
                    }}
                />
            </>
        );
    }

    render() {
        const placeholder = (
            <div className="component-margin" styleName="curated-for-ufb-notice">
                <TextSkeleton
                    styleName="curated-for-ufb-notice-loader"
                    withTitle={true}
                    lineCountPerParagraph={3}
                />
            </div>
        );

        if (!this.noticeContext) {
            return placeholder;
        }

        if (this.noticeContext && this.isEnrolled === true) {
            return null;
        }

        return (
            <ClientSideRender placeholder={placeholder} uiRegion={UI_REGION.CURATED_FOR_UB}>
                <div
                    className="component-margin"
                    styleName={classNames(
                        'curated-for-ufb-notice',
                        `curated-for-ufb-notice--${this.noticeContext.variant}`,
                    )}
                >
                    {this.content()}
                </div>
            </ClientSideRender>
        );
    }
}
