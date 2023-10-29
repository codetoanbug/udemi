import {ShowMore} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import React from 'react';

import styles from './instructor-response.less';
import {ShowMoreButton} from './show-more-button.react-component';

interface InstructorResponseProps {
    content?: React.ReactNode;
    user?: {
        display_name: string;
    };
    formattedTimestampSince?: string;
}

export const InstructorResponse = ({
    user,
    content,
    formattedTimestampSince,
}: InstructorResponseProps) => {
    if (!user || !content) {
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <p
                    className={classNames('ud-heading-md', styles.name)}
                    data-purpose="instructor-name"
                >
                    {user.display_name}
                </p>
                <p className={classNames('ud-heading-sm', styles['response-info'])}>
                    <span>{gettext('Instructor response')}</span>
                    {formattedTimestampSince && (
                        <>
                            <span>{' • '}</span>
                            <span data-purpose="formatted-timestamp-since">
                                {formattedTimestampSince}
                            </span>
                        </>
                    )}
                </p>
            </div>

            <ShowMore
                className={styles.body}
                contentClassName="ud-text-md"
                collapsedHeight={100}
                hideIcons={true}
                withGradient={true}
                buttonComponent={ShowMoreButton}
            >
                <div className={styles.content} data-purpose="content">
                    {content}
                </div>
            </ShowMore>
        </div>
    );
};
