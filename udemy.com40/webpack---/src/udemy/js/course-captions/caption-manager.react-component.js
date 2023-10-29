import {LocalizedHtml} from '@udemy/i18n';
import autobind from 'autobind-decorator';
import {observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Redirect, Route} from 'react-router-dom';

import udLink from 'utils/ud-link';

import CaptionsList from './captions-list.react-component';
import {PROMO_VIDEO_ID} from './constants';
import LectureCaptionEditor from './lecture-caption-editor.react-component';

import './caption-manager.less';

@inject('store')
@observer
export default class CaptionManager extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    };

    componentDidMount() {
        if (this.props.match.params.localeId) {
            this.props.store.setInitialLocaleId(this.props.match.params.localeId);
        }
    }

    @autobind
    captionEditor(routeProps) {
        // routeProps is from the current router instance (of the CaptionManage app) whereas this.props.match
        // is from the parent router instance (e.g. Captions app, Localisation app)
        const {store, match} = this.props;
        const localeId = match.params.localeId || store.initialLocaleId;

        let lectureId = routeProps.match.params.lectureId;
        const isPromoAsset = lectureId === PROMO_VIDEO_ID;
        if (!isPromoAsset) {
            lectureId = parseInt(lectureId, 10);
        }

        const lecture = store.lecturesById[lectureId];
        if (!lecture) {
            return <Redirect to={match.url} />;
        }

        return (
            <LectureCaptionEditor
                courseId={store.courseId}
                lecture={lecture}
                title={lecture.title}
                localeId={localeId}
            />
        );
    }

    get editorRoute() {
        if (!this.props.store.lecturesLoaded) {
            return null;
        }
        const {url} = this.props.match;
        return <Route path={`${url}/edit/:lectureId/`} render={this.captionEditor} />;
    }

    render() {
        return (
            <div>
                <div styleName="description">
                    <LocalizedHtml
                        html={gettext(
                            'Learners of all levels of language proficiency highly value ' +
                                'subtitles as it helps follow, understand and memorize the content. ' +
                                'Also having subtitles to ensure the content is accessible for ' +
                                'those that are deaf or hard of hearing is crucial. ' +
                                '<a class="support_link">Learn more</a>.',
                        )}
                        interpolate={{
                            support_link: (
                                <a href={udLink.toSupportLink('adding_captions_to_video')} />
                            ),
                        }}
                    />
                </div>
                <CaptionsList />
                {this.editorRoute}
            </div>
        );
    }
}
