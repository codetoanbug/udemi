import {APIModel} from 'utils/mobx';

interface InstructorApiData {
    name: string;
}

export class LabRecommendation extends APIModel {
    get apiDataMap() {
        return {
            id: 'id',
            title: 'title',
            description: 'description',
            learningOutcomes: 'learningOutcomes',
            minEstimatedTime: 'minEstimatedTime',
            maxEstimatedTime: 'maxEstimatedTime',
            prerequisites: 'prerequisites',
            visibleInstructors: {
                source: 'instructors',
                map: (instructorsData: InstructorApiData[]) => {
                    return instructorsData.map((instructor) => ({title: instructor.name}));
                },
            },
            activities: 'activities',
            metadata: 'metadata',
            topics: 'topics',
        };
    }
}
