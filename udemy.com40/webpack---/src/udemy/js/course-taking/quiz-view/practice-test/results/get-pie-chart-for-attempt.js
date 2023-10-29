import {tokens} from '@udemy/styles';

const piePieces = {
    correct: {
        color: tokens['color-green-200'],
        label: gettext('Correct'),
    },
    incorrect: {
        color: tokens['color-red-200'],
        label: gettext('Wrong answer'),
    },
    skipped: {
        color: tokens['color-gray-200'],
        label: gettext('Skipped'),
    },
    unanswered: {
        color: tokens['color-gray-200'],
        label: gettext('Unanswered'),
    },
};

export default function getPieChartForAttempt(attempt, options) {
    return {
        chart: {
            type: 'pie',
            width: options.width,
            height: options.height,
            backgroundColor: 'transparent',
            margin: [0, 0, 0, 0],
        },
        credits: {
            enabled: false,
        },
        title: {
            text: '',
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b>',
        },
        plotOptions: {
            pie: {
                allowPointSelect: options.allowPointSelect,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                },
                innerSize: '70%',
            },
        },
        series: [
            {
                data: Object.entries(piePieces).map(([status, piePiece]) => {
                    return {
                        name: piePiece.label,
                        y: attempt.results_summary[status] || 0,
                        color: piePiece.color,
                    };
                }),
                states: {
                    hover: {
                        halo: false,
                    },
                    inactive: {
                        opacity: 1,
                    },
                },
            },
        ],
    };
}
