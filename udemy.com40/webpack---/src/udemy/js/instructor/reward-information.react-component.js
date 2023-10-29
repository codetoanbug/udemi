import {Image} from '@udemy/react-core-components';
import React, {Component} from 'react';

import RewardInfoImage from './assets/images/reward-info-image.png';
// eslint-disable-next-line no-unused-vars
import styles from './newcomer-challenge.less';

class RewardInformation extends Component {
    render() {
        return (
            <>
                <div styleName="styles.container-reward styles.container-reward-primary">
                    <div styleName="styles.container-reward-image-col">
                        <Image
                            src={RewardInfoImage}
                            styleName="styles.container-reward-image"
                            data-purpose="image"
                        />
                    </div>
                    <div styleName="styles.container-reward-content">
                        <div>
                            <p className="ud-heading-serif-xxl" data-purpose="title-part-one">
                                {gettext('The complete path from')}
                            </p>
                            <p className="ud-heading-serif-xxl" data-purpose="title-part-two">
                                {gettext('planning to promotion')}
                            </p>
                            <p
                                className="ud-text-md"
                                styleName="styles.lighter-text styles.subtitle"
                                data-purpose="subtitle"
                            >
                                {gettext(
                                    'Sign up, and we’ll help you stay on track with five info-packed emails ' +
                                        'and PDF guides for each part of your journey. Publish your course in 45 ' +
                                        'days, and we’ll share it with a social media announcement.',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default RewardInformation;
