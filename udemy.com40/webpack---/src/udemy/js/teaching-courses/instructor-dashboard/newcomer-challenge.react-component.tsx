import {Image, Link} from '@udemy/react-core-components';
import React, {Component} from 'react';

import udLink from 'utils/ud-link';

import './instructor-dashboard.less';

export class NewcomerChallenge extends Component {
    challenge = {
        name: 'video',
        title: gettext('Join the New Instructor Challenge!'),
        primaryText: gettext(
            'Get exclusive tips and resources designed to help you launch your first course faster! ' +
                'Eligible instructors who publish their first course on time will receive a special ' +
                'bonus to celebrate. Start today!',
        ),
        image: udLink.toStorageStaticAsset('instructor/dashboard/newcomer-challenge.jpg'),
        image2x: udLink.toStorageStaticAsset('instructor/dashboard/newcomer-challenge-2x.jpg'),
        urlText: gettext('Get Started'),
    };

    render() {
        const {image, image2x, title, primaryText, urlText} = this.challenge;
        return (
            <div styleName="panel resource-panel-primary">
                <div styleName="resource-image-col">
                    <Image
                        src={image}
                        srcSet={image2x && `${image} 1x, ${image2x} 2x`}
                        alt=""
                        width={300}
                        height={300}
                        styleName="resource-image"
                    />
                </div>
                <div styleName="resource-description-col">
                    <h3 className="ud-text-xl" styleName="resource-title">
                        {title}
                    </h3>
                    <p styleName="resource-text">{primaryText}</p>
                    <Link
                        to="/newcomer/"
                        rel="noopener noreferrer"
                        className="ud-link-underline"
                        data-purpose="start-newcomer-challenge"
                        id="start-newcomer-challenge"
                    >
                        {urlText}
                        <span className="ud-sr-only"> {title}</span>
                    </Link>
                </div>
            </div>
        );
    }
}
