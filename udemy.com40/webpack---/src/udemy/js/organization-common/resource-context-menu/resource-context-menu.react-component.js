import {useI18n} from '@udemy/i18n';
import ExpandIcon from '@udemy/icons/dist/expand.ud-icon';
import MoreIcon from '@udemy/icons/dist/more.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {Provider, observer, inject} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

import {CONTEXT_TYPES} from './constants';
import {childrenToRender} from './helpers';
import MenuPopup from './menu-popup.react-component';
import styles from './resource-context-menu.less';

export const Actions = observer(({children}) => {
    const {gettext} = useI18n();
    return (
        <MenuPopup
            trackingLabel={gettext('Share')}
            trigger={
                <Button>
                    {gettext('Share')}
                    <ExpandIcon label={false} />
                </Button>
            }
            menuItems={childrenToRender(children)}
            hasMenuForOneItem={false}
        />
    );
});

Actions.shouldRender = (props) => !!childrenToRender(props.children).length;

export const MenuItems = inject('resourceContextMenuProps')(
    observer(({resourceContextMenuProps, children}) => {
        const {gettext} = useI18n();
        return (
            <MenuPopup
                trackingLabel="dottedMenu"
                trigger={
                    <IconButton>
                        <MoreIcon
                            color={
                                resourceContextMenuProps.udStyle === 'ghost' ? 'neutral' : 'inherit'
                            }
                            label={gettext('Actions')}
                        />
                    </IconButton>
                }
                menuItems={childrenToRender(children)}
                hasMenuForOneItem={true}
            />
        );
    }),
);

MenuItems.shouldRender = (props) => !!childrenToRender(props.children).length;

export const Divider = () => <div className={styles.divider} tabIndex="-1" />;
Divider.shouldRender = () => true;

@observer
export default class ResourceContextMenu extends React.Component {
    static propTypes = {
        context: PropTypes.string.isRequired,
        placement: PropTypes.string,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        udStyle: PropTypes.oneOf(['ghost', 'secondary', 'white-outline', 'white-solid']),
    };

    static defaultProps = {
        placement: 'bottom-end',
        size: 'small',
        udStyle: 'ghost',
    };

    constructor(props) {
        super(props);

        const {placement, size, udStyle} = props;
        this.resourceContextMenuProps = {placement, size, udStyle};
    }

    render() {
        const {children, context} = this.props;
        const validChildren = childrenToRender(children);

        if (!validChildren.length) {
            return null;
        }

        return (
            <Provider
                resourceContext={context}
                resourceContextMenuProps={this.resourceContextMenuProps}
            >
                <div
                    className={styles['resource-context-menu-options']}
                    data-purpose="options-dropdown"
                >
                    {validChildren}
                </div>
            </Provider>
        );
    }
}

ResourceContextMenu.Actions = Actions;
ResourceContextMenu.Menu = MenuItems;
ResourceContextMenu.Divider = Divider;
ResourceContextMenu.CONTEXT = CONTEXT_TYPES;
