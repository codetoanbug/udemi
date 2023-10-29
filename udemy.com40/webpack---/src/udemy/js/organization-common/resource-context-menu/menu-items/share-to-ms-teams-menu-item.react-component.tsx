import {withI18n, WithI18nProps} from '@udemy/i18n';
import MSTeamsIcon from '@udemy/icons/dist/ms-teams.ud-icon';
import {udLink, withUDData, WithUDDataProps} from '@udemy/ud-data';
import {observer, inject} from 'mobx-react';
import React from 'react';

import {RESOURCE_TYPES} from 'organization-common/constants';
import {trackClickAction} from 'organization-common/resource-context-menu/helpers';
import {DEFAULT_SHARE_MESSAGE} from 'organization-common/resource-preview/constants';

import ContextMenuItem from './context-menu-item.react-component';

export interface CourseType {
    id: number;
    title: string;
    url: string;
}
export interface LearningPathType extends CourseType {
    editors: [{display_name: string}];
}
export interface AssessmentType extends CourseType {
    description: string;
}
export interface LabType extends CourseType {
    visibleInstructors: [{id: number; title: string; url: string}];
}

type ResourceTypeKeys = keyof typeof RESOURCE_TYPES;

export interface ShareToMSTeamsMenuItemProps {
    resource: AssessmentType | CourseType | LearningPathType | LabType;
    resourceContext: string;
    resourceType: typeof RESOURCE_TYPES[ResourceTypeKeys];
}

@inject('resourceContext')
@observer
export class InternalShareToMSTeamsMenuItem extends React.Component<
    ShareToMSTeamsMenuItemProps & WithI18nProps & WithUDDataProps
> {
    static shouldRender: () => boolean;
    constructor(props: ShareToMSTeamsMenuItemProps & WithI18nProps & WithUDDataProps) {
        super(props);
        const {
            resourceType,
            resource: {title, url},
        } = props;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const defaultShareMessage: {[index: string]: any} = DEFAULT_SHARE_MESSAGE;
        const salutation = defaultShareMessage[resourceType].replaceAll('\n', '<br>');
        let desc = '';
        if (resourceType === RESOURCE_TYPES.ASSESSMENT && 'description' in props.resource) {
            desc = props.resource.description.replace(/<\/?[^>]+(>|$)/g, '');
        } else if (resourceType === RESOURCE_TYPES.LAB && 'visibleInstructors' in props.resource) {
            desc = this.composeDescription('Lab', props.resource.visibleInstructors);
        } else if (resourceType === RESOURCE_TYPES.LEARNING_PATH && 'editors' in props.resource) {
            desc = this.composeDescription(
                'Learning path',
                props.resource.editors.map((editor: {display_name: string}) => ({
                    title: editor.display_name,
                })),
            );
        }
        this.messageText = `${salutation}`;
        const markup = ['<blockquote><b>', '</b><br>'];
        // Only 200 characters allowed in the messageText property for MSTeams
        let availableCharacters =
            200 -
            (markup.reduce((accum, next) => (accum += next.length), 0) +
                salutation.length +
                title.length);
        if (resourceType !== RESOURCE_TYPES.COURSE) {
            if (availableCharacters > 0) {
                const descTrimmed = desc.substring(0, availableCharacters);
                availableCharacters -= descTrimmed.length;
                this.messageText += `${markup[0]}${title}${markup[1]}${
                    availableCharacters > 0
                        ? descTrimmed
                        : descTrimmed.substring(0, descTrimmed.length - 3)
                }${availableCharacters > 0 ? '' : '...'}`;
            } else {
                // if a very long title pushes it over the limit, discard the description and trim the title back
                this.messageText += `${markup[0]}${title.substring(
                    0,
                    title.length + (availableCharacters - 3),
                )}...${markup[1]}`;
            }
        }
        // course urls with /learn/ suffix require auth and will not unfurl properly, so clip it off
        this.url = resourceType === RESOURCE_TYPES.COURSE ? url.replace(/\/learn\/$/, '') : url;
    }

    shouldRender = () => this.props.udData.Config.brand.is_share_to_ms_teams_enabled;

    messageText: string;
    url: string;

    composeDescription(resourceName: string, resourceOwners: {title: string}[]): string {
        const {gettext, interpolate} = this.props;
        return interpolate(
            gettext('%(resourceName)s by %(title)s'),
            {
                title: resourceOwners?.map(({title}): string => title).join(', '),
                resourceName,
            },
            true,
        );
    }

    handleClick() {
        const {
            resource: {id: resourceId},
            resourceType,
            resourceContext,
        } = this.props;
        trackClickAction(
            resourceContext,
            'Share to MS Teams',
            {
                resourceType,
                resourceId,
            },
            {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Config: this.props.udData.Config,
            },
        );
        const url = `https://teams.microsoft.com/share?href=${encodeURIComponent(
            udLink.to(`${this.url}`, '', {
                utm_campaign: 'share-to-teams-from-product',
                utm_source: 'ms-teams',
            }),
        )}&msgText=${encodeURIComponent(this.messageText)}&preview=${
            resourceType === RESOURCE_TYPES.COURSE
        }`;
        const options = 'resizable=1,width=726,height=536';
        window.open(url, '_blank', options);
    }

    render() {
        if (!this.shouldRender()) {
            return null;
        }
        return (
            <ContextMenuItem
                icon={<MSTeamsIcon label={false} />}
                title={this.props.gettext('Share to MS Teams')}
                onClick={() => this.handleClick()}
            />
        );
    }
}
/**
 * Since we're moving away from the global functions such as getConfigData, we're not able to use the ud data in the static
 * functions. So we moved shouldRender to instance method.
 *
 * For the compatability, we need to keep the static method shouldRender, but it will always return true.
 */
InternalShareToMSTeamsMenuItem.shouldRender = () => true;

export const ShareToMSTeamsMenuItem = withI18n(withUDData(InternalShareToMSTeamsMenuItem));
