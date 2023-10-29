import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Helmet} from 'react-helmet';

import getConfigData from 'utils/get-config-data';

const udConfig = getConfigData();

export default class VideoAssetSchemaMarkup extends Component {
    static propTypes = {
        course: PropTypes.shape({
            headline: PropTypes.string.isRequired,
            visible_instructors: PropTypes.arrayOf(
                PropTypes.shape({
                    display_name: PropTypes.string.isRequired,
                    url: PropTypes.string.isRequired,
                }).isRequired,
            ).isRequired,
            locale: PropTypes.shape({
                locale: PropTypes.string.isRequired,
            }),
        }).isRequired,
        title: PropTypes.string.isRequired,
        asset: PropTypes.shape({
            thumbnailUrl: PropTypes.string.isRequired,
            created: PropTypes.string.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);
        this.schemaObject = {
            '@type': 'VideoObject',
            '@context': 'http://schema.org',
            publisher: {
                '@type': 'Organization',
                name: 'Udemy',
                sameAs: udConfig.url.to_app,
                logo: {
                    '@type': 'ImageObject',
                    url: `${
                        udConfig.url.to_app
                    }${'/staticx/udemy/images/v7/apple-touch-icon-60x60.png'}`,
                    height: 60,
                    width: 60,
                },
            },
            provider: {
                '@type': 'Organization',
                name: props.course.visible_instructors[0].display_name,
                sameAs: `${udConfig.url.to_app.slice(0, -1)}${
                    props.course.visible_instructors[0].url
                }`,
            },
            name: props.title,
            description: props.course.headline,
            isAccessibleForFree: true,
            image: props.asset.thumbnailUrl,
            inLanguage: props.course.locale.locale.slice(0, 2),
            thumbnailUrl: props.asset.thumbnailUrl,
            uploadDate: props.asset.created,
        };
    }

    render() {
        return (
            <Helmet>
                <script type="application/ld+json">{JSON.stringify(this.schemaObject)}</script>
            </Helmet>
        );
    }
}
