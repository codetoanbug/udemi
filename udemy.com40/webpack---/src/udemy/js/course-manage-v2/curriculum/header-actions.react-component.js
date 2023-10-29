import {Button} from '@udemy/react-core-components';
import {Dropdown} from '@udemy/react-menu-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

export const PreviewButton = ({url}) => {
    return (
        <Button
            componentClass="a"
            udStyle="white-outline"
            size="small"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
        >
            {gettext('Preview')}
        </Button>
    );
};

PreviewButton.propTypes = {
    url: PropTypes.string.isRequired,
};

export const PreviewDropdown = ({studentUrl, instructorUrl}) => {
    return (
        <Dropdown
            placement="bottom-end"
            trigger={
                <Dropdown.Button udStyle="white-outline" size="small">
                    {gettext('Preview')}
                </Dropdown.Button>
            }
        >
            <Dropdown.Menu>
                <Dropdown.MenuItem
                    componentClass="div"
                    href={instructorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {gettext('As Instructor')}
                </Dropdown.MenuItem>
                <Dropdown.MenuItem
                    componentClass="div"
                    href={studentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {gettext('As Student')}
                </Dropdown.MenuItem>
            </Dropdown.Menu>
        </Dropdown>
    );
};

PreviewDropdown.propTypes = {
    instructorUrl: PropTypes.string.isRequired,
    studentUrl: PropTypes.string.isRequired,
};

@observer
export default class HeaderActions extends Component {
    static propTypes = {
        wasPublished: PropTypes.bool.isRequired,
        learnUrl: PropTypes.string.isRequired,
    };

    render() {
        const {wasPublished, learnUrl} = this.props;
        const instructorUrl = `${learnUrl}?instructorPreviewMode=instructor_v4`;
        const studentUrl = `${learnUrl}?instructorPreviewMode=student_v4`;

        return wasPublished ? (
            <PreviewButton url={instructorUrl} />
        ) : (
            <PreviewDropdown studentUrl={studentUrl} instructorUrl={instructorUrl} />
        );
    }
}
