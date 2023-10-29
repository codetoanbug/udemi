import DownloadableResourceIcon from '@udemy/icons/dist/downloadable-resource.ud-icon';
import OpenInNewIcon from '@udemy/icons/dist/open-in-new.ud-icon';
import {BlockList} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Highlighter from 'react-highlight-words';

import AssetModel from 'asset/asset.mobx-model';
import {TRIAL_MESSAGES} from 'organization-trial/constants';
import LockedStateIcon from 'organization-trial/locked-state-icon/locked-state-icon.react-component';

import {TRACKING_CATEGORIES} from '../constants';
import CurriculumItem from '../curriculum/curriculum-item.mobx-model';
import {SEARCH_ACTIONS} from '../dashboard/search/constants';
import requires from '../registry/requires';
import './resource.less';

const DISPLAY = Object.freeze({
    DROPDOWN: 'dropdown',
    LIST: 'list',
});

@requires('courseTakingStore')
@observer
export default class Resource extends Component {
    static propTypes = {
        item: PropTypes.instanceOf(CurriculumItem).isRequired,
        resource: PropTypes.instanceOf(AssetModel).isRequired,
        courseTakingStore: PropTypes.object.isRequired,
        displayMode: PropTypes.oneOf(Object.values(DISPLAY)).isRequired,
        textToHighlight: PropTypes.string,
        isSearchMode: PropTypes.bool,
    };

    static defaultProps = {
        textToHighlight: '',
        isSearchMode: false,
    };

    get resourceType() {
        return (
            {
                ExternalLink: 'website',
                SourceCode: 'code',
            }[this.props.resource.type] || 'file_download'
        );
    }

    @autobind
    trackClick() {
        if (this.props.isSearchMode) {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.SEARCH_VISIT,
                SEARCH_ACTIONS.VISIT_RESOURCE,
            );
        } else {
            this.props.courseTakingStore.track(
                TRACKING_CATEGORIES.COURSE_CONTENT_DOWNLOAD,
                this.resourceType,
            );
        }
    }

    @autobind
    handleClick(event) {
        event.stopPropagation();
        this.trackClick();
        const {item, resource} = this.props;
        if (resource.isExternal) {
            item.getResourceExternalURL(resource).then((url) => window.open(url, '_blank'));
        } else {
            item.getResourceDownloadURL(resource).then((url) => {
                // https://github.com/kennethjiang/js-file-download/blob/master/file-download.js
                const link = document.createElement('a');
                link.style.display = 'none';
                link.href = url;
                link.setAttribute('download', resource.fileName);

                // Mobile Safari doesn't support the 'download' attribute so it will be undefined even after setAttribute.
                // It also doesn't allow for automated link clicking and new window opening. It will think it's a pop-up.
                // These things do work on an ordinary link (e.g. <a href="file.pdf />) but not on a dummy element which we
                // use here. The only way of downloading a file with an url that is received async on Mobile Safari is
                // to open it in the current window. Neither window.open(url), window.open(url, '_blank') and .click() work
                if (typeof link.download === 'undefined') {
                    window.location.href = url;
                    return;
                }
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    }

    render() {
        const {resource, courseTakingStore, displayMode, textToHighlight} = this.props;

        const Item = displayMode === DISPLAY.DROPDOWN ? Dropdown.MenuItem : BlockList.Item;
        let icon;
        if (courseTakingStore.isLimitedConsumptionTrial) {
            icon = (
                <LockedStateIcon
                    isTooltipHidden={true}
                    tooltipMessage={TRIAL_MESSAGES.CONTENT_LOCKED}
                />
            );
        } else {
            const Icon = resource.isExternal ? OpenInNewIcon : DownloadableResourceIcon;
            icon = <Icon label={false} />;
        }

        return (
            <Item
                componentClass="button"
                disabled={courseTakingStore.isLimitedConsumptionTrial}
                icon={icon}
                onClick={this.handleClick}
                styleName="resource"
                role="button"
            >
                <span title={resource.title} styleName="ellipsis">
                    {!textToHighlight ? (
                        resource.title
                    ) : (
                        <Highlighter
                            textToHighlight={resource.title}
                            searchWords={textToHighlight.split(' ')}
                        />
                    )}
                </span>
            </Item>
        );
    }
}

// Make sure this static property is available externally (note that the `requires` wrapper creates
// a new component class).
Resource.DISPLAY = DISPLAY;
