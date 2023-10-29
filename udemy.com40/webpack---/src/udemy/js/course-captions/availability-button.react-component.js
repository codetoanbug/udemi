import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {AUTO_TRANSCRIPTION_LANGUAGES, AVAILABILITY} from './constants';

@inject('store')
@observer
export default class AvailabilityButton extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    render() {
        const {
            translationRecord,
            togglingAvailability,
            course,
            isLanguageCourse,
        } = this.props.store;
        let buttonText, buttonStyle;

        // Caption is disabled when it's availability is RESTRICTED
        const isCaptionDisabled =
            translationRecord && translationRecord.availability === AVAILABILITY.RESTRICTED;

        /*
        This is used to determine if we disable button.
        We want to disable button for the courses in UB collection, the same locale
        as caption's locale and language is one of the AUTO transcription languages.
        Exception are courses in the language category/subcategory.
        * */

        const isUBCourseAutoCaption =
            course &&
            course.is_in_any_ufb_content_collection &&
            !isLanguageCourse &&
            translationRecord &&
            translationRecord.locale.locale === course.locale.locale &&
            AUTO_TRANSCRIPTION_LANGUAGES.includes(course.locale.locale.slice(0, 2));

        /*
         * Button is disabled when:
         * - we do not have translation record
         * - user clicked the button
         * - caption is enabled and is isUBCourseAutoCaption
         * */
        const isDisabled =
            !translationRecord ||
            togglingAvailability ||
            (!isCaptionDisabled && isUBCourseAutoCaption);

        if (isCaptionDisabled) {
            buttonText = gettext('Enable');
            buttonStyle = 'primary';
        } else {
            buttonText = gettext('Disable');
            buttonStyle = 'secondary';
        }

        const buttonComponent = (
            <Button
                disabled={isDisabled}
                data-purpose="toggle-caption-language-availability"
                onClick={this.props.store.toggleAvailability}
                udStyle={buttonStyle}
            >
                {buttonText}
            </Button>
        );

        if (isUBCourseAutoCaption && isDisabled) {
            return (
                <Popover canToggleOnHover={true} placement={'right'} trigger={buttonComponent}>
                    <b>
                        {gettext(
                            'All courses in the Udemy Business collection must have captions ' +
                                'enabled to maximize accessibility for learners.',
                        )}
                    </b>
                </Popover>
            );
        }

        return buttonComponent;
    }
}
