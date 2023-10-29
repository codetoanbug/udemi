import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import VideoIcon from '@udemy/icons/dist/video.ud-icon';
import {Button} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import React from 'react';

import {ITEM_TYPES} from 'course-taking/curriculum/constants';
import ItemLink from 'course-taking/curriculum/item-link.react-component';

import styles from './resource-pane.less';

export interface ResourcePaneData {
    type: string;
    link: string;
    title: string;
    lectureId: number;
}
export interface ResourcePaneProps {
    data: ResourcePaneData[];
}
const ResourcePaneComponent = ({data}: ResourcePaneProps) => {
    return (
        <div data-purpose="resource-pane" className={styles['resource-pane']}>
            <div className={styles['resource-pane-header']}>
                <strong>{gettext('Resources')}</strong>
            </div>
            {data.map((element, index) => {
                return (
                    <div key={index} className={styles['resource-pane-element']}>
                        {element.type === 'link' ? (
                            <>
                                <LinkIcon color="info" label={false} size="small" />
                                <Button
                                    udStyle="ghost"
                                    className={'ud-link-underline ud-text-md'}
                                    size="large"
                                    componentClass="a"
                                    href={element.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {element.title}
                                </Button>
                            </>
                        ) : (
                            <>
                                <VideoIcon color="info" label={false} size="small" />
                                <ItemLink itemType={ITEM_TYPES.LECTURE} itemId={element.lectureId}>
                                    <Button
                                        udStyle="ghost"
                                        className={'ud-link-underline ud-text-md'}
                                    >
                                        {element.title}
                                    </Button>
                                </ItemLink>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export const ResourcePane = observer(ResourcePaneComponent);
