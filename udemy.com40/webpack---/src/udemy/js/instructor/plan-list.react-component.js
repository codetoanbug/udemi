import {Table} from '@udemy/react-structure-components';
import React, {Component} from 'react';

// eslint-disable-next-line no-unused-vars
import styles from './newcomer-challenge.less';

class PlanList extends Component {
    render() {
        const rows = [
            {
                index: 0,
                step: gettext('Step 1: '),
                text: gettext('Choose your course topic'),
            },
            {
                index: 1,
                step: gettext('Step 2: '),
                text: gettext('Create your objectives and outline'),
            },
            {
                index: 2,
                step: gettext('Step 3: '),
                text: gettext('Write and practicing your script'),
            },
            {
                index: 3,
                step: gettext('Step 4: '),
                text: gettext('Get ready to record'),
            },
            {
                index: 4,
                step: gettext('Step 5: '),
                text: gettext('Edit your course'),
            },
            {
                index: 5,
                step: gettext('Step 6: '),
                text: gettext('Record your course'),
            },
            {
                index: 6,
                step: gettext('Step 7: '),
                text: gettext('Create your marketing plan'),
            },
            {
                index: 7,
                step: gettext('Step 8: '),
                text: gettext('Publish your course'),
            },
        ];
        const renderRow = (columns, rows, row) => (
            <tr key={row.index}>
                <td data-purpose="item">
                    <p className="ud-text-lg">
                        <b>{row.step}</b>
                        {row.text}
                    </p>
                </td>
            </tr>
        );

        return (
            <div data-purpose="main" styleName="styles.plan">
                <div styleName="styles.plan-content">
                    <p className="ud-heading-serif-xxl" data-purpose="title">
                        {gettext('Here’s the plan')}
                    </p>
                    <p
                        className="ud-text-xl"
                        data-purpose="sub-title"
                        styleName="styles.plan-subtitle"
                    >
                        {gettext('Tips, tricks, and inspiration direct to your inbox')}
                    </p>
                    <Table
                        columns={[]}
                        rows={rows}
                        noBackgroundColor={true}
                        noBorder={true}
                        renderRow={renderRow}
                        padding="md"
                    />
                </div>
            </div>
        );
    }
}

export default PlanList;
