/* eslint-disable udemy/import-disallow */
import {LocalizedHtml} from '@udemy/i18n';
import React from 'react';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';

import './query-switcher.less';

interface QuerySwitcherProps {
    correctedPhrase?: string;
    originalPhrase?: string;
    suggestedPhrase?: string;
}

export const QuerySwitcher = withRouter(
    ({
        correctedPhrase,
        originalPhrase,
        suggestedPhrase,
        location,
    }: QuerySwitcherProps & RouteComponentProps) => {
        if (typeof window === undefined) {
            return null;
        }

        return (
            <>
                {originalPhrase && correctedPhrase && (
                    <>
                        <LocalizedHtml
                            styleName="container"
                            html={interpolate(
                                gettext('Showing results for <a class="linkText">%s</a>'),
                                [
                                    correctedPhrase
                                        .split(' ')
                                        .map((word, i) =>
                                            word !== originalPhrase.split(' ')[i]
                                                ? `<i><b>${word}</i></b>`
                                                : word,
                                        )
                                        .join(' '),
                                ],
                            )}
                            interpolate={{
                                linkText: (
                                    <Link
                                        to={`${location.pathname}?q=${encodeURIComponent(
                                            correctedPhrase,
                                        )}`}
                                    />
                                ),
                            }}
                        />
                        <LocalizedHtml
                            styleName="container"
                            html={interpolate(
                                gettext(
                                    'Search instead for <a class="originalPhrase"><q>%s</q></a>',
                                ),
                                [originalPhrase],
                            )}
                            interpolate={{
                                originalPhrase: (
                                    <Link
                                        to={`${location.pathname}?q=${encodeURIComponent(
                                            originalPhrase,
                                        )}&src=sop`}
                                    />
                                ),
                            }}
                        />
                    </>
                )}
                {suggestedPhrase && (
                    <LocalizedHtml
                        styleName="container"
                        html={interpolate(
                            gettext(
                                'Did you mean: <a class="suggestedPhrase"><b><q>%s</q></b></a>',
                            ),
                            [suggestedPhrase],
                        )}
                        interpolate={{
                            suggestedPhrase: (
                                <Link
                                    to={`${location.pathname}?q=${encodeURIComponent(
                                        suggestedPhrase,
                                    )}&src=sgp`}
                                />
                            ),
                        }}
                    />
                )}
            </>
        );
    },
);
