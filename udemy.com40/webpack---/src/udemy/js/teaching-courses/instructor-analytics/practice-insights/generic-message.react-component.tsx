import {Image} from '@udemy/react-core-components';
import {observer} from 'mobx-react';
import React from 'react';

import './practice-insights.less';

interface GenericMessageProps {
    image: string;
    title: string;
    messageRows: (string | JSX.Element)[];
}

export const GenericMessage = observer(({image, title, messageRows}: GenericMessageProps) => {
    function getMessage(message: string | JSX.Element, i: number) {
        const dataPurpose = `generic-message-text-${i}`;
        return (
            <div styleName="generic-message-text" data-purpose={dataPurpose} key={i}>
                {message}
            </div>
        );
    }
    return (
        <>
            <div styleName="generic-message" data-purpose="generic-message-component">
                <div styleName="generic-message-image">
                    <Image
                        src={image}
                        alt=""
                        width={240}
                        height={180}
                        data-purpose="generic-message-image"
                    />
                </div>
                <div data-purpose="generic-message-heading" styleName="generic-message-heading">
                    {title}
                </div>
                <div
                    data-purpose="generic-message-text-section"
                    styleName="generic-message-text-section"
                >
                    {messageRows.map((message, i) => {
                        return getMessage(message, i);
                    })}
                </div>
            </div>
        </>
    );
});
