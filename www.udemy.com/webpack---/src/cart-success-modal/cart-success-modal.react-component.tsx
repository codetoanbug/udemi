import classNames from 'classnames';
import {observer, Provider} from 'mobx-react';
import React, {useEffect} from 'react';

import {FunnelLogContextProvider} from '@udemy/funnel-tracking';
import {useI18n, WithI18nProps} from '@udemy/i18n';
import SuccessIcon from '@udemy/icons/dist/success.ud-icon';
import {Button, Image} from '@udemy/react-core-components';
import {Modal} from '@udemy/react-dialog-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {PillGroup} from '@udemy/react-navigation-components';
import {serverOrClient} from '@udemy/shared-utils';
import {WithUDDataProps} from '@udemy/ud-data';

import {urls} from '../add-to-cart/config';
import {CartBuyable} from '../types/cart-buyable';
import styles from './cart-success-modal.module.less';
import {RelatedLabelsStore} from './related-labels.mobx-store';

interface CourseAddedMessageProps {
    onClick: () => void;
    title: string;
    instructors?: Array<string>;
    image?: string;
}

export const CourseAddedMessage = ({
    onClick,
    title,
    instructors,
    image,
}: CourseAddedMessageProps) => {
    const {gettext} = useI18n();
    return (
        <div className={styles['course-added']}>
            <div className={styles['added-context']}>
                <SuccessIcon className={styles['success-icon']} color="positive" label={false} />
                {image && <Image width={64} height={64} src={image} alt={title} />}
                <div className={styles['text-block']}>
                    <div className={classNames(styles['course-title'], 'ud-heading-sm')}>
                        {title}
                    </div>
                    {instructors && (
                        <div className={classNames(styles['instructor-list'], 'ud-text-xs')}>
                            {instructors.join(', ')}
                        </div>
                    )}
                </div>
                <Button
                    onClick={onClick}
                    data-purpose="go-to-cart-button"
                    className={styles['go-to-cart']}
                >
                    {gettext('Go to cart')}
                </Button>
            </div>
        </div>
    );
};

export interface RelatedLabel {
    display_name: string;
    url: string;
}

interface RelatedLabelsListProps {
    courseId: number;
    sourcePage: string;
}

export const RelatedLabelsList = observer(({courseId, sourcePage}: RelatedLabelsListProps) => {
    const {gettext} = useI18n();
    const [relatedLabelsStore] = React.useState(() => new RelatedLabelsStore(courseId, sourcePage));

    useEffect(() => {
        relatedLabelsStore.fetchLabels();
    }, [relatedLabelsStore]);

    if (relatedLabelsStore.loading || !relatedLabelsStore.labels?.length) {
        return null;
    }

    return (
        <>
            <div className="ud-heading-lg">{gettext('Related topics')}</div>
            <PillGroup className={styles['related-labels']}>
                {relatedLabelsStore.labels.map((label, index) => (
                    <PillGroup.Pill
                        key={index}
                        componentClass="a"
                        href={label.url}
                        data-purpose="related-link-tag"
                        size="medium"
                    >
                        {label.display_name}
                    </PillGroup.Pill>
                ))}
            </PillGroup>
        </>
    );
});

export interface CartSuccessBundleUnitProps extends WithI18nProps, WithUDDataProps {
    pageObjectId: number | string;
}

export interface CartSuccessModalProps {
    buyable: CartBuyable;
    message?: {
        title: string;
        subtitle: string;
    };
    showCodingExercisesBadge?: boolean;
    isOpen: boolean;
    onClose: () => void;
    renderBundleUnit?: (buyables: CartBuyable[]) => React.ReactNode;
}

export const CartSuccessModal = observer(
    ({
        buyable,
        message,
        showCodingExercisesBadge,
        isOpen,
        onClose,
        renderBundleUnit,
    }: CartSuccessModalProps) => {
        const {gettext} = useI18n();

        const goToCart = () => {
            serverOrClient.global.location.href = urls.cartPage;
        };

        const instructorNames = (buyable.visible_instructors ?? []).map(
            (instructor: {title: string}) => instructor.title,
        );

        return (
            <Modal isOpen={isOpen} onClose={onClose} title={gettext('Added to cart')}>
                <div className="cart-success-modal" data-purpose="cart-success-modal">
                    {message && (
                        <AlertBanner
                            showIcon={false}
                            showCta={false}
                            className={styles['notice']}
                            title={message.title}
                            body={message.subtitle}
                        />
                    )}
                    <CourseAddedMessage
                        onClick={goToCart}
                        title={buyable.title ?? ''}
                        instructors={instructorNames}
                        image={buyable.image_100x100}
                    />
                    <div className={styles['bundle-container']}>
                        <FunnelLogContextProvider context="cartSuccessModal">
                            <Provider showCodingExercisesBadge={showCodingExercisesBadge}>
                                {renderBundleUnit?.([buyable])}
                            </Provider>
                        </FunnelLogContextProvider>
                    </div>
                    {buyable.id && (
                        <RelatedLabelsList courseId={buyable.id} sourcePage="success_page" />
                    )}
                </div>
            </Modal>
        );
    },
);
