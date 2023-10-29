export const FastFeedbackState = {
    INITIAL: 1,
    TEXT_ENTRY: 2,
    RESULT: 3,
};

export const STORE_FEEDBACK_MUTATION = `mutation($answerText: String!, $answerOption: Int!, $targetType: LocationType!, $targetId:ID!) {
        storeFeedback(input: {
                answerText: $answerText,
                answerOption: $answerOption,
                location: {
                        targetType: $targetType,
                        targetId: $targetId 
                    }
            }
        )
    }
`;

export const THUMB_DOWN_VALUE = 0;
export const THUMB_UP_VALUE = 1;
