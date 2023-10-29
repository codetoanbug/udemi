import {MainContentLoader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import {withMatchMedia} from 'base-components/responsive/match-media.react-component';
import {LABS_DISCOVER_COMPONENTS} from 'browse/components/my-learning-unit/constants';
import {LabDiscoveryCard} from 'lab-taking/discovery/lab-discovery-card.react-component';

import {MyLabsStore} from './my-labs.mobx-store';

interface InjectedMyLabsProps {
    isMobileMax: boolean;
}

@withMatchMedia({isMobileMax: 'mobile-max'})
@observer
export class MyLabs extends React.Component<InjectedMyLabsProps> {
    static defaultProps: InjectedMyLabsProps;

    async componentDidMount() {
        await this.store.fetchLabs();
    }

    store = new MyLabsStore('my-learning');

    render() {
        const {isLoading, labs} = this.store;

        if (isLoading) {
            return <MainContentLoader />;
        }
        return (
            <div className="my-courses__wide-card-grid">
                {labs.map((lab, index) => (
                    <div key={`lab-card-${index}`}>
                        <LabDiscoveryCard
                            lab={lab}
                            size={this.props.isMobileMax ? 'small' : 'large'}
                            className="my-courses__wide-card"
                            uiRegion={LABS_DISCOVER_COMPONENTS.MY_LEARNING_LABS_PAGE}
                        />
                    </div>
                ))}
            </div>
        );
    }
}
