import {Button} from '@udemy/react-core-components';
import {TextInputWithCounter, FormGroup, TextInput, Select} from '@udemy/react-form-components';
import {Loader} from '@udemy/react-reveal-components';
import {FooterButtons} from '@udemy/react-structure-components';
import autobind from 'autobind-decorator';
import {observer} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {withRouter} from 'react-router';

import RichTextEditor from 'base-components/ungraduated/form/rich-text-editor/rich-text-editor.react-component';
import TextInputWithAddons from 'base-components/ungraduated/form/text-input/text-input-with-addons.react-component';
import OrganizationUserProfileEditAlert from 'organization-common/organization-user-profile-edit-alert/organization-user-profile-edit-alert.react-component';
import {safelySetInnerHTML} from 'utils/escape/safely-set-inner-html';

import TwoColumns from '../layout/two-columns.react-component';
import ProfileStore from './profile.mobx-store';
import './basic-info.less';

@withRouter
@observer
export default class BasicInfo extends Component {
    static propTypes = {
        store: PropTypes.object,
        window: PropTypes.object,
        location: PropTypes.object.isRequired,
    };

    static defaultProps = {
        store: null,
        window,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new ProfileStore(props.window);
    }

    componentDidMount() {
        this.store.initializeUserProfile();
    }

    getValidationProps(errorList) {
        if (errorList && errorList.length) {
            const messages = errorList[0].messages || errorList;
            const note = (
                <div
                    className="ud-text-with-links"
                    {...safelySetInnerHTML({
                        descriptionOfCaller: 'instructor-basic-info:error',
                        domPurifyConfig: {ADD_ATTR: ['target']},
                        html: messages.join('<br />'),
                    })}
                />
            );
            return {validationState: 'error', note};
        }
        return {};
    }

    @autobind
    async onSubmit(event) {
        event.preventDefault();
        const currentPathName = this.props.location.pathname;
        await this.store.updateUserProfile();
        if (
            this.props.location.pathname === currentPathName &&
            this.store.originalLocale !== this.store.data.locale
        ) {
            this.props.window.location.reload();
        }
    }

    @autobind
    onChange(event) {
        this.store.setData(event.target.name, event.target.value);
    }

    @autobind
    onDescriptionChange(value) {
        this.store.setDescription(value);
    }

    render() {
        const store = this.store;
        const {data, errors = {}} = store;
        const isUserProfileLoaded = this.store.isUserProfileLoaded;

        if (!isUserProfileLoaded) {
            return <Loader block={true} size="xxlarge" />;
        }
        return (
            <TwoColumns>
                <form onSubmit={this.onSubmit} data-purpose="basic-info-form" styleName="form">
                    {!store.allowChangeUserProfile && (
                        <div styleName="alert-banner">
                            <OrganizationUserProfileEditAlert />
                        </div>
                    )}
                    <TwoColumns.Group>
                        <div>
                            <FormGroup
                                label={gettext('First Name')}
                                {...this.getValidationProps(errors.name)}
                            >
                                <TextInput
                                    name="name"
                                    value={data.name}
                                    onChange={this.onChange}
                                    data-purpose="edit-profile-first-name"
                                    maxLength="64"
                                    disabled={!store.allowChangeUserProfile}
                                />
                            </FormGroup>
                            <FormGroup
                                label={gettext('Last Name')}
                                {...this.getValidationProps(errors.surname)}
                            >
                                <TextInput
                                    name="surname"
                                    value={data.surname}
                                    onChange={this.onChange}
                                    data-purpose="edit-profile-surname"
                                    maxLength="64"
                                    disabled={!store.allowChangeUserProfile}
                                />
                            </FormGroup>
                            {!store.isUFBProfileVisible ? null : (
                                <>
                                    <FormGroup
                                        label={gettext('Headline')}
                                        {...this.getValidationProps(errors.job_title)}
                                    >
                                        <TextInputWithCounter
                                            name="jobTitle"
                                            value={data.jobTitle}
                                            onChange={this.onChange}
                                            data-purpose="edit-profile-last-name"
                                            placeholder={gettext('Instructor at Udemy')}
                                            maxLength={60}
                                        />
                                    </FormGroup>
                                    <FormGroup
                                        label={gettext('Biography')}
                                        note={gettext(
                                            'To help learners learn more about you, your bio should reflect your ' +
                                                'Credibility, Empathy, Passion, and Personality. ' +
                                                'Your biography should have at least 50 words, ' +
                                                'links and coupon codes are not permitted.',
                                        )}
                                        {...this.getValidationProps(errors.description)}
                                    >
                                        <RichTextEditor
                                            theme={RichTextEditor.THEMES.USER_DESCRIPTION}
                                            value={data.description}
                                            onValueChange={this.onDescriptionChange}
                                            data-purpose="edit-profile-description"
                                        />
                                    </FormGroup>
                                    <FormGroup
                                        label={gettext('Language')}
                                        {...this.getValidationProps(errors.locale)}
                                        data-purpose="edit-profile-locale"
                                    >
                                        <Select
                                            name="locale"
                                            onChange={this.onChange}
                                            value={data.locale}
                                        >
                                            <option key="default" value="default">
                                                {gettext('Select language')}
                                            </option>
                                            {store.languageList.map((language) => (
                                                <option
                                                    key={language.locale}
                                                    value={language.locale}
                                                >
                                                    {language.title}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormGroup>
                                </>
                            )}
                        </div>
                        {!store.isUFBProfileVisible ? null : (
                            <div>
                                <FormGroup
                                    label={gettext('Website')}
                                    {...this.getValidationProps(errors.url_personal_website)}
                                >
                                    <TextInput
                                        name="urlPersonalWebsite"
                                        value={data.urlPersonalWebsite}
                                        onChange={this.onChange}
                                        data-purpose="edit-profile-personal-website"
                                        placeholder={gettext('Url')}
                                        maxLength="128"
                                        disabled={!store.isPublishedInstructor}
                                    />
                                </FormGroup>
                                <FormGroup
                                    label={gettext('Twitter')}
                                    {...this.getValidationProps(errors.twitter_profile)}
                                >
                                    <TextInputWithAddons>
                                        <TextInputWithAddons.Addon styleName="social-url-prefix">
                                            {'http://www.twitter.com/'}
                                        </TextInputWithAddons.Addon>
                                        <TextInput
                                            name="twitterProfile"
                                            value={data.twitterProfile}
                                            onChange={this.onChange}
                                            data-purpose="edit-profile-twitter"
                                            placeholder={gettext('Username')}
                                            maxLength="128"
                                        />
                                    </TextInputWithAddons>
                                </FormGroup>
                                <FormGroup
                                    label={gettext('Facebook')}
                                    {...this.getValidationProps(errors.facebook_profile)}
                                >
                                    <TextInputWithAddons>
                                        <TextInputWithAddons.Addon styleName="social-url-prefix">
                                            {'http://www.facebook.com/'}
                                        </TextInputWithAddons.Addon>
                                        <TextInput
                                            name="facebookProfile"
                                            value={data.facebookProfile}
                                            onChange={this.onChange}
                                            data-purpose="edit-profile-facebook"
                                            placeholder={gettext('Username')}
                                            maxLength="128"
                                        />
                                    </TextInputWithAddons>
                                </FormGroup>
                                <FormGroup
                                    label={gettext('LinkedIn')}
                                    {...this.getValidationProps(errors.linkedin_profile)}
                                >
                                    <TextInputWithAddons>
                                        <TextInputWithAddons.Addon styleName="social-url-prefix">
                                            {'http://www.linkedin.com/'}
                                        </TextInputWithAddons.Addon>
                                        <TextInput
                                            name="linkedInProfile"
                                            value={data.linkedInProfile}
                                            onChange={this.onChange}
                                            data-purpose="edit-profile-linkedin"
                                            placeholder={gettext('Resource ID')}
                                            maxLength="128"
                                        />
                                    </TextInputWithAddons>
                                </FormGroup>
                                <FormGroup
                                    label={gettext('Youtube')}
                                    {...this.getValidationProps(errors.youtube_profile)}
                                >
                                    <TextInputWithAddons>
                                        <TextInputWithAddons.Addon styleName="social-url-prefix">
                                            {'http://www.youtube.com/'}
                                        </TextInputWithAddons.Addon>
                                        <TextInput
                                            name="youtubeProfile"
                                            value={data.youtubeProfile}
                                            onChange={this.onChange}
                                            data-purpose="edit-profile-youtube"
                                            placeholder={gettext('Username')}
                                            maxLength="128"
                                        />
                                    </TextInputWithAddons>
                                </FormGroup>
                            </div>
                        )}
                    </TwoColumns.Group>
                    <FooterButtons alignment="left">
                        <Button
                            data-purpose="profile-basics-submit-button"
                            disabled={!store.canSubmit || store.isSubmitting}
                            type="submit"
                        >
                            {store.isWarning ? gettext('Proceed') : gettext('Save')}
                        </Button>
                    </FooterButtons>
                </form>
            </TwoColumns>
        );
    }
}
