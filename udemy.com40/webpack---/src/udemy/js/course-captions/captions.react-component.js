import {Provider} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import MainContent from 'course-manage-v2/main-content.react-component';
import SystemMessage from 'utils/ud-system-message';

import CaptionManager from './caption-manager.react-component';
import CaptionsHeader from './captions-header.react-component';
import CaptionsManageStore from './captions-manage.mobx-store';

export default class Captions extends Component {
    static propTypes = {
        courseId: PropTypes.number.isRequired,
        awsAccessKey: PropTypes.string.isRequired,
        bucketUrl: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = new CaptionsManageStore(
            props.courseId,
            props.awsAccessKey,
            props.bucketUrl,
            this.relativePath,
        );
    }

    componentDidMount() {
        this.store.loadLecturesAndCaptions();

        SystemMessage.seen(SystemMessage.ids.captionManagePage);
    }

    relativePath = '/captions';

    render() {
        return (
            <Provider store={this.store}>
                <div>
                    <CaptionsHeader />
                    <MainContent>
                        <Route
                            path={`${this.relativePath}/:localeId?/`}
                            component={CaptionManager}
                        />
                    </MainContent>
                </div>
            </Provider>
        );
    }
}
