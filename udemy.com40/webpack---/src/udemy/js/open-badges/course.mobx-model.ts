import {observable} from 'mobx';

import {APIModel} from 'utils/mobx';

interface Instructor {
    name: string;
}

interface Images {
    px480x270: string;
    px240x135: string;
    px100x100: string;
    px75x75: string;
    px50x50: string;
}

interface Features {
    reviews_view: boolean;
}

export class CourseModel extends APIModel {
    @observable declare id: number;
    @observable declare title: string;
    @observable declare url: string;
    @observable declare image_480x270: string;
    @observable declare image_240x135: string;
    @observable declare image_100x100: string;
    @observable declare image_75x75: string;
    @observable declare image_50x50: string;
    @observable declare instructors: Instructor[];
    @observable declare visible_instructors: Instructor[];
    @observable declare is_published: boolean;
    @observable declare completion_ratio: number;
    @observable declare features: Features;

    constructor(apiData: any) {
        super(apiData);
        /*
        GraphQL API doesn't return the following fields. Not defined in the schema
        And the EnrolledCourseCard component requires them to show ratings. Not sure why.
        No easy way to get rid of that.
        Due to larger differences between CourseModel and EnrolledBrowseCourse, we can't just
        use the latter.
        And since we don't have to show ratings in our app, we can just set them to false.
        This will not let the ratings component render and throw the error.
         */
        this.features = {
            reviews_view: false,
        };
    }

    get apiDataMap() {
        return {
            id: {
                source: 'id',
                map: (id: string) => parseInt(id, 10),
            },
            title: 'title',
            url: 'urlCourseLanding',
            is_published: 'enrollable', // TODO: change this to is_published once GQL is updated
            image_480x270: {
                source: 'images',
                map: (images: Images) => images.px480x270,
            },
            image_240x135: {
                source: 'images',
                map: (images: Images) => images.px240x135,
            },
            image_100x100: {
                source: 'images',
                map: (images: Images) => images.px100x100,
            },
            image_75x75: {
                source: 'images',
                map: (images: Images) => images.px75x75,
            },
            image_50x50: {
                source: 'images',
                map: (images: Images) => images.px50x50,
            },
            visible_instructors: {
                source: 'instructors',
                map: (instructors: Instructor[]) => {
                    return instructors.map((instructor: Instructor) => {
                        return {
                            display_name: instructor.name,
                        };
                    });
                },
            },
            completion_ratio: 'completionPercentage',
        };
    }
}
