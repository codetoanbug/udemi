import {Tracker} from '@udemy/event-tracking';
import {Image, Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {CourseManageActionEvent} from 'course-manage-v2/events';
import SubHeader from 'course-manage-v2/sub-header/sub-header.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import ContentOnlyStore from './content-only.mobx-store';
import CourseStructureStore from './course-structure.mobx-store';
import FilmAndEditStore from './film-and-edit.mobx-store';
import SetupAndTestvideoStore from './setup-and-test-video.mobx-store';

import './content-only.less';

const trackClick = (resource, courseId) => {
    return () => {
        Tracker.publishEvent(
            new CourseManageActionEvent({
                courseId,
                category: 'course-structure',
                action: 'click',
                objectType: 'course',
                objectId: courseId,
            }),
        );
    };
};

export const HeaderPanel = ({data, courseId}) => (
    <div data-purpose="header-panel" styleName="header-panel">
        <div styleName="header-panel-left">
            <h2 data-purpose="header-title" className="ud-heading-xl">
                {data.title}
            </h2>
            <p data-purpose="header-text" styleName="header-text" className="ud-text-lg">
                {data.text}
            </p>
        </div>
        <div styleName="header-panel-right">
            <Image
                styleName="cta-image"
                data-purpose="cta-image"
                src={data.ctaImage}
                srcSet={data.ctaImage2x && `${data.ctaImage} 1x, ${data.ctaImage2x} 2x`}
                alt=""
                width={120}
                height={90}
            />
            <div>
                <h2 className="ud-heading-lg" data-purpose="cta-header">
                    {data.ctaHeader}
                </h2>
                <p styleName="cta-text" data-purpose="cta-text">
                    {data.ctaSentence}
                </p>
            </div>
            <div styleName="cta-button">
                <Button
                    data-purpose="cta-button"
                    udStyle="secondary"
                    onClick={trackClick(data.ctaUrl, courseId)}
                    componentClass="a"
                    href={data.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {data.ctaButtonText}
                </Button>
            </div>
        </div>
    </div>
);

HeaderPanel.propTypes = {
    data: PropTypes.object,
    courseId: PropTypes.number,
};

HeaderPanel.defaultProps = {
    data: undefined,
    courseId: undefined,
};

export const BottomPanel = ({tipsData, requirementsData, resourcesData, courseId}) => {
    const tipsText = tipsData.tips.map((tip, i) => (
        <React.Fragment key={i}>
            <h3 data-purpose="tip-title" className="ud-heading-md" styleName="bottom-panel-title">
                {tip.title}
            </h3>
            <p
                className="ud-text-with-links"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'content-only-page:tip-text',
                    domPurifyConfig: {ADD_ATTR: ['target']},
                    html: tip.text,
                    dataPurpose: 'tip-text"',
                })}
            />
        </React.Fragment>
    ));

    const requirementsText = requirementsData.requirements.map((requirement, i) => (
        <li key={i}>
            <p
                className="ud-text-with-links"
                {...safelySetInnerHTML({
                    descriptionOfCaller: 'content-only-page:requirements-text',
                    domPurifyConfig: {ADD_ATTR: ['target']},
                    html: requirement.text,
                    dataPurpose: 'requirements-text',
                })}
            />
        </li>
    ));

    const resourcesText = resourcesData.resources.map((resource, i) => (
        <React.Fragment key={i}>
            <h3 styleName="bottom-panel-title">
                <a
                    className="ud-heading-md ud-link-underline"
                    onClick={trackClick(resource.link, courseId)}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {resource.title}
                </a>
            </h3>
            <p>{resource.text}</p>
        </React.Fragment>
    ));

    return (
        <div data-purpose="bottom-panel" styleName="bottom-panel">
            <h2
                data-purpose="tips-data-title"
                className="ud-heading-xl"
                styleName="bottom-panel-section-title"
            >
                {tipsData.title}
            </h2>
            <div data-purpose="tips-data-text">{tipsText}</div>
            <h2
                data-purpose="requirements-data-title"
                className="ud-heading-xl"
                styleName="bottom-panel-section-title"
            >
                {requirementsData.title}
            </h2>
            <ul data-purpose="requirements-data-text" styleName="requirements">
                {requirementsText}
            </ul>
            <h2
                data-purpose="resource-data-title"
                className="ud-heading-xl"
                styleName="bottom-panel-section-title"
            >
                {resourcesData.title}
            </h2>
            <div data-purpose="resource-data-text">{resourcesText}</div>
        </div>
    );
};

BottomPanel.propTypes = {
    tipsData: PropTypes.object,
    requirementsData: PropTypes.object,
    resourcesData: PropTypes.object,
    courseId: PropTypes.number,
};

BottomPanel.defaultProps = {
    tipsData: undefined,
    requirementsData: undefined,
    resourcesData: undefined,
    pageName: undefined,
    courseId: undefined,
};

@observer
export default class Page extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        pageType: PropTypes.string.isRequired,
        onPageOpen: PropTypes.func,
    };

    static defaultProps = {
        onPageOpen: () => true,
    };

    constructor(props) {
        super(props);
        this.setupPage(props);
    }

    componentDidMount() {
        this.pageWillLoad();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setupPage(nextProps);
        this.pageWillLoad();
    }

    store = {};
    mainStore = undefined;

    pageWillLoad() {
        if (!this.mainStore) {
            return;
        }
        const {onPageOpen} = this.props;
        const {setPageAsSeen} = this.mainStore;
        setPageAsSeen().then((needUpdate) => {
            if (needUpdate) {
                onPageOpen();
            }
        });
    }

    setupPage(props) {
        const {pageType, courseId} = props;
        if (!(pageType in this.store)) {
            let baseStore;
            switch (pageType) {
                case 'course-structure':
                    baseStore = new CourseStructureStore();
                    break;
                case 'setup':
                    baseStore = new SetupAndTestvideoStore();
                    break;
                case 'film':
                    baseStore = new FilmAndEditStore();
                    break;
            }
            if (baseStore) {
                this.store[pageType] = new ContentOnlyStore(courseId, baseStore);
            }
        }

        this.mainStore = pageType in this.store ? this.store[pageType] : undefined;
    }

    render() {
        if (!this.mainStore) {
            return null;
        }
        const {content} = this.mainStore;
        return (
            <div>
                <SubHeader title={content.title} />
                <HeaderPanel data={content.headerData} courseId={this.props.courseId} />
                <BottomPanel
                    tipsData={content.tipsData}
                    requirementsData={content.requirementsData}
                    resourcesData={content.resourcesData}
                    courseId={this.props.courseId}
                />
            </div>
        );
    }
}
