import {generateTrackingId, getRefIDFromLocalStorage} from '@udemy/event-tracking';
import {inject} from 'mobx-react';
import React, {Component} from 'react';

import {CoursePreview} from 'course-preview/course-preview.react-component';
import {PreviewsStore} from 'course-preview/previews.mobx-store';
import {Asset} from 'course-preview/types/asset';
import {PreviewableCourse} from 'course-preview/types/previewable-course';
import {fullscreen, FullscreenStore} from 'utils/fullscreen';
import {ComponentProps} from 'utils/types';
import udRenderReactComponents from 'utils/ud-render-react-components';

interface AppProps {
    /**
     * The course to preview
     */
    course: PreviewableCourse;
    /**
     * An array of all previews for the course
     */
    previews: Asset[];
    /**
     * ID of the first preview to play
     */
    startPreviewId: number;
    /**
     * Instance of the store used to manage fullscreen state
     */
    fullscreenStore: FullscreenStore;
}

@fullscreen
@inject('fullscreenStore')
export class App extends Component<AppProps> {
    static defaultProps = {
        previews: [],
        startPreviewId: undefined,
        fullscreenStore: undefined,
    };

    constructor(props: AppProps) {
        super(props);
        const {course, previews, startPreviewId, fullscreenStore} = props;
        this.store = new PreviewsStore(course, previews, startPreviewId, fullscreenStore);
        this.store.publishPreviewViewEvent();
    }

    private store: PreviewsStore;

    render() {
        return <CoursePreview course={this.props.course} store={this.store} />;
    }
}

export default function bootstrap(container: HTMLElement, moduleArgs: ComponentProps<typeof App>) {
    // Grab the existing ref ID for this course from local storage to ensure we have the same tracking ID for
    // CLPViewEvent and PreviewVideoViewEvent
    moduleArgs.course.trackingId =
        getRefIDFromLocalStorage(moduleArgs.course.id) ?? generateTrackingId();

    udRenderReactComponents(container, '.ud-component--course-preview--app', App, moduleArgs);
}
