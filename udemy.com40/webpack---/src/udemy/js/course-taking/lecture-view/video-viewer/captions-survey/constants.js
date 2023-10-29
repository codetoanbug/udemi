import SystemMessage from 'utils/ud-system-message';

export const AUTO_CAPTIONS_SURVEY_CODE = 'captions_feedback_v2';
export const MT_CAPTIONS_SURVEY_CODE = 'captions_feedback_mt_v2';

export const SYSTEM_MESSAGE_FOR_SURVEY = {
    [AUTO_CAPTIONS_SURVEY_CODE]: SystemMessage.ids.autoCaptionSurvey,
    [MT_CAPTIONS_SURVEY_CODE]: SystemMessage.ids.mtCaptionSurvey,
};

export const IF_SATISFIED_QUESTION = 'captions-satisfaction-mt-v2';
export const WHY_DISSATISFIED_QUESTION = 'why-not-satisfied-mt-v2';
export const FURTHER_INFO_QUESTION = 'why-dissatisfied-other-mt-v2';

export const ANSWERS_THAT_TRIGGER_DISSATISFIED_QUESTION = [
    'not-satisfied-or-dissatisfied',
    'somewhat-dissatisfied',
    'very-dissatisfied',
];

export const ANSWER_THAT_TRIGGERS_FURTHER_INFO_QUESTION = 'other';
