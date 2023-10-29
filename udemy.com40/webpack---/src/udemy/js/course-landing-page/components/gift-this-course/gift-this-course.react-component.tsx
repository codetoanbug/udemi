import GiftIcon from '@udemy/icons/dist/gift.ud-icon';
import {IconButton, Button, ButtonHtmlProps} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import React from 'react';

import injectCourseLandingPageData from 'course-landing-page/components/inject-course-landing-component-context';

import {GiftCourseStore} from './gift-course.mobx-store';
import './gift-this-course.less';

export interface GiftThisCourseComponentContextProps {
    round?: boolean;
    gift_this_course_link?: string;
}

interface GiftThisCourseProps {
    componentContext?: GiftThisCourseComponentContextProps;
    giftCourseStore?: GiftCourseStore;
    buttonProps?: ButtonHtmlProps;
    uiRegion: string;
}

interface LocalButtonProps extends ButtonHtmlProps {
    'data-purpose': string;
}

@observer
class GiftThisCourseComponent extends React.Component<GiftThisCourseProps> {
    /**
     * Perform actions on button click
     */
    @autobind
    onButtonClick() {
        this.props.giftCourseStore?.handleGiftCourseClick(this.props.uiRegion);
    }

    render() {
        const {giftCourseStore: store, buttonProps} = this.props;

        if (!this.props.componentContext || store?.isLoading) {
            // This component isn't enabled, e.g. you can't gift a free course.
            return null;
        }

        const {round, gift_this_course_link: giftThisCourseLink = undefined} =
            this.props.componentContext || {};

        const localButtonProps: LocalButtonProps = {
            disabled: store?.isDisabled(giftThisCourseLink),
            href: store?.getGiftThisCourseLink(giftThisCourseLink),
            componentClass: 'a',
            udStyle: 'secondary',
            size: 'medium',
            'data-purpose': 'gift-course',
            onClick: this.onButtonClick,
            ...buttonProps,
        };

        if (round) {
            return (
                <IconButton {...localButtonProps} round={true}>
                    <GiftIcon label={gettext('Gift this course')} />
                </IconButton>
            );
        }

        return <Button {...localButtonProps}>{gettext('Gift this course')}</Button>;
    }
}

export {GiftThisCourseComponent as _GiftThisCourse};

export const GiftThisCourse = injectCourseLandingPageData(
    'gift_this_course',
    false,
)(GiftThisCourseComponent);
