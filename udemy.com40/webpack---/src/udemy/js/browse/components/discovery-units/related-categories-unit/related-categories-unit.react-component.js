import {withI18n} from '@udemy/i18n';
import {noop} from '@udemy/shared-utils';
import classNames from 'classnames';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import styles from './related-categories-unit.less';

class RelatedCategoriesUnit extends Component {
    static propTypes = {
        className: PropTypes.string,
        onLoad: PropTypes.func,
        unit: PropTypes.shape({
            items: MobxPropTypes.arrayOrObservableArray.isRequired,
        }).isRequired,
        compact: PropTypes.bool,
        gettext: PropTypes.func.isRequired,
        interpolate: PropTypes.func.isRequired,
    };

    static defaultProps = {
        className: undefined,
        onLoad: noop,
        compact: false,
    };

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        const {className, unit, compact, gettext, interpolate} = this.props;

        const mostRelevantItems = unit.items.slice(0, 2);

        return (
            <h2 className={classNames(className, `ud-heading-${compact ? 'sm' : 'md'}`)}>
                {interpolate(
                    gettext('%(topicTitle)s relates to '),
                    {topicTitle: unit.source_objects[0].title},
                    true,
                )}
                {mostRelevantItems.map((item) => {
                    return (
                        <a href={item.url} key={item.id} className={styles['item-link']}>
                            {item.title}
                        </a>
                    );
                })}
            </h2>
        );
    }
}

export default withI18n(RelatedCategoriesUnit);
