export const ALL_QUERY = `
query {
    me {
        lastAccessedEnrollment: programEnrollments(first: 1) {
            edges {
                node {
                    id
                    program {
                        id
                        title
                        level
                        icon
                        paths {
                            edges {
                                node {
                                    id
                                    title
                                    color
                                    programs {
                                        edges {
                                            node {
                                                id
                                                title
                                                icon
                                                level
                                                duration
                                                questionAnswerCount
                                            }
                                        }
                                    }
                                    channels {
                                        edges {
                                            node {
                                                id
                                                title
                                                paths {
                                                    edges {
                                                        node {
                                                            id
                                                            title
                                                            color
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        programEnrollments {
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            edges {
                cursor
                node {
                    id
                    completionRatio
                    lastAccessedTime
                    user
                    organization
                    program {
                        id
                        title
                        level
                        icon
                        courses {
                            edges {
                                cursor
                                node {
                                    id
                                    title
                                }
                            }
                        }
                        paths {
                            edges {
                                node {
                                    id
                                    title
                                    # color ?
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`;

export const PROGRAM_ENROLLMENTS_QUERY = `
query {
    me {
        programEnrollments {
            pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
            }
            edges {
                cursor
                node {
                    id
                    completionRatio
                    lastAccessedTime
                    user
                    organization
                    program {
                        id
                        title
                        level
                        icon
                        courses {
                            edges {
                                cursor
                                node {
                                    id
                                    title
                                }
                            }
                        }
                        paths {
                            edges {
                                node {
                                    id
                                    title
                                    # color ?
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
`;

export const DATA_STATES = {
    IDLE: 'I',
    LOADING: 'L',
    SUCCESS: 'S',
    ERROR: 'E',
    EMPTY: 'Z',
};

export const QUERIES_BY_USE_CASE = {
    ALL: ALL_QUERY,
    PROGRAM_ENROLLMENTS: PROGRAM_ENROLLMENTS_QUERY,
};
