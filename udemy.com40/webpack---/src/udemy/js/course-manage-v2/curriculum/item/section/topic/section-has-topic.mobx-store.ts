import autobind from 'autobind-decorator';
import {AxiosResponse} from 'axios';
import {action, computed, observable} from 'mobx';

import {showErrorToast, showSuccessToast} from 'instructor/toasts';
import udApi from 'utils/ud-api';
import Raven from 'utils/ud-raven';

import CurriculumSectionModel from '../curriculum-section.mobx-model';
import {
    ASSIGN_TOPIC_ERROR_MESSAGE,
    GT_ASSIGNMENT_TYPE_PRIMARY,
    GT_INSTANCE_TYPE_NAME,
    SECTION_ENTITY,
    SectionHasTopicsActions,
    SD_GENERIC_TAG_ACTION_URL,
    MAXIMUM_TOPICS_PER_SECTION,
    UNASSIGN_TOPIC_ERROR_MESSAGE,
    ERROR_FETCHING_TOPICS_FOR_SECTION_MESSAGE,
} from './constants';
import {TopicModel} from './topic.mobx-model';

export class SectionHasTopicStore {
    @observable section: CurriculumSectionModel;
    @observable sectionHasTopics: TopicModel[] = [];
    @observable isLoadingTopics = false;

    constructor(section: CurriculumSectionModel) {
        this.section = section;
    }

    @computed
    get canAddTopic() {
        return this.sectionHasTopics.length < MAXIMUM_TOPICS_PER_SECTION;
    }

    @action
    addSectionHasTopic(assignedTopic: TopicModel) {
        return this.sectionHasTopics.push(assignedTopic);
    }

    @action
    removeSectionHasTopic(topicId: number) {
        this.sectionHasTopics = this.sectionHasTopics.filter((sht) => sht.id !== topicId);
    }

    @autobind
    async addTopic(assignedTopic: TopicModel) {
        const existing = this.sectionHasTopics.find((sht) => sht.id === assignedTopic.id);

        if (!existing) {
            await this.addAssignment(assignedTopic);
        }
    }

    @autobind
    async addAssignment(assignedTopic: TopicModel) {
        const topicId = assignedTopic.id;
        const defaultName = assignedTopic.defaultName;
        const actions = [
            {
                action: SectionHasTopicsActions.ASSIGN_TOPIC,
                options: {
                    gt_instance: {
                        type_name: GT_INSTANCE_TYPE_NAME,
                        id: topicId,
                    },
                    gt_assignment_type: {
                        id: GT_ASSIGNMENT_TYPE_PRIMARY,
                    },
                    entity: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        id: this.section.id,
                        ...SECTION_ENTITY,
                    },
                    location: 'chapter-testing',
                },
            },
        ];

        try {
            const response = await udApi.post(SD_GENERIC_TAG_ACTION_URL, {
                actions,
            });
            if (response.data.results[0].status === 'success') {
                showSuccessToast(
                    interpolate(
                        gettext('The topic "%(defaultName)s" has been assigned.'),
                        {defaultName},
                        true,
                    ),
                );
                this.section.addGtAssignmentsV2(assignedTopic.id, assignedTopic.defaultName);
                this.addSectionHasTopic(assignedTopic);
            } else {
                Raven.captureException(response.data.results[0].message);
                await Promise.reject(new Error(response.data.results[0].message));
            }
        } catch (e) {
            Raven.captureException(e);
            this.setErrorToast(assignedTopic.defaultName);
        }
    }

    @autobind
    async removeAssignment(assignedTopic: TopicModel) {
        const topicId = assignedTopic.id;
        const defaultName = assignedTopic.defaultName;
        const actions = [
            {
                action: SectionHasTopicsActions.UNASSIGN_TOPIC,
                options: {
                    gt_instance: {
                        type_name: GT_INSTANCE_TYPE_NAME,
                        id: topicId,
                    },
                    gt_assignment_type: {
                        id: GT_ASSIGNMENT_TYPE_PRIMARY,
                    },
                    entity: {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        id: this.section.id,
                        ...SECTION_ENTITY,
                    },
                },
            },
        ];

        try {
            const response = await udApi.post(SD_GENERIC_TAG_ACTION_URL, {actions});
            if (response.data.results[0].status === 'success') {
                showSuccessToast(
                    interpolate(
                        gettext('The topic "%(defaultName)s" has been removed.'),
                        {defaultName},
                        true,
                    ),
                );
                this.section.removeGtAssignmentsV2(topicId);
                this.removeSectionHasTopic(assignedTopic.id);
            } else {
                Raven.captureException(response.data.results[0].message);
                await Promise.reject(new Error(response.data.results[0].message));
            }
        } catch (e) {
            Raven.captureException(e);
            this.setErrorToast(assignedTopic.defaultName, UNASSIGN_TOPIC_ERROR_MESSAGE);
        }
    }

    @action
    fetchSectionHasTopics() {
        this.isLoadingTopics = true;
        try {
            this.section
                .fetchTopicAssignments()
                .then((response: AxiosResponse) => {
                    response.data.gt_assignments_v2.forEach((gtAssignment: any) => {
                        const id = gtAssignment.gt_instance.id;
                        const defaultName = gtAssignment.gt_instance.default_name;
                        this.section.addGtAssignmentsV2(id, defaultName);
                        this.addSectionHasTopic(
                            new TopicModel({
                                id,
                                default_name: defaultName,
                                is_proposed_topic: true,
                            }),
                        );
                    });
                })
                .finally(
                    action(() => {
                        this.isLoadingTopics = false;
                    }),
                );
        } catch (e) {
            Raven.captureException(e);
            this.isLoadingTopics = false;
            // eslint-disable-next-line gettext/no-variable-string
            showErrorToast(gettext(ERROR_FETCHING_TOPICS_FOR_SECTION_MESSAGE));
        }
    }

    setErrorToast(assignedTopicName: string, message = ASSIGN_TOPIC_ERROR_MESSAGE) {
        showErrorToast(interpolate(message, {topic: assignedTopicName}, true));
    }
}
