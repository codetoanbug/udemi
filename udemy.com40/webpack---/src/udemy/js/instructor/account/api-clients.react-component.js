import {LocalizedHtml} from '@udemy/i18n';
import {Button} from '@udemy/react-core-components';
import {Modal, ModalTrigger} from '@udemy/react-dialog-components';
import {AlertBanner} from '@udemy/react-messaging-components';
import {MainContentLoader} from '@udemy/react-reveal-components';
import classNames from 'classnames';
import {observer, PropTypes as MobxPropTypes} from 'mobx-react';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import getRequestData from 'utils/get-request-data';

import ApiClientsForm from './api-clients-form.react-component';
import ApiClientsStore from './api-clients.mobx-store';
import {API_STATUS} from './constants';
import RequestInstructorAPIButton from './request-instructor-api-button.react-component';

import './api-clients.less';

function renderAPIClientModal(modalProps) {
    function onSubmitted() {
        modalProps.onClose();
        window.location.reload();
    }

    return (
        <Modal {...modalProps} title={gettext('Request Affiliate API Client')}>
            <ApiClientsForm onSubmitted={onSubmitted} />
        </Modal>
    );
}

export const RequestAPIClientButton = () => {
    return (
        <ModalTrigger
            renderModal={renderAPIClientModal}
            trigger={<Button udStyle="secondary">{gettext('Request Affiliate API Client')}</Button>}
        />
    );
};

export const AlertNoInfo = () => (
    <AlertBanner
        title={gettext("You don't have any API clients yet.")}
        showCta={false}
        styleName="clients"
    />
);

export const ClientApiRow = ({name, content}) => {
    return (
        <div styleName="client-row">
            <div className="ud-text-bold" styleName="client-row-name">
                {name}
            </div>
            <div styleName="client-row-content">{content}</div>
        </div>
    );
};

ClientApiRow.propTypes = {
    name: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
};

export const ClientApi = ({client}) => {
    const {
        name,
        description,
        website,
        client_id: clientId,
        client_secret: clientSecret,
        created,
        status,
        displayed_status: displayedStatus,
        is_approved: isApproved,
    } = client;

    const statusClassName = classNames({
        pending: status === API_STATUS.PENDING,
        approved: status === API_STATUS.APPROVED,
        disapproved: status === API_STATUS.DISAPPROVED,
    });

    return (
        <div styleName="client">
            <ClientApiRow name={gettext('Name:')} content={name} />
            {isApproved && <ClientApiRow name={gettext('Client Id')} content={clientId} />}
            {isApproved && <ClientApiRow name={gettext('Client Secret')} content={clientSecret} />}
            <ClientApiRow name={gettext('Description:')} content={description} />
            <ClientApiRow name={gettext('Website:')} content={website} />
            <ClientApiRow
                name={gettext('Status:')}
                content={<span styleName={statusClassName}>{displayedStatus}</span>}
            />
            <ClientApiRow
                name={gettext('Created:')}
                content={new Date(created).toLocaleDateString(
                    getRequestData().locale.replace('_', '-') || 'en-US',
                    {year: 'numeric', month: 'long'},
                )}
            />
        </div>
    );
};

ClientApi.propTypes = {
    client: PropTypes.shape({
        name: PropTypes.string.isRequired,
        is_approved: PropTypes.bool.isRequired,
        client_id: PropTypes.string,
        clientSecret: PropTypes.string,
        description: PropTypes.string.isRequired,
        website: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        created: PropTypes.string.isRequired,
    }).isRequired,
};

export const ClientApiList = ({clientsApi}) => {
    return (
        <div styleName="clients">
            {clientsApi.map((client) => (
                <ClientApi key={client.id} client={client} />
            ))}
        </div>
    );
};

ClientApiList.propTypes = {
    clientsApi: MobxPropTypes.arrayOrObservableArray.isRequired,
};

@observer
export default class ApiClients extends Component {
    static propTypes = {
        store: PropTypes.object,
    };

    static defaultProps = {
        store: undefined,
    };

    constructor(props) {
        super(props);
        this.store = props.store || new ApiClientsStore();
    }

    componentDidMount() {
        this.store.fetchUserData();
    }

    render() {
        const store = this.store;
        const {isLoaded, clientsApi} = store;

        if (!isLoaded) {
            return <MainContentLoader />;
        }

        return (
            <div styleName="container">
                {this.store.isPremiumInstructor ? (
                    <div styleName="section">
                        <h2 className="ud-heading-xxl" styleName="title">
                            {gettext('Instructor API')}
                        </h2>
                        <p className="ud-text-with-links" styleName="subtitle">
                            <LocalizedHtml
                                html={gettext(
                                    'The Udemy Instructor API lets instructors build client applications and ' +
                                        'integrations with Udemy to manage and automate communication with students ' +
                                        'and other tasks.  To see more details, please visit <a class="link">Udemy Instructor API</a>',
                                )}
                                interpolate={{link: <a href="/developers/instructor/" />}}
                            />
                        </p>
                        <div styleName="request-client-button-row">
                            <RequestInstructorAPIButton store={store} />
                        </div>
                    </div>
                ) : null}
                <div styleName="section">
                    <h2 className="ud-heading-xxl" styleName="title">
                        {gettext('Affiliate API')}
                    </h2>
                    <p className="ud-text-with-links" styleName="subtitle">
                        <LocalizedHtml
                            html={gettext(
                                'The Udemy Affiliate API exposes functionalities of Udemy to help developers ' +
                                    'build client applications and integrations with Udemy.  To see more details, ' +
                                    'please visit <a class="link">Udemy Affiliate API</a>',
                            )}
                            interpolate={{link: <a href="/developers/affiliate/" />}}
                        />
                    </p>
                    <div styleName="request-client-button-row">
                        <RequestAPIClientButton />
                    </div>
                    {clientsApi.length === 0 ? (
                        <AlertNoInfo />
                    ) : (
                        <ClientApiList clientsApi={clientsApi} />
                    )}
                </div>
            </div>
        );
    }
}
