import {Image} from '@udemy/react-core-components';
import {ValueProps} from '@udemy/react-structure-components';
import React, {Component} from 'react';

import getRequestData from 'utils/get-request-data';
import udLink from 'utils/ud-link';

import './pro-header-description.less';

export default class ProHeaderDescription extends Component {
    render() {
        return (
            <div styleName="value-props">
                <ValueProps size="large">
                    <ValueProps.Prop
                        image={
                            getRequestData().isMobile ? null : (
                                <Image
                                    src={udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-career-path.jpg',
                                    )}
                                    srcSet={`${udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-career-path.jpg',
                                    )} 1x, ${udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-career-path-2x.jpg',
                                    )} 2x`}
                                    alt=""
                                />
                            )
                        }
                        headline={gettext('Pick a path')}
                        text={gettext('Select a learning path in IT, Data or Development.')}
                    />
                    <ValueProps.Prop
                        image={
                            getRequestData().isMobile ? null : (
                                <Image
                                    src={udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-practice-labs.jpg',
                                    )}
                                    srcSet={`${udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-practice-labs.jpg',
                                    )} 1x, ${udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-practice-labs-2x.jpg',
                                    )} 2x`}
                                    alt=""
                                />
                            )
                        }
                        headline={gettext('Practice with labs')}
                        text={gettext(
                            'Paths have hands-on labs that will help you practice your skills.',
                        )}
                    />
                    <ValueProps.Prop
                        image={
                            getRequestData().isMobile ? null : (
                                <Image
                                    src={udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-personalized-guidance.jpg',
                                    )}
                                    srcSet={`${udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-personalized-guidance.jpg',
                                    )} 1x, ${udLink.toStorageStaticAsset(
                                        'learning-path/pro/value-prop-personalized-guidance-2x.jpg',
                                    )} 2x`}
                                    alt=""
                                />
                            )
                        }
                        headline={gettext('Get content recommendations')}
                        text={gettext('Take assessments to get guidance on where to focus.')}
                    />
                </ValueProps>
            </div>
        );
    }
}
