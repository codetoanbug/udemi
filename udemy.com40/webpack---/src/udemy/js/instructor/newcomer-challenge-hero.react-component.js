import {Image, Button} from '@udemy/react-core-components';
import {Checkbox} from '@udemy/react-form-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import udLink from 'utils/ud-link';

import HeroContentImageSecondary from './assets/images/newcomer-challenge-hero-image-secondary.png';
import HeroContentImage from './assets/images/newcomer-challenge-hero-image.png';
import {JOIN_NEWCOMER_CHALLENGE_STATUS_STATE} from './constants';
// eslint-disable-next-line no-unused-vars
import styles from './newcomer-challenge.less';

@observer
class NewcomerChallengeHero extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        content: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.content = this.props.content;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    renderTitle = (titleLines) => {
        const lines = titleLines.map((title) => (
            <p className="ud-heading-serif-xxxl" key={title}>
                {title}
            </p>
        ));
        return <div data-purpose="hero-content-title">{lines}</div>;
    };

    renderSubtitle = (subtitleLines) => {
        const lines = subtitleLines.map((subtitle) => (
            <p className="ud-text-xl" styleName="styles.lighter-text-subtitle" key={subtitle}>
                {subtitle}
            </p>
        ));
        return (
            <div data-purpose="hero-content-subtitle" styleName="styles.subtitle-lines">
                {lines}
            </div>
        );
    };

    renderButton = (buttonContent) => {
        const canJoin =
            this.store.newcomerChallengeJoinedStatus ===
                JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.NOT_JOINED ||
            this.store.newcomerChallengeJoinedStatus === JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.ERROR;
        const isDisabled = buttonContent.disabled || (!this.store.isIntendedToJoin && canJoin);
        const componentClass = buttonContent.componentClass
            ? buttonContent.componentClass
            : undefined;
        const href = buttonContent.href ? buttonContent.href : undefined;
        return (
            <div styleName="styles.button-section">
                <Button
                    data-purpose="hero-content-join-button"
                    typography="Udemy Sans Pan"
                    componentClass={componentClass}
                    disabled={isDisabled}
                    onClick={canJoin ? this.store.joinTheNewcomerChallenge : undefined}
                    styleName="styles.join-button"
                    href={href}
                >
                    {buttonContent.text}
                </Button>
            </div>
        );
    };

    renderCheckboxContent = () => {
        const isDisabled = this.content.buttonContent.disabled;
        return (
            <div styleName="styles.container-hero-content-join">
                <Checkbox
                    styleName="styles.min-width-none"
                    data-purpose="hero-content-checkbox"
                    onChange={this.onChange}
                    disabled={isDisabled}
                    defaultChecked={isDisabled}
                ></Checkbox>
                <div>
                    <p
                        className="ud-text-xs"
                        styleName="styles.lighter-text-checkbox"
                        data-purpose="hero-content-join-info-one"
                    >
                        {gettext(
                            'By joining the challenge, you agree to receive emails with helpful tips',
                        )}
                    </p>
                    <p
                        className="ud-text-xs"
                        styleName="styles.lighter-text-checkbox"
                        data-purpose="hero-content-join-info-two"
                    >
                        {gettext('and promotions reserved for instructors. ')}
                        <a
                            data-purpose="official-rules"
                            href={udLink.toSupportLink('ncc_official_rules')}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{textDecoration: 'underline'}}
                        >
                            {gettext('See official rules')}
                        </a>
                    </p>
                </div>
            </div>
        );
    };

    @autobind
    onChange(event) {
        this.store.setIsIntendedToJoin(event.target.checked);
    }

    render() {
        const status = this.store.newcomerChallengeJoinedStatus;

        const heroImage =
            status === JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.NOT_JOINED
                ? HeroContentImage
                : HeroContentImageSecondary;
        return (
            <div styleName="styles.hero-section">
                <div data-purpose="hero-content" styleName="styles.container-hero">
                    {this.renderTitle(this.content.titleLines)}
                    {this.renderSubtitle(this.content.subtitleLines)}
                    {status === JOIN_NEWCOMER_CHALLENGE_STATUS_STATE.NOT_JOINED &&
                        this.renderCheckboxContent()}
                    {this.renderButton(this.content.buttonContent)}
                </div>
                <div styleName="styles.hero-image-section">
                    <Image src={heroImage} styleName={'container-image'} data-purpose="image" />
                </div>
            </div>
        );
    }
}

export default NewcomerChallengeHero;
