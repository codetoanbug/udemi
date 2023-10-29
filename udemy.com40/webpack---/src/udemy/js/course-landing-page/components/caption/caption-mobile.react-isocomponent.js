import SubtitlesIcon from '@udemy/icons/dist/subtitles.ud-icon';
import {Button} from '@udemy/react-core-components';
import {BottomDrawer} from '@udemy/react-dialog-components';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import './caption.less';

@isomorphic
export default class CaptionMobile extends React.Component {
    static propTypes = {
        captioned_languages: PropTypes.array.isRequired,
    };

    render() {
        const VISIBLE_COUNT = 2;
        const {captioned_languages: captions} = this.props;
        if (!captions.length) {
            return null;
        }

        const visibleLanguages = captions.slice(0, VISIBLE_COUNT);
        const extraLanguages = captions.slice(VISIBLE_COUNT).map((language, i) => (
            <div key={i} styleName="bottom-drawer-language">
                {language}
            </div>
        ));

        const captionDrawerId = 'caption-drawer';
        return (
            <div className="ud-text-sm" styleName="captions">
                <SubtitlesIcon
                    size="xsmall"
                    label={false}
                    styleName="subtitles-icon"
                    role="img"
                    aria-label={gettext('Closed Captions')}
                    aria-hidden={false}
                />
                <span>{visibleLanguages.join(',\u00A0')}</span>
                {extraLanguages.length > 0 && <span>{',\u00A0'}</span>}
                {extraLanguages.length > 0 && (
                    <>
                        <Button
                            cssToggleId={captionDrawerId}
                            styleName="more-button"
                            typography="ud-text-sm"
                            udStyle="link"
                        >
                            {ninterpolate(
                                '%(count)s more',
                                '%(count)s more',
                                extraLanguages.length,
                                {
                                    count: extraLanguages.length,
                                },
                            )}
                        </Button>
                        <BottomDrawer id={captionDrawerId} title={gettext('Subtitles')}>
                            <div className="ud-text-md">{extraLanguages}</div>
                        </BottomDrawer>
                    </>
                )}
            </div>
        );
    }
}
