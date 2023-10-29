import {onEnterAndSpace} from '@udemy/design-system-utils';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import {createPath} from 'history';
import PropTypes from 'prop-types';
import React from 'react';
import {withRouter} from 'react-router-dom';

import requires from '../registry/requires';
import {LECTURE_START_PARAM} from './constants';
import styles from './item-link.less';

const isModifierKeyPressed = (event) =>
    !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

export const getCurriculumItemNavigationProps = (
    curriculumItem,
    history,
    startAt,
    subPath = '',
) => {
    const pathname = `/${curriculumItem.type}/${curriculumItem.id}${subPath}`;
    const nextLocation = {
        pathname,
        hash: history.location.hash,
    };
    const startParamValue = startAt || curriculumItem.startPosition;
    if (startParamValue) {
        nextLocation.search = `${LECTURE_START_PARAM}=${startParamValue}`;
    }
    return nextLocation;
};

export const getFullCurriculumItemPath = (nextLocation) => {
    const [baseURL] = location.href.split('/learn/');
    return `${baseURL}/learn${createPath(nextLocation)}`;
};

@withRouter
export class FakeLink extends React.Component {
    /*
    - Navigates to a `location`, returned by props.onClick, whilst maintaining current hash state.
    - Renders `<div role="link">` and does a `history.push()` on click (respects props.onClick).
      Ideally we'd render `<a />`, but then we'd have invalid HTML in some places.
      E.g. progress toggle `<input type="checkbox" />` cannot be inside `<a />`.
    - Merges props.className or sets a default set of styles. Passes on any other props as-is.
    */
    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        staticContext: PropTypes.object,
        onClick: PropTypes.func,
        divRole: PropTypes.string,
    };

    static defaultProps = {
        staticContext: undefined,
        onClick: null,
        divRole: 'link',
    };

    @autobind
    onClick(event) {
        const to = this.props.onClick && this.props.onClick(event, this.props.history);
        // props.onClick returned a location and didn't suppress event
        if (to && to.pathname && !(event.defaultPrevented || event.isPropagationStopped())) {
            // if event came from a button, ensure it is the left click
            if (event.button === undefined || event.button === 0) {
                if (isModifierKeyPressed(event)) {
                    window.open(getFullCurriculumItemPath(to));
                } else {
                    this.props.history.push(to);
                }
            }
        }
    }

    @autobind
    onKeyDown(event) {
        onEnterAndSpace(this.onClick)(event);
    }

    render() {
        // match, history, location, and staticContext injected by withRouter.
        const {match, history, location, staticContext, divRole, ...linkProps} = this.props;
        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                tabIndex={0}
                {...linkProps}
                className={classNames(
                    'item-link',
                    styles.common,
                    linkProps.className || styles['default-theme'],
                )}
                onClick={this.onClick}
                onKeyDown={this.onKeyDown}
                role={divRole}
            />
        );
    }
}

@requires('courseTakingStore')
export default class ItemLink extends React.Component {
    static propTypes = {
        courseTakingStore: PropTypes.object.isRequired,
        itemType: PropTypes.string.isRequired,
        itemId: PropTypes.number.isRequired,
        subPath: PropTypes.string, // to append to "/itemType/itemId" e.g. /practice/123/submission
        startAt: PropTypes.number, // to seek to a point in video lecture via "?start=123" query param
        onClick: PropTypes.func,
        divRole: PropTypes.string,
    };

    static defaultProps = {
        subPath: '',
        startAt: undefined,
        onClick: null,
        divRole: 'link',
    };

    @autobind
    onClick(event, history) {
        this.props.onClick && this.props.onClick(event);
        const {courseTakingStore, itemType, itemId, subPath, startAt} = this.props;
        const {curriculumItem} = courseTakingStore.getCurriculumItemContextByTypeAndId(
            itemType,
            itemId,
        );

        const to = getCurriculumItemNavigationProps(curriculumItem, history, startAt, subPath);
        if (courseTakingStore.coursePortion) {
            // Always add course portion to get params while navigating in portion mode
            const searchWithPortion = `course_portion_id=${courseTakingStore.coursePortion.id}`;
            if (!to.search) {
                to.search = searchWithPortion;
            } else if (!to.search.includes(searchWithPortion)) {
                to.search = [searchWithPortion, to.search].join('&');
            }
        }
        return to;
    }

    render() {
        const {courseTakingStore, itemType, itemId, subPath, startAt, ...linkProps} = this.props;
        return <FakeLink {...linkProps} onClick={this.onClick} />;
    }
}
