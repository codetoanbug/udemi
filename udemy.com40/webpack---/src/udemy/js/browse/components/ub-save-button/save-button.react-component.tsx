import BookmarkOutlinedIcon from '@udemy/icons/dist/bookmark-outline.ud-icon';
import Saved from '@udemy/icons/dist/saved.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import styles from './save-button.less';
import {SaveButtonStore} from './save-button.mobx-store';
import {SaveButtonProps} from './types';

export const SaveButton = observer(
    (props: {
        courseId: SaveButtonProps['courseId'];
        enrollment: SaveButtonProps['enrollment'];
        isMobile?: boolean;
    }) => {
        const [store] = React.useState(
            () => new SaveButtonStore(props.courseId, props.enrollment, gettext),
        );
        let buttonProps;
        const udStyle = props.isMobile ? 'ghost' : 'white-outline';
        const handleClick = () => {
            store.toggleSaveCourse();
        };

        if (!store.isFetching) {
            buttonProps = {
                onClick: handleClick,
            };
        }

        function getButtonContent() {
            const savedContent = () => {
                return (
                    <>
                        <Saved
                            color="inherit"
                            label="saved icon"
                            size={props.isMobile ? 'small' : 'xsmall'}
                        />
                        {props.isMobile ? null : gettext('Saved')}
                    </>
                );
            };
            const saveContent = () => {
                return (
                    <>
                        <BookmarkOutlinedIcon
                            color="inherit"
                            label="save icon"
                            size={props.isMobile ? 'small' : 'xsmall'}
                        />
                        {props.isMobile ? null : gettext('Save')}
                    </>
                );
            };
            if (store.isFetching) {
                return (
                    <div className={styles['loader-content-wrapper']}>
                        <span className={styles['hide-from-sr']}>
                            {store.isSaved ? savedContent() : saveContent()}
                        </span>
                        <Loader className={styles.loader} color="inherit" size="small" />
                    </div>
                );
            }
            if (store.isSaved) {
                return savedContent();
            }
            return saveContent();
        }

        return (
            <Button
                disabled={store.isFetching}
                className={styles['save-button']}
                udStyle={udStyle}
                size="medium"
                color="inherit"
                {...buttonProps}
            >
                {getButtonContent()}
            </Button>
        );
    },
);
