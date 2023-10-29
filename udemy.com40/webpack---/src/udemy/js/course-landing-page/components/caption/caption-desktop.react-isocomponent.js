import SubtitlesIcon from '@udemy/icons/dist/subtitles.ud-icon';
import {Button} from '@udemy/react-core-components';
import autobind from 'autobind-decorator';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {isomorphic} from 'utils/isomorphic-rendering';

import './caption.less';

@isomorphic
@observer
export default class CaptionDesktop extends React.Component {
    static propTypes = {
        captioned_languages: PropTypes.array.isRequired,
    };

    @observable isExpanded = false;

    @autobind
    @action
    handleClick() {
        this.isExpanded = true;
    }

    render() {
        const VISIBLE_COUNT = 2;
        const {captioned_languages: captions} = this.props;
        if (!captions.length) {
            return null;
        }

        const visibleLanguages = captions.slice(0, VISIBLE_COUNT);
        const extraLanguages = captions.slice(VISIBLE_COUNT);
        const additionalCaptions = !this.isExpanded ? (
            <Button
                udStyle="link"
                size="medium"
                onClick={this.handleClick}
                styleName="more-button"
                typography="ud-text-sm"
                data-purpose="caption-more"
            >
                {ninterpolate('%(count)s more', '%(count)s more', extraLanguages.length, {
                    count: extraLanguages.length,
                })}
            </Button>
        ) : (
            <span data-purpose="extra-languages">{extraLanguages.join(', ')}</span>
        );

        return (
            <div className="ud-text-sm" styleName="captions" data-purpose="caption">
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
                {extraLanguages.length > 0 && additionalCaptions}
            </div>
        );
    }
}
