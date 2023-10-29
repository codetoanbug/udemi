import classNames from 'classnames';
import {observer} from 'mobx-react';
import React, {Component} from 'react';

import {LearningPathCard} from 'browse/components/learning-path-card/learning-path-card.react-component';

import {CertificationModel} from '../certification.mobx-model';
import style from './certification-path-card.less';
import {CertificationPathCardStore} from './certification-path-card.mobx-store';

interface UdemyPathCardProps {
    certification: CertificationModel;
}

@observer
export class CertificationPathCard extends Component<UdemyPathCardProps> {
    async componentDidMount() {
        await this.certificationPathCardStore.fetchLearningPath();
    }

    certificationPathCardStore: CertificationPathCardStore = new CertificationPathCardStore(
        this.props.certification,
    );

    render() {
        const {learningPath, shouldRenderCertificationPathCard} = this.certificationPathCardStore;
        return (
            (shouldRenderCertificationPathCard && (
                <div>
                    <div
                        className={classNames(
                            'ud-heading-serif-xl',
                            style['path-discovery-header'],
                        )}
                        data-purpose="certification-path-header"
                    >
                        {gettext('Enroll in our Udemy path')}
                    </div>
                    <div className="ud-text-md" data-purpose="certification-path-description-text">
                        {gettext(
                            'Udemy paths provide the instruction and practice needed to help you prepare for a certification exam. This path includes a curated collection of top courses and hands-on exercises— plus an assessment to track your progress while you get exam ready.',
                        )}
                    </div>
                    <div className={style['learning-path-card-container']}>
                        <LearningPathCard learningPath={learningPath} />
                    </div>
                </div>
            )) ??
            null
        );
    }
}
