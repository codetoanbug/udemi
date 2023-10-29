import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {
    SearchState,
    ErrorState,
} from '../teaching-courses/instructor-analytics/search-and-error-states.react-component';
import {API_STATE} from './constants';
import NewcomerChallengeHero from './newcomer-challenge-hero.react-component';
import NewcomerChallengeStore, {
    NEWCOMER_CHALLENGE_HERO_CONTENTS,
} from './newcomer-challenge.mobx-store';
import PlanList from './plan-list.react-component';
import RewardInformation from './reward-information.react-component';

@observer
class NewcomerChallenge extends Component {
    constructor(props) {
        super(props);
        this.store = new NewcomerChallengeStore();
    }

    render() {
        const apiState = this.store.apiState;
        return (
            <div>
                {apiState === API_STATE.SEARCHING && <SearchState />}
                {apiState === API_STATE.ERROR && <ErrorState />}
                {apiState === API_STATE.DONE && (
                    <div>
                        <NewcomerChallengeHero
                            store={this.store}
                            content={
                                NEWCOMER_CHALLENGE_HERO_CONTENTS[
                                    this.store.newcomerChallengeJoinedStatus
                                ]
                            }
                        />
                        <RewardInformation />
                        <PlanList />
                    </div>
                )}
            </div>
        );
    }
}

export default NewcomerChallenge;
