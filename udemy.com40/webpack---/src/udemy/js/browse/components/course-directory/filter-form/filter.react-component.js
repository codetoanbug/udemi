import {Tracker} from '@udemy/event-tracking';
import {formatNumber, withI18n} from '@udemy/i18n';
import {Checkbox, Radio} from '@udemy/react-form-components';
import {StarRating} from '@udemy/react-merchandising-components';
import {ShowMore} from '@udemy/react-reveal-components';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {DirectoryFilterChangeEvent} from 'browse/events';

import styles from './filter.less';

@inject(({query}) => ({
    query,
}))
@observer
class Filter extends React.Component {
    static propTypes = {
        aggregation: PropTypes.object.isRequired,
        gettext: PropTypes.func.isRequired,
        locale: PropTypes.string.isRequired,
        ninterpolate: PropTypes.func.isRequired,
        query: PropTypes.string,
    };

    static defaultProps = {
        query: 'No query defined',
    };

    handleChange(query, aggregation, option, event) {
        // query could be a collections id (number) when passed down from a collections page e.g. www.udemy.com/collection/*
        Tracker.publishEvent(
            new DirectoryFilterChangeEvent({
                query: typeof query === 'string' ? query.toLowerCase() : query.toString(),
                aggregation,
                option,
                isCheckedOnClick: event.target.checked,
            }),
        );
    }

    render() {
        const {gettext, ninterpolate, locale} = this.props;
        if (!this.props.aggregation.options.length) {
            return null;
        }
        return (
            <ShowMore collapsedHeight={145} withGradient={true}>
                <div>
                    {this.props.aggregation.options.map((option, i) => {
                        const formattedCount = formatNumber(option.count, locale);
                        return option.key === 'ratings' ? (
                            <Radio
                                key={i}
                                disabled={option.count === 0}
                                value={option.value}
                                checked={!!option.selected}
                                name={option.key}
                                readOnly={true}
                                onChange={(e) =>
                                    this.handleChange(
                                        this.props.query,
                                        this.props.aggregation.key,
                                        option.value,
                                        e,
                                    )
                                }
                            >
                                <StarRating
                                    ariaLabel={interpolate(
                                        gettext('%(value)s out of 5 & up'),
                                        {
                                            value: option.value,
                                        },
                                        true,
                                    )}
                                    rating={Number(option.value)}
                                />
                                {/** Hide this label from aria since StarRating provides label **/}
                                <span className={styles.label} aria-hidden="true">
                                    {option.title}
                                </span>
                                <span className={styles.count}>
                                    {`(${formattedCount})`}
                                    <span className="ud-sr-only">
                                        {ninterpolate('Result', 'Results', formattedCount, {
                                            count: formattedCount,
                                        })}
                                    </span>
                                </span>
                            </Radio>
                        ) : (
                            <Checkbox
                                key={i}
                                disabled={option.count === 0}
                                value={option.value}
                                checked={!!option.selected}
                                name={option.key}
                                readOnly={true}
                                onChange={(e) =>
                                    this.handleChange(
                                        this.props.query,
                                        this.props.aggregation.key,
                                        this.props.aggregation.key === 'features'
                                            ? option.key
                                            : option.value.toString(),
                                        e,
                                    )
                                }
                            >
                                {option.title}
                                <span className={styles.count}>{`(${formattedCount})`}</span>
                            </Checkbox>
                        );
                    })}
                </div>
            </ShowMore>
        );
    }
}

export default withI18n(Filter);
