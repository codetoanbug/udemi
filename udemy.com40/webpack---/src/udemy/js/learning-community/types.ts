/* eslint-disable @typescript-eslint/naming-convention */

import {
    GetLearningCommunityActivitiesQuery,
    LearningCommunityCreateReason,
    LearningCommunityCreateReasonType,
} from 'gql-codegen/api-platform-graphql';

export type ReasonType = LearningCommunityCreateReasonType;
export const ReasonType = LearningCommunityCreateReasonType;
export type Reason = LearningCommunityCreateReason;

export interface Topic {
    id: number;
    title: string;
    url?: string;
}

export interface Category {
    id: string;
    title: string;
}

// image & email are needed only some of the time
export interface UserProfile {
    name: string;
    surname: string;
    image?: string | undefined;
    email?: string | undefined;
}

export interface User {
    id: number;
    profile: UserProfile;
}

export interface LearningCommunity {
    id: string;
    title: string;
    description?: string;
    topics: Array<Topic>;
    reason: Reason;
    owner: User;
    members: User[];
    numberOfMembers: number;
}

export interface LearningCommunityInput {
    title: LearningCommunity['title'];
    description: LearningCommunity['description'];
    reason: LearningCommunity['reason'];
    topics: Pick<Topic, 'id'>[];
}

// copy/paste from @udemy/ud-data/types
export interface SupportedLanguage {
    locale: string;
    name: string;
    lang: string;
}

export interface LearningCommunityLocalizedMessage {
    [key: string]: {
        concat: string;
        message: string;
    };
}

// only undefined as initializing component without a valid learning community
export interface MessageTokens {
    title?: string;
    topics?: string;
}

export type ActivityItem = NonNullable<
    GetLearningCommunityActivitiesQuery['learningCommunityActivities']
>['items'][0];

export type ActivityUser = ActivityItem['by'];
export type BaseActivityEvent = ActivityItem['event'];
export type LearningProductEvent = Extract<
    ActivityItem['event'],
    {__typename: 'LearningProductEvent'}
>;

export type CurriculumItemEvent = Extract<
    ActivityItem['event'],
    {__typename: 'LearningCommunityCurriculumItemEvent'}
>;
