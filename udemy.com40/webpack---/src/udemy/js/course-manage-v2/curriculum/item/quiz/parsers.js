const letterACode = 'a'.charCodeAt(0);

/**
 * Maps 0 to 'a', 1 to 'b', ... 25 to 'z'.
 */
export function parseArrayIndexAsAlphabetChar(index) {
    return String.fromCharCode(letterACode + index);
}

/**
 * This is the inverse of parseArrayIndexAsAlphabetChar.
 */
export function parseAlphabetCharAsArrayIndex(char) {
    return char.toLowerCase().charCodeAt(0) - letterACode;
}

/**
 * @param answers ['foo', 'bar']
 * @param feedbacks ['good', 'bad']
 * @param correctResponse ['a']
 * @returns
 * [{ value: 'foo', feedback: 'good', checked: true },
 *  { value: 'bar', feedback: 'bad', checked: false }]
 */
export function parseMultipleChoiceAnswersAsOptions(answers, feedbacks, correctResponse) {
    const correctIndices = correctResponse.map(parseAlphabetCharAsArrayIndex);
    return answers.map((answer, i) => {
        const feedback = feedbacks[i];
        const isCorrect = correctIndices.indexOf(i) >= 0;
        return parseMultipleChoiceAnswerAsOption(answer, feedback, isCorrect);
    });
}

/**
 * This is the inverse of parseMultipleChoiceAnswersAsOptions.
 */
export function parseMultipleChoiceOptionsAsAnswers(answerOptions) {
    const answers = [];
    const feedbacks = [];
    const correctResponse = [];
    answerOptions.forEach((option, i) => {
        answers.push(option.value);
        feedbacks.push(option.feedback);
        if (option.checked) {
            correctResponse.push(parseArrayIndexAsAlphabetChar(i));
        }
    });
    return {answers, feedbacks, correctResponse};
}

export function parseMultipleChoiceAnswerAsOption(answer, feedback, isCorrect) {
    return {
        value: answer,
        feedback: feedback || '',
        checked: isCorrect,
    };
}

/**
 * @param question '<u-blank data-order="0"></u-blank> and <u-blank data-order="1"></u-blank>'
 * @param correctResponse ['foo', 'bar']
 * @returns '__foo__ and __bar__'
 * Frontend uses the template format to display the FITB prompt.
 */
export function parseFITBAssessmentAsTemplate(question, correctResponse) {
    let template = question;
    correctResponse.forEach((blank, i) => {
        const patternFrom = `<u-blank data-order="${i}"></u-blank>`;
        const patternTo = `__${blank}__`;
        template = template.replace(patternFrom, patternTo);
    });
    template = template.replace(/<\/u-blank>/g, '');
    return template;
}

/**
 * @param template '__foo__ and __bar__'
 * @returns an object with keys:
 *   question: '<u-blank data-order="0"></u-blank> and <u-blank data-order="1"></u-blank>',
 *   correctResponse: ['foo', 'bar'],
 * Backend uses the question/response format to store the FITB prompt.
 */
export function parseFITBAssessmentAsQuestionAndResponse(template) {
    template = template.trim();
    let question = template;
    const correctResponse = [];

    // href and src attribute values can contain __, so remove html tags
    // before searching for blanks in the question. Note that we can remove html tags with
    // `Node.textContent` method, but that has the side effect of unescaping html characters,
    // so if a blank contains &lt; &gt; &amp; then we are not able to find it.
    // Because of that we use regex solution to remove html tags.
    const blanks = template.replace(/<[^>]+>/g, '').match(/__[^]+?__/gm);
    (blanks || []).forEach((blank, i) => {
        correctResponse.push(blank.replace(/__/g, '').trim());
        question = question.replace(blank, `<u-blank data-order="${i}"></u-blank>`);
    });
    return {question, correctResponse};
}
