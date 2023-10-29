import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import accessibility from 'highcharts/modules/accessibility';
import React from 'react';

accessibility(Highcharts);
const HighchartsWrapper = (props) => {
    Highcharts.setOptions({
        lang: {
            months: [
                gettext('January'),
                gettext('February'),
                gettext('March'),
                gettext('April'),
                pgettext('The unabbreviated version of the fifth month', 'May'),
                gettext('June'),
                gettext('July'),
                gettext('August'),
                gettext('September'),
                gettext('October'),
                gettext('November'),
                gettext('December'),
            ],
            shortMonths: [
                gettext('Jan'),
                gettext('Feb'),
                gettext('Mar'),
                gettext('Apr'),
                pgettext('The 3 letter abbreviation of the fifth month', 'May'),
                gettext('Jun'),
                gettext('Jul'),
                gettext('Aug'),
                gettext('Sep'),
                gettext('Oct'),
                gettext('Nov'),
                gettext('Dec'),
            ],
            weekdays: [
                gettext('Sunday'),
                gettext('Monday'),
                gettext('Tuesday'),
                gettext('Wednesday'),
                gettext('Thursday'),
                gettext('Friday'),
                gettext('Saturday'),
            ],
            shortWeekdays: [
                gettext('Sun'),
                gettext('Mon'),
                gettext('Tue'),
                gettext('Wed'),
                gettext('Thu'),
                gettext('Fri'),
                gettext('Sat'),
            ],
        },
    });

    return <HighchartsReact highcharts={Highcharts} {...props} />;
};

/* This constant is added for some default accessibility configurations in order to avoid any
errors caused by the addition of `accessibility` for the HighchartsWrapper. It can be used to add
other default configurations if needed. */
export const DefaultHighchartsConfig = {
    accessibility: {
        enabled: false,
    },
};
export default HighchartsWrapper;
