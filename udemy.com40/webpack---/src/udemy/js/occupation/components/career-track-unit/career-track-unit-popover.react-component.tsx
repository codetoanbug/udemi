import {withI18n, WithI18nProps} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Badge} from '@udemy/react-messaging-components';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import React from 'react';

import styles from './career-track-unit-popover.less';
import {CareerTrackUnitPopoverStore} from './career-track-unit-popover.mobx-store';

interface CareerTrackUnitPopoverProps {
    trigger: React.ReactElement;
    url: string;
}

@observer
class InternalCareerTrackUnitPopover extends React.Component<
    CareerTrackUnitPopoverProps & WithI18nProps
> {
    constructor(props: CareerTrackUnitPopoverProps & WithI18nProps) {
        super(props);
        this.careerTrackUnitPopoverStore = new CareerTrackUnitPopoverStore();
    }

    componentDidMount() {
        this.careerTrackUnitPopoverStore.setPopOverState();
    }

    private careerTrackUnitPopoverStore: CareerTrackUnitPopoverStore;

    render() {
        const {gettext} = this.props;
        return (
            <Popover
                isOpen={this.careerTrackUnitPopoverStore.popOverOpen}
                placement="right-start"
                trigger={this.props.trigger}
                onToggle={this.careerTrackUnitPopoverStore.onTogglePopOver}
            >
                <div className={styles['career-track-popover-content']}>
                    <Badge className={styles['badge-new']} data-purpose="new-badge">
                        {gettext('New')}
                    </Badge>
                    <div data-purpose="title" className="ud-heading-sm">
                        {gettext('Data scientist career guide')}
                    </div>
                    <div data-purpose="text" className="ud-text-sm">
                        {gettext(
                            'No need to scroll or search — we’ve mapped out all the concepts you need to learn to become or advance as a data scientist.',
                        )}
                    </div>
                    <Button
                        componentClass="a"
                        data-purpose="dive-in-button"
                        href={this.props.url}
                        udStyle="ghost"
                        size="xsmall"
                        className="ud-link-underline"
                    >
                        {gettext('Explore Skills')}
                    </Button>
                </div>
            </Popover>
        );
    }
}

export const CareerTrackUnitPopover = withI18n(InternalCareerTrackUnitPopover);
