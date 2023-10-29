import {CONSUMER_SUBS_COLLECTION_ID, UB_COLLECTION_ID} from 'assessments/constants';
import udGraphql from 'utils/ud-graphql';
import Raven from 'utils/ud-raven';

export const fromGlobalID = (type, gId) => {
    const buff = new Buffer(gId, 'base64');
    const parsed = buff.toString('ascii').split(':');
    if (parsed.length !== 2) {
        throw new Error('Global ID invalid');
    }
    if (parsed[0] !== type) {
        throw new Error('Global ID type mismatch');
    }
    return Number(parsed[1]);
};

export const fromIntOrGlobalID = (type, id) => {
    let dbId = parseInt(id, 10);
    if (isNaN(dbId)) {
        dbId = fromGlobalID(type, id);
    }

    return dbId;
};

function parseResponseData(data, learningPathId = null) {
    const attempts = data?.latestTestletAttemptFromGroupCollectionV2 || [];

    return attempts
        .map((attemptGroup) => {
            let assessmentLinkDestination = `/skills-assessment/${attemptGroup.group.slug}`;
            if (learningPathId) {
                assessmentLinkDestination += `/?learning_path_id=${learningPathId}`;
            }
            const propsAssessment = {
                type: attemptGroup.testletAttempt.isActive ? 'inProgress' : 'completed',
                groupId: fromIntOrGlobalID('TestletGroup', attemptGroup.group.id),
                title: attemptGroup.group.title,
                assessmentLinkDestination,
                dateCompleted: attemptGroup.testletAttempt.modified,
                testletId: fromIntOrGlobalID('Testlet', attemptGroup.testletAttempt.testlet.id),
            };
            const stats = attemptGroup.testletAttempt?.results?.stats;

            if (stats) {
                propsAssessment.scaleScore = stats.scaleScore;
                propsAssessment.scalePercentile = stats.scalePercentile;
            }

            propsAssessment.isBeta = attemptGroup.group.isBeta;

            const isAssigned = attemptGroup.group.assignment;
            if (isAssigned) {
                propsAssessment.isAssigned = true;
                propsAssessment.assignDueDate = attemptGroup.group.assignment.dueDate;
            }

            return propsAssessment;
        })
        .sort((attempt1, attempt2) => (attempt1.dateCompleted < attempt2.dateCompleted ? 1 : -1));
}

/**
 * Loads the latest testlet attempts for the measure competence unit.
 *
 * @returns {Promise} If the unit is available,
 * resolves to an object with the following shape,
 * else resolves to null.
 */
export default function loadMeasureCompetenceUnit(
    isConsumerSubsSubscriber = false,
    learningPathId = null,
) {
    return udGraphql
        .query({
            query: `
                  query q($input: TestletGroupCollectionInputV2!) {
                    latestTestletAttemptFromGroupCollectionV2(collectionInput: $input) {
                      group {
                        id
                        title
                        slug
                        isBeta
                        assignment {
                          id
                          dueDate
                        }
                      }
                      testletAttempt {
                        isActive
                        modified
                        results {
                          stats {
                            scaleScore
                            scalePercentile
                          }
                        }
                        testlet {
                          id
                        }
                      }
                    }
                  }`,
            variables: {
                input: {
                    collectionId: isConsumerSubsSubscriber
                        ? CONSUMER_SUBS_COLLECTION_ID
                        : UB_COLLECTION_ID,
                },
            },
        })
        .then((response) => {
            return parseResponseData(response.data, learningPathId);
        })
        .catch((e) => {
            // Gql responses may contain both errors and data, so try to parse again
            Raven.captureException(e);
            return parseResponseData(e.data, learningPathId);
        });
}
