import {LocalizedHtml} from '@udemy/i18n';
import {Link} from '@udemy/react-core-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {PropTypes as mobxTypes, observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import Loader from 'course-manage-v2/loader.react-component';

import CaptionsAlert from './captions-alert.react-component';
import {CAPTION_TABS} from './constants';
import FilterButtons from './filter-buttons.react-component';
import LectureItem from './lecture-item.react-component';

import './captions-form.less';

export const CurriculumSection = observer(({curriculum, filter}) => {
    const lectures = curriculum.items.filter(filter);
    return (
        <div styleName="curriculum-section">
            <div styleName="curriculum-section-title">
                <h4 className="ud-heading-sm">{curriculum.title}</h4>
            </div>
            {lectures.map((lecture) => (
                <LectureItem key={lecture.id} lecture={lecture} />
            ))}
        </div>
    );
});

CurriculumSection.propTypes = {
    curriculum: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        items: mobxTypes.arrayOrObservableArray.isRequired,
    }),
    currentLocaleId: PropTypes.string.isRequired,
    filter: PropTypes.func,
};

CurriculumSection.defaultProps = {
    filter: () => true,
};

@inject('store')
@observer
export default class CaptionsList extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.interval = setInterval(() => this.props.store.refreshCaptions(), 30 * 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    curriculumList() {
        const {activeTab, currentLocaleId, curriculumList} = this.props.store;

        const filters = {
            [CAPTION_TABS.ALL]: () => true,
            [CAPTION_TABS.UNCAPTIONED]: this.props.store.uncaptionedVideoFilter,
            [CAPTION_TABS.AUTOCAPTIONED]: this.props.store.autocaptionedFilter,
            [CAPTION_TABS.LOW_QUALITY]: this.props.store.lowQualityFilter,
        };

        return curriculumList
            .filter(({items}) => items.length > 0 && items.some(filters[activeTab]))
            .map((curriculum) => (
                <CurriculumSection
                    key={curriculum.id}
                    filter={filters[activeTab]}
                    currentLocaleId={currentLocaleId}
                    curriculum={curriculum}
                />
            ));
    }

    render() {
        const {lecturesLoaded, lectureCount} = this.props.store;
        if (!lecturesLoaded) {
            return <Loader />;
        }
        if (lectureCount === 0) {
            return (
                <AlertBanner
                    showCta={false}
                    title={
                        <LocalizedHtml
                            className="ud-text-with-links"
                            html={gettext(
                                'When you add video lectures to your course via the ' +
                                    '<a class="curriculumLink">Curriculum</a> you will be able to add captions ' +
                                    'to those videos here.',
                            )}
                            interpolate={{
                                curriculumLink: <Link to="/curriculum" />,
                            }}
                        />
                    }
                />
            );
        }

        return (
            <div>
                {this.props.store.alertCodes.map((code, index) => (
                    <CaptionsAlert key={index} alertCode={code} />
                ))}

                <FilterButtons />

                {this.curriculumList()}
            </div>
        );
    }
}
