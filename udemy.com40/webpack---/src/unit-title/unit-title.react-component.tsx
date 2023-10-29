import classNames from 'classnames';
import React from 'react';

import {DiscoveryUnit, DiscoverySourceObject} from '@udemy/discovery-api';
import {useI18n} from '@udemy/i18n';
/* eslint-disable react-hooks/exhaustive-deps */
import {Button} from '@udemy/react-core-components';
import {serverOrClient} from '@udemy/shared-utils';
import {useUDData} from '@udemy/ud-data';

import {SEARCH_URL, UFB_SEARCH_URL} from '../constants';
import styles from './unit-title.module.less';

function hasLinkableSourceObjects(sourceObjects?: DiscoverySourceObject[]) {
    const linkableObjectTypes = ['course', 'course_label', 'subcategory'];
    return (
        sourceObjects?.length &&
        sourceObjects.every((obj) => linkableObjectTypes.includes(obj.type))
    );
}

export interface UnitTitleProps {
    /** The DiscoveryUnit we're displaying a title for.*/
    unit: DiscoveryUnit;
    /** Whether or not to make the title small.*/
    small?: boolean;
    /** An optional override for the header's style.*/
    typography?: string;
    /** An optional override for the component's className.*/
    className?: string;
    /**
     *
     * A template string to use for the subtitle.
     *
     * @remarks
     * The template string will be interpolated with the subtitle as a param named `title`.
     * So, your template string should look something like:
     * `"Words words words %(title)s words words words"`
     **/
    subtitleTemplate?: string;
}

/**
 * String formatter that supports JSX.
 * Returns an array of React fragments, suitable for using in a component's render method.
 *
 * Basic example:
 *   jsxFormat('Hello {}. I like {}.', ['World', <strong>turtles!</strong>]);
 *
 *   ['Hello ', 'world', '. I like ', <strong>turtles!</strong>]
 *
 * An error will be thrown if a replacement cannot be found:
 *   jsxFormat('Replace this: {}', [])
 */
function jsxFormat(string: string, replacements: (string | React.JSX.Element)[]) {
    let curIndex = 0;
    return string.split(/({})/).map((fragment, i) => {
        if (fragment === '{}') {
            if (curIndex >= replacements.length) {
                throw new Error(`Missing replacement for fragment at index ${curIndex}`);
            }
            return <React.Fragment key={i}>{replacements[curIndex++]}</React.Fragment>;
        }
        return fragment;
    });
}

/**
 * The UnitTitle component.
 * This component will take a DiscoveryUnit, and render a formatted title with potential subtitle for it.
 */
export const UnitTitle = ({
    unit,
    small = false,
    typography,
    className,
    subtitleTemplate,
}: UnitTitleProps) => {
    const {interpolate} = useI18n();
    const {Config} = useUDData();

    const buildUrlList = (unit: DiscoveryUnit) => {
        const sourceObjects = unit.source_objects;
        if (sourceObjects?.length) {
            if (unit.recommendation_params?.fft === 'searchrecommendation') {
                const searchQueryParams = `src=reco&q=${encodeURIComponent(
                    sourceObjects[0].title,
                )}`;
                const baseSearchUrl = Config.brand.has_organization ? UFB_SEARCH_URL : SEARCH_URL;
                return [`${baseSearchUrl}?${searchQueryParams}`];
            }
            return sourceObjects.map((item: DiscoverySourceObject) => item.url);
        }
        return [];
    };
    const {title, subtitle} = React.useMemo(() => {
        const sourceObjects = unit.source_objects;
        let sourceObjectLinks;

        const sourceObjectUrlList = hasLinkableSourceObjects(sourceObjects)
            ? buildUrlList(unit)
            : [];

        if (sourceObjectUrlList.length && sourceObjects?.length) {
            sourceObjectLinks = sourceObjectUrlList.map((url, i) =>
                url !== serverOrClient.global.location?.pathname ? (
                    <a
                        href={url ?? undefined}
                        className="ud-link-underline"
                        data-purpose="discovery-unit-url"
                    >
                        {sourceObjects[i].title}
                    </a>
                ) : (
                    sourceObjects[i].title
                ),
            );
        }

        return {
            title:
                sourceObjectLinks && unit.raw_title
                    ? jsxFormat(unit.raw_title, sourceObjectLinks)
                    : unit.title,
            subtitle:
                subtitleTemplate && sourceObjects?.length
                    ? interpolate(subtitleTemplate, {title: sourceObjects[0].title}, true)
                    : null,
        };
    }, [unit, unit.title, unit.raw_title, subtitleTemplate]);
    const dataPurpose = {
        ...(unit.recommendation_params?.u && {
            'data-purpose': `discovery-unit-${unit.recommendation_params.u}`,
        }),
    };

    const headerStyle = classNames(typography ?? 'ud-heading-xl', {
        'small-title': small,
    });

    return (
        <div
            className={classNames(className, styles.container, {
                [styles['has-title']]: title && title.length > 0,
            })}
        >
            <div className={styles['title-container']}>
                <h2
                    className={classNames(headerStyle, styles.title)}
                    data-us={unit.score}
                    {...dataPurpose}
                >
                    {title}
                </h2>
                {unit.actionLink && (
                    <Button
                        componentClass="a"
                        udStyle="link-underline"
                        size="medium"
                        {...unit.actionLink.buttonProps}
                    >
                        {unit.actionLink.text}
                    </Button>
                )}
            </div>
            {subtitle && (
                <div className={classNames('ud-text-sm', styles.subtitle)} data-purpose="subtitle">
                    {subtitle}
                </div>
            )}
        </div>
    );
};
