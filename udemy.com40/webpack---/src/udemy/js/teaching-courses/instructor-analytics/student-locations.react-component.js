import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ListPanel from './list-panel.react-component';
import StudentLocationsListItem from './student-locations-list-item.react-component';
import './list-panel.less';

@observer
export default class StudentLocations extends Component {
    static propTypes = {
        countries: PropTypes.object.isRequired,
        languages: PropTypes.object.isRequired,
    };

    render() {
        const {countries, languages} = this.props;

        const countryPanel = {
            title: ninterpolate('%s country', '%s countries', countries.numCountries),
            content: countries,
        };
        const languagePanel = {
            title: ninterpolate('%s language', '%s languages', languages.numLanguages),
            content: languages,
            hasTooltip: true,
            tooltipCopy: gettext(
                "This table shows your students' primary language. " +
                    'Students may take courses in languages other than their primary one.',
            ),
        };

        return (
            <div styleName="list-panels" data-purpose="students-country-panels">
                {[countryPanel, languagePanel].map((panel) => (
                    <ListPanel
                        key={panel.title}
                        title={panel.title}
                        content={panel.content}
                        listItemClass={StudentLocationsListItem}
                        hasTooltip={panel.hasTooltip}
                        tooltipCopy={panel.tooltipCopy}
                        minContentHeight={172}
                    />
                ))}
            </div>
        );
    }
}
