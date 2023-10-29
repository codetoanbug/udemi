/* eslint-disable */
/**
 * This file exposes strings needing i10n support
 * since original strings were not extracted somehow.
 * Slack thread: https://udemy.slack.com/archives/C26CHKUG0/p1689608525481159?thread_ts=1689093043.196999&cid=C26CHKUG0
 */

export function noop() {
    gettext('January');
    gettext('February');
    gettext('March');
    gettext('April');
    gettext('May');
    gettext('June');
    gettext('July');
    gettext('August');
    gettext('September');
    gettext('October');
    gettext('November');
    gettext('December');
    gettext('Jan');
    gettext('Feb');
    gettext('Mar');
    gettext('Apr');
    gettext('May');
    gettext('Jun');
    gettext('Jul');
    gettext('Aug');
    gettext('Sep');
    gettext('Oct');
    gettext('Nov');
    gettext('Dec');
    gettext('Sunday');
    gettext('Monday');
    gettext('Tuesday');
    gettext('Wednesday');
    gettext('Thursday');
    gettext('Friday');
    gettext('Saturday');
    gettext('Sun');
    gettext('Mon');
    gettext('Tue');
    gettext('Wed');
    gettext('Thu');
    gettext('Fri');
    gettext('Sat');
    gettext('Active learners');
    gettext('Minutes taught per active learner');
    gettext('Minutes consumed by active learners');
    gettext('Go to learner list');
    gettext('The percentage of learners who submitted a passing solution out of all the learners who attempted this coding exercise (clicked "Run tests").');
    gettext('This is the number of learners who’ve watched more than 15 seconds of a lecture.');
    gettext('This is the percentage of learners who started the lecture and then stopped watching within 15 seconds.');
    gettext('This is the amount of the lecture that learners, on average, completed watching.');
    gettext('Number of learners who opened this coding exercise.');
    gettext('The percentage of learners who viewed this coding exercise but never clicked "Run tests."');
    gettext('Expect a decrease in active learners from your first lecture to your last. ' +
        'This is normal for online courses.');
    gettext(
        'Number of learners who opened this coding exercise.',
    );
    gettext(
        'Number of learners who opened this simple quiz.',
    );
    gettext(
        'Number of learners who opened this practice test',
    );
    gettext('Number of learners who viewed this coding exercise');
    gettext('Number of learners who opened this coding exercise and clicked "Run tests"',);
    gettext(
        'Number of the learners opened this coding exercise and completed successfully',
    )
    gettext( 'The amount of time your learners have spent taking this coding exercise over the specified time period.',);

    const count = 5;
    ninterpolate(
        '%(count)s learner',
        '%(count)s learners',
        count,
        {
            count: count,
        },
    );

    const value = 5;
    ninterpolate(
    '%s minute taught',
    '%s minutes taught',
        value);
    ninterpolate(
        '%s active learner',
        '%s active learners',value
    );
    ninterpolate(
        '%s learner',
        '%s learners',value
    );


    interpolate(
        gettext('%(value)s learners viewed'),
        {value},
        true,
    );
    interpolate(
        gettext('%(value)s learners viewed'),
        {value},
        true,
    );
    interpolate(
        gettext('%(value)s learners viewed'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this quiz.',
    );
    interpolate(
        gettext('%(value)s learners clicked "Run tests"'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this coding exercise and clicked "Run tests".',
    );
    interpolate(
        gettext('%(value)s learners submitted this simple quiz'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this simple quiz and submitted.',
    );
    interpolate(
        gettext('%(value)s learners who submitted this practice test'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this practice test and submitted.',
    );
    interpolate(
        gettext('%(value)s learners who submitted this quiz'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this quiz.',
    );
    interpolate(
        gettext('%(value)s learners completed'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this coding exercise and completed successfully.',
    );
    interpolate(
        gettext('%(value)s learners completed'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this simple quiz and completed successfully.',
    );
    interpolate(
        gettext('%(value)s learners completed'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this practice test and completed successfully.',
    );
    interpolate(
        gettext('%(value)s learners completed'),
        {value},
        true,
    );
    gettext(
        'Number of learners who opened this quiz and completed successfully.',
    );
}
