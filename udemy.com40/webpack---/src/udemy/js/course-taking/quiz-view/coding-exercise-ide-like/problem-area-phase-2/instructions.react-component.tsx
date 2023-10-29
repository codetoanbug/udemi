import {Button} from '@udemy/react-core-components';
import {Accordion, AccordionPanel} from '@udemy/react-reveal-components';
import {observer} from 'mobx-react';
import React from 'react';

import RichTextViewer from 'base-components/ungraduated/form/rich-text-viewer/rich-text-viewer.react-component';
import {ITEM_TYPES} from 'course-taking/curriculum/constants';
import ItemLink from 'course-taking/curriculum/item-link.react-component';

import {CodingExerciseStore} from '../coding-exercise.mobx-store';
import {Lecture} from '../types';

import './instructions.less';

const InstructionsComponent: React.FC<{
    title?: string;
    content?: string;
    lectures?: Lecture[];
    store?: CodingExerciseStore;
    learningObjective?: string;
}> = ({title, content, lectures, store, learningObjective}) => {
    const eventUITypeValue = 'new_ui_guided';
    return (
        <div
            styleName="content"
            data-purpose="instructions-content"
            onMouseDown={(e) => {
                e.stopPropagation();
                return true;
            }}
        >
            {title && (
                <div className="ud-heading-lg" styleName="title" data-purpose="exercise-title">
                    {title}
                </div>
            )}
            {content && <RichTextViewer className="ud-text-md" unsafeHTML={content} />}
            {learningObjective && (
                <Accordion size={'medium'} styleName="accordion-panel">
                    {learningObjective && (
                        <AccordionPanel title={gettext('Learning objective')}>
                            {learningObjective}
                        </AccordionPanel>
                    )}
                </Accordion>
            )}
            {lectures && lectures.length > 0 && (
                <div styleName="related-lecture">
                    <div className="ud-text-md">{gettext('This topic is covered in')}</div>
                    <div styleName="related-lecture-buttons">
                        {lectures.map((lecture, index) => (
                            <ItemLink
                                itemType={ITEM_TYPES.LECTURE}
                                itemId={lecture.id}
                                key={`${lecture.id} ${index}`}
                            >
                                <Button
                                    udStyle="link"
                                    onClick={() =>
                                        store?.trackEvent('related_lecture', eventUITypeValue)
                                    }
                                    data-purpose="related-lecture"
                                >
                                    {interpolate(
                                        gettext('Lecture %(index)s: %(title)s'),
                                        {
                                            index: lecture.object_index,
                                            title: lecture.title,
                                        },
                                        true,
                                    )}
                                </Button>
                            </ItemLink>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const Instructions = observer(InstructionsComponent);
