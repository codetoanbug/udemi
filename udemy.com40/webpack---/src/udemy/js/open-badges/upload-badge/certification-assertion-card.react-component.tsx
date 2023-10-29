import {useI18n} from '@udemy/i18n';
import HereTickIcon from '@udemy/icons/dist/here-tick.ud-icon';
import {Image, Link} from '@udemy/react-core-components';
import classNames from 'classnames';
import React from 'react';

import {routes} from '../constants';
import {AssertionModel} from './assertion.mobx-model';
import styles from './uploader.less';

export function CertificationAssertionCard(props: {assertion: AssertionModel; userUrl?: string}) {
    const {gettext, interpolate} = useI18n();

    function renderCard() {
        return (
            <div
                className={classNames(styles['uploaded-badge-container'])}
                data-purpose={'uploaded-badge-container'}
            >
                <div className={classNames(styles['uploaded-badge-info'])}>
                    <Image
                        alt={props.assertion.badgeClass.name}
                        src={props.assertion.badgeClass.image.id}
                        className={classNames(styles['uploaded-badge-info-image'])}
                    />
                    <div className={classNames(styles['uploaded-badge-info-text'])}>
                        <span
                            className={classNames(
                                styles['uploaded-badge-info-badgeclass-name'],
                                'ud-heading-md',
                            )}
                        >
                            {props.assertion.badgeClass.name}
                        </span>
                        <span
                            className={classNames(
                                styles['uploaded-badge-info-issuer-name'],
                                'ud-text-sm',
                            )}
                        >
                            {props.assertion.badgeClass.issuer.name}
                        </span>
                    </div>
                </div>
                <div className={classNames(styles['uploaded-badge-issue-info'], 'ud-text-xs')}>
                    <HereTickIcon label={'clipboard-tick'} color="positive" />
                    {interpolate(
                        gettext('Issued on: %(issuedOn)s'),
                        {
                            issuedOn: props.assertion.issuedOn,
                        },
                        true,
                    )}
                </div>
            </div>
        );
    }

    function renderLinkedCard() {
        return (
            <Link
                to={routes.assertionDetailPath(props.assertion.id, props.userUrl as string)}
                disableRouter={true}
            >
                {renderCard()}
            </Link>
        );
    }

    return props.userUrl ? renderLinkedCard() : renderCard();
}
