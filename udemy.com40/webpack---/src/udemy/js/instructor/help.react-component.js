import HelpSupportIcon from '@udemy/icons/dist/help-support.ud-icon';
import QuestionAnswerIcon from '@udemy/icons/dist/question-answer.ud-icon';
import TeachIcon from '@udemy/icons/dist/teach.ud-icon';
import React, {Component} from 'react';

import udLink from 'utils/ud-link';

import InfoTiles from './info-tiles.react-component';

export default class Help extends Component {
    HELP_TILES = [
        {
            url: '/udemy-teach-hub/',
            icon: TeachIcon,
            label: gettext('Teaching Center'),
            info: gettext('Find articles on Udemy teaching — from course creation to marketing.'),
            trackEvent: 'teach_hub',
        },
        {
            url: udLink.toInstructorCommunity(),
            icon: QuestionAnswerIcon,
            label: gettext('Instructor Community'),
            info: gettext(
                'Share your progress and ask other instructors questions in our community.',
            ),
            trackEvent: 'instructor_community',
        },
        {
            url: '/support?type=instructor',
            icon: HelpSupportIcon,
            label: gettext('Help and Support'),
            info: gettext('Can’t find what you need? Our support team is happy to help.'),
            trackEvent: 'support',
        },
    ];

    render() {
        return (
            <div>
                <h1 className="instructor-main-heading ud-heading-serif-xxl">
                    {gettext('Resources')}
                </h1>
                <InfoTiles>
                    {this.HELP_TILES.map((tile) => (
                        <InfoTiles.Tile {...tile} key={tile.url} trackPage="help" />
                    ))}
                </InfoTiles>
            </div>
        );
    }
}
