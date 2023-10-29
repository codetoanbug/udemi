import {useI18n, LocalizedHtml} from '@udemy/i18n';
import {Picture} from '@udemy/react-core-components';
import {tokens} from '@udemy/styles';
import {useUDData} from '@udemy/ud-data';
import classNames from 'classnames';
import React from 'react';

import styles from './error.module.less';

/** React Prop interface for `ErrorPage` */
export interface ErrorPageProps {
    /**
     * The heading to display on the Error Page
     *
     * @defaultValue `We can’t find the page you’re looking for` in `ErrorPage`
     */
    heading?: string;
    /**
     * The body content of the page.
     *
     * @defaultValue `Visit our <a class="link">support page</a> for further assistance.` in `ErrorPage`
     */
    content?: string;
    /**
     * URL for support page link
     *
     * @defaultValue `https://www.udemy.com/support/` in `ErrorPage`
     */
    supportHref?: string;
}

/**
 * ### The ErrorPage component
 *
 * @remarks
 * Provides scaffolding for error page content to display on Udemy.com.
 * The default values are for a 404 (Not Found) page.
 */
export const ErrorPage = (props: ErrorPageProps) => {
    const {Config, request} = useUDData();
    const {gettext} = useI18n();

    const {
        heading = gettext('We can’t find the page you’re looking for'),
        content = gettext('Visit our <a class="link">support page</a> for further assistance.'),
        supportHref = `${Config.url.to_app}support/`,
    } = props;
    const isMobile = request.isMobile;

    const pictureSources = [
        {
            srcSet: 'https://s.udemycdn.com/error_page/error-desktop-v1.jpg 1x, https://s.udemycdn.com/error_page/error-desktop-2x-v1.jpg 2x',
            media: '(min-width: 600px)',
            width: 480,
            height: 360,
        },
        {
            srcSet: 'https://s.udemycdn.com/error_page/error-mobile-v1.jpg 1x, https://s.udemycdn.com/error_page/error-mobile-2x-v1.jpg 2x',
            media: `(max-width: ${tokens['breakpoint-mobile-max']})`,
            width: 240,
            height: 180,
        },
    ];

    return (
        <div className={styles.container}>
            <Picture
                src="https://s.udemycdn.com/error_page/error-desktop-v1.jpg"
                sources={pictureSources}
                alt=""
            ></Picture>
            <h1
                className={
                    isMobile
                        ? `ud-heading-serif-xl ${styles.greeting}`
                        : `ud-heading-serif-xxl ${styles.greeting}`
                }
            >
                {heading}
            </h1>
            <p className={classNames(styles.cta, 'ud-text-with-links')}>
                <LocalizedHtml html={content} interpolate={{link: <a href={supportHref} />}} />
            </p>
        </div>
    );
};
