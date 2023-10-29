import {action, computed, observable} from 'mobx';

import {udQuery} from '@udemy/graphql';
import {captureException} from '@udemy/sentry';

import {DATA_STATES} from './constants';
import {
    LastAccessedEnrollmentGQLResponse,
    PageInfoNode,
    ProgramEnrollmentProgramNode,
    LastAccessedEnrollmentNode,
    LastAccessedEnrollmentPathProgramNode,
    LastAccessedEnrollmentPathChannelNode,
} from './types';

export interface Program {
    duration: number;
    icon: string;
    id: string;
    level: number;
    questionAnswerCount: number;
    title: string;
    url: string;
}

export interface ProgramData extends ProgramEnrollmentProgramNode {
    path: string;
}

export interface PathData {
    title: string;
    programs: Program[];
}

export interface ProgramChannels {
    title: string;
    paths: {
        id: string;
        title: string;
        color: string;
    }[];
}

export interface ProgramCardData {
    completionRatio: number;
    icon: string;
    id: string;
    isEnrolled: boolean;
    level: number;
    path: string;
    title: string;
    url: string;
}

export class ProgramEnrollmentStore {
    @observable state = DATA_STATES.IDLE; // Idle state for isomorphic rendering
    @observable.ref programEnrollmentPageInfo?: PageInfoNode;
    @observable.ref programChannels?: ProgramChannels | null;
    @observable.shallow programData: ProgramData[] = [];
    @observable.shallow pathData: PathData[] = [];

    @action
    setDataState(state: string) {
        this.state = state;
    }

    @computed
    get programCardData(): ProgramCardData[] {
        return this.programData.map((data) => {
            return {
                completionRatio: parseInt(data.completionRatio, 10),
                icon: data.program.icon,
                id: data.program.id,
                isEnrolled: true,
                level: data.program.level,
                path: data.path,
                title: data.program.title,
                url: `/program-taking/${data.program.id}/learn`,
            };
        });
    }

    @action
    setProgramEnrollmentDataByResponse(response: LastAccessedEnrollmentGQLResponse) {
        this.programEnrollmentPageInfo = response.data.me?.programEnrollments?.pageInfo;
        this.programData = response.data.me?.programEnrollments?.edges.map(
            (edge: {node: ProgramEnrollmentProgramNode}) => {
                const programNode = edge.node;
                // TODO: use .color instead of title?
                const path = programNode.program.paths.edges[0].node.title;
                return {...programNode, path};
            },
        );

        // Paths from lastAccessedEnrollment
        this.pathData = response.data.me?.lastAccessedEnrollment?.edges?.map(
            (edge: {node: LastAccessedEnrollmentNode}) => {
                const enrollment: LastAccessedEnrollmentNode = edge.node;
                const edges = enrollment.program.paths.edges;
                return {
                    title: edges[0].node.title,
                    programs: edges[0].node.programs.edges.map(
                        (edge: {node: LastAccessedEnrollmentPathProgramNode}) => {
                            return {...edge.node, url: `/program-taking/${edge.node.id}/learn`};
                        },
                    ),
                };
            },
        );

        // Channels from lastAccessedEnrollment 🤡
        const channel: LastAccessedEnrollmentPathChannelNode =
            response.data.me?.lastAccessedEnrollment?.edges[0]?.node.program.paths.edges[0]?.node
                .channels.edges[0]?.node;

        this.programChannels = channel
            ? {
                  title: channel.title,
                  paths: channel.paths.edges.map(
                      (edge: {
                          node: {
                              id: string;
                              title: string;
                              color: string;
                          };
                      }) => edge.node,
                  ),
              }
            : null;

        this.setDataState(this.programData.length ? DATA_STATES.SUCCESS : DATA_STATES.EMPTY);
    }

    async queryProgramEnrollments(query?: string) {
        try {
            const response = await udQuery({
                query,
            });
            this.setProgramEnrollmentDataByResponse(response);
            return response;
        } catch (e) {
            captureException(e);
            this.setDataState(DATA_STATES.ERROR);
        }
    }

    async fetchProgramEnrollments(query?: string) {
        this.setDataState(DATA_STATES.LOADING);
        return await this.queryProgramEnrollments(query);
    }
}
