import {LocalizedHtml} from '@udemy/i18n';
import InfoOutlineIcon from '@udemy/icons/dist/info-outline.ud-icon';
import {Button} from '@udemy/react-core-components';
import {Popover} from '@udemy/react-popup-components';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import escapeHtml from 'utils/escape/escape-html';

import './send-dialog.less';

@observer
export default class SendDialog extends Component {
    static propTypes = {
        store: PropTypes.shape({
            courseId: PropTypes.number.isRequired,
            course: PropTypes.shape({
                canSend: PropTypes.bool.isRequired,
                left: PropTypes.number.isRequired,
                max: PropTypes.number.isRequired,
                ownerTimezone: PropTypes.string.isRequired,
                organizationId: PropTypes.number,
            }).isRequired,
        }).isRequired,
        sendUrl: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    };

    popoverContent() {
        const {store} = this.props;
        return (
            <LocalizedHtml
                html={interpolate(
                    gettext(
                        'Count resets at midnight on the first day of the calendar ' +
                            "month, in the course owner's timezone, '<a class=\"tzUrl\">%(owner_timezone)s</a>'.",
                    ),
                    {owner_timezone: escapeHtml(store.course.ownerTimezone)},
                    true,
                )}
                interpolate={{
                    tzUrl: (
                        <a
                            className="ud-link-underline"
                            href="https://www.wikipedia.org/wiki/List_of_tz_database_time_zones"
                            target="_blank"
                            rel="noopener noreferrer"
                        />
                    ),
                }}
            />
        );
    }

    render() {
        const {store, sendUrl, type} = this.props;
        const createButton = store.course.canSend ? (
            <Button
                componentClass="a"
                href={`${sendUrl}?course=${store.courseId}&type=${type}`}
                size="medium"
            >
                {gettext('Compose')}
            </Button>
        ) : (
            <Button size="medium" disabled={true}>
                {gettext('Compose')}
            </Button>
        );

        return (
            <div styleName="create">
                {type !== 'Educational' || !store.course.organizationId ? (
                    <div styleName="count">
                        <LocalizedHtml
                            html={interpolate(
                                gettext(
                                    '<em><strong>%(left)s of %(max)s</strong> left this month</em>',
                                ),
                                {
                                    left: escapeHtml(store.course.left),
                                    max: escapeHtml(store.course.max),
                                },
                                true,
                            )}
                            interpolate={{}}
                        />
                        <Popover
                            placement="left"
                            trigger={
                                <Button size="xsmall" udStyle="ghost">
                                    <InfoOutlineIcon
                                        color="info"
                                        size="small"
                                        label={gettext('Learn more')}
                                    />
                                </Button>
                            }
                        >
                            {this.popoverContent()}
                        </Popover>
                    </div>
                ) : null}
                {createButton}
            </div>
        );
    }
}
