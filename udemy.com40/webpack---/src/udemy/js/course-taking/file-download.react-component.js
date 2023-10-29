import PropTypes from 'prop-types';
import React, {Component} from 'react';

export default class FileDownload extends Component {
    /*
        A component that will trigger a file download by rendering a link and immediately 'clicking'
        it. Useful for downloading files when a user takes some action, if the download URL isn't
        known at the time of the action.

        example:
        1) user clicks a button to download a file. The URL for the file is not known.
        2) on click, an API request is made to find the download URL.
        3) when the download URL is returned, render this component with that URL to immediately
           trigger a download.
     */
    static propTypes = {
        downloadUrl: PropTypes.string.isRequired,
        onDownloadStarted: PropTypes.func.isRequired,
    };

    componentDidMount() {
        if (this.linkElement) {
            this.linkElement.click();
            this.props.onDownloadStarted();
        }
    }

    render() {
        return (
            <a
                style={{display: 'none'}}
                target="_self"
                href={this.props.downloadUrl}
                ref={(elem) => {
                    this.linkElement = elem;
                }}
            />
        );
    }
}
