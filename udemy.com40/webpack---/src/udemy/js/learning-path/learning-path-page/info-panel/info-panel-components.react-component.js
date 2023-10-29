import {onEnterAndSpace} from '@udemy/design-system-utils';
import BulletIcon from '@udemy/icons/dist/bullet.ud-icon';
import ScheduleIcon from '@udemy/icons/dist/schedule.ud-icon';
import {Avatar} from '@udemy/react-core-components';
import {Duration} from '@udemy/react-date-time-components';
import PropTypes from 'prop-types';
import React from 'react';

import {USER_IMAGE_SIZE} from '../constants';
import EditorsDetailsDesktop from './editors-details-desktop.react-component';

import './info-panel.less';

export const EditorsHeading = ({numEditors}) => {
    return (
        <div className="ud-heading-sm" styleName="editors-text">
            {ngettext('Editor', 'Editors', numEditors)}
        </div>
    );
};

EditorsHeading.propTypes = {
    numEditors: PropTypes.number.isRequired,
};

export const Editors = ({owner, editors, isMobileViewportSize, showMobilePathEditorsModal}) => {
    return (
        <>
            <Avatar
                user={owner}
                alt="DISPLAY_NAME"
                srcKey="image_50x50"
                size={USER_IMAGE_SIZE}
                styleName="owner-image"
            />
            {isMobileViewportSize ? (
                <EditorsDetailsMobile
                    editors={editors}
                    showMobilePathEditorsModal={showMobilePathEditorsModal}
                />
            ) : (
                <EditorsDetailsDesktop owner={owner} editors={editors} />
            )}
        </>
    );
};

Editors.propTypes = {
    owner: PropTypes.object.isRequired,
    editors: PropTypes.object.isRequired,
    isMobileViewportSize: PropTypes.bool,
    showMobilePathEditorsModal: PropTypes.func,
};

Editors.defaultProps = {
    isMobileViewportSize: false,
    showMobilePathEditorsModal: undefined,
};

export const EditorsDetailsMobile = ({editors, showMobilePathEditorsModal}) => {
    // If there is only 1 editor it is the owner so we don't need to display the extra editors details
    if (editors.length <= 1) {
        return null;
    }

    return (
        <div
            role="link"
            tabIndex="0"
            onKeyDown={onEnterAndSpace(showMobilePathEditorsModal)}
            onClick={showMobilePathEditorsModal}
            styleName="extra-editors"
            data-purpose="extra-editors-detail-mobile"
        >
            {interpolate(gettext('+%(number)s'), {number: editors.length - 1}, true)}
        </div>
    );
};

EditorsDetailsMobile.propTypes = {
    editors: PropTypes.object.isRequired,
    showMobilePathEditorsModal: PropTypes.func.isRequired,
};

export const Overview = ({totalDuration, itemsCount}) => (
    <>
        <ScheduleIcon styleName="schedule-icon" label={false} />
        <Duration
            data-purpose="learning-path-duration"
            // Total duration is in minutes - component only accepts seconds so need to * 60
            numSeconds={totalDuration * 60}
        />
        <BulletIcon styleName="bullet-icon" size="xsmall" label={false} />
        <span styleName="item-count">
            {ninterpolate('%(itemsCount)s item', '%(itemsCount)s items', itemsCount, {
                itemsCount,
            })}
        </span>
    </>
);

Overview.propTypes = {
    totalDuration: PropTypes.number.isRequired,
    itemsCount: PropTypes.number.isRequired,
};
