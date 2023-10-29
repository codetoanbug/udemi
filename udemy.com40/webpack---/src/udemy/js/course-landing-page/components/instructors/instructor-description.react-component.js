import {ShowMore} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import './instructor.less';

@observer
export default class InstructorDescription extends React.Component {
    static propTypes = {
        description: PropTypes.string.isRequired,
    };

    render() {
        const {description} = this.props;
        return (
            <div styleName="instructor__description" className="ud-text-sm">
                <ShowMore
                    ariaLabelExpanded={gettext('Show less about the instructor')}
                    ariaLabelCollapsed={gettext('Show more about the instructor')}
                    collapsedHeight={146}
                    withGradient={true}
                >
                    <div
                        {...safelySetInnerHTML({
                            descriptionOfCaller: 'instructor-description:description-content',
                            html: description,
                            dataPurpose: 'description-content',
                        })}
                    />
                </ShowMore>
            </div>
        );
    }
}
