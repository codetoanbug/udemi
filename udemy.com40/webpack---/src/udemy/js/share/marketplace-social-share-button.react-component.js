import {getUniqueId} from '@udemy/design-system-utils';
import ShareIcon from '@udemy/icons/dist/share.ud-icon';
import {Button, IconButton} from '@udemy/react-core-components';
import {BottomDrawer, Modal} from '@udemy/react-dialog-components';
import {Loader} from '@udemy/react-reveal-components';
import autobind from 'autobind-decorator';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import {getDeviceType, DEVICE_TYPE_DESKTOP} from 'browse/lib/device-type';
import {discoveryTracker} from 'browse/tracking';
import {SHARE_TYPES, SOURCE_PAGES} from 'share/constants';
import {isMarketplaceShareEnabled} from 'share/helpers';

let SocialShareStore, MarketplaceSocialShareContent;

@observer
export default class MarketplaceSocialShareButton extends Component {
    static propTypes = {
        buttonStyle: PropTypes.oneOf([
            'primary',
            'ghost',
            'secondary',
            'white-outline',
            'white-solid',
        ]),
        context: PropTypes.string.isRequired,
        fullWidth: PropTypes.bool,
        /**
         * ./marketplace-social-share-lazily-loaded.js
         * is lazily loaded via this function when this button is clicked.
         *
         * For example:
         * () => import(WEBPACK_MAGIC_COMMENTS, 'share/marketplace-social-share-lazily-loaded')
         *
         * Although we're always loading the same file, the WEBPACK_MAGIC_COMMENTS depend on
         * the page that's using this button. On CLP, for example, we want the file to be bundled
         * with the rest of the lazily loaded CLP content.
         */
        load: PropTypes.func.isRequired,
        shareableObject: PropTypes.object.isRequired,
        sourceUrl: PropTypes.string.isRequired,
        round: PropTypes.bool,
        buttonText: PropTypes.string,
        isIconVisible: PropTypes.bool,
        className: PropTypes.string,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
    };

    static defaultProps = {
        buttonStyle: 'secondary',
        fullWidth: true,
        round: false,
        buttonText: undefined,
        isIconVisible: true,
        className: undefined,
        size: 'medium',
    };

    constructor(props) {
        super(props);
        this.id = getUniqueId('social-share-drawer');
    }

    @observable isLoaded = false;
    @observable isShown = false;

    get title() {
        if (!this.isLoaded) {
            return gettext('Loading');
        }
        if (this.store.isImportEmailModalShown) {
            return gettext('Share via email');
        }
        if (this.props.shareableObject.type === SHARE_TYPES.FREE_RESOURCE) {
            return gettext('Share');
        }
        return gettext('Share this course');
    }

    @autobind
    @action
    openContainer() {
        if (this.props.context === SOURCE_PAGES.CLP) {
            discoveryTracker.trackCourseShareEvent(this.props.shareableObject.id);
        }
        this.isShown = true;
        this.store && this.store.hideImportEmailModal();
        const {context, load, shareableObject, sourceUrl} = this.props;
        !this.isLoaded &&
            load().then(
                action((loadedModule) => {
                    SocialShareStore = loadedModule.SocialShareStore;
                    MarketplaceSocialShareContent = loadedModule.MarketplaceSocialShareContent;
                    this.store = new SocialShareStore(shareableObject, sourceUrl, context);
                    this.store.getOrPopulateUrl();
                    this.isLoaded = true;
                }),
            );
    }

    @autobind
    @action
    closeContainer() {
        this.isShown = false;
    }

    render() {
        if (!isMarketplaceShareEnabled(this.props.shareableObject)) {
            return null;
        }

        const Dialog = getDeviceType() === DEVICE_TYPE_DESKTOP ? Modal : BottomDrawer;

        return (
            <>
                {this.props.round ? (
                    <IconButton
                        onClick={this.openContainer}
                        udStyle={this.props.buttonStyle}
                        round={true}
                        size={this.props.size}
                        data-purpose="social-share-button"
                        className={this.props.className}
                    >
                        <ShareIcon label={false} />
                    </IconButton>
                ) : (
                    <Button
                        componentClass="button"
                        onClick={this.openContainer}
                        size={this.props.size}
                        style={this.props.fullWidth ? {width: '100%'} : {}}
                        udStyle={this.props.buttonStyle}
                        data-purpose="social-share-button"
                        className={this.props.className}
                        aria-label={gettext('Share this course')}
                    >
                        <span>{this.props.buttonText || gettext('Share')}</span>
                        {this.props.isIconVisible && <ShareIcon label={false} />}
                    </Button>
                )}
                <Dialog
                    isOpen={this.isShown}
                    onClose={this.closeContainer}
                    title={this.title}
                    id={this.id}
                >
                    {this.isLoaded && this.store.sharedUrl ? (
                        <MarketplaceSocialShareContent
                            store={this.store}
                            onFormCancel={this.store.hideImportEmailModal}
                        />
                    ) : (
                        <Loader block={true} size="medium" />
                    )}
                </Dialog>
            </>
        );
    }
}
