import React from 'react';

import {Button, ButtonProps} from '@udemy/react-core-components';
import {UDLinkApi, useUDLink} from '@udemy/ud-data';

export interface HeaderAuthButtonProps {
    authParams?: Parameters<UDLinkApi['toAuth']>[0];
}

export const HeaderAuthButton = ({
    authParams = {},
    ...buttonProps
}: HeaderAuthButtonProps & ButtonProps) => {
    const udLink = useUDLink();

    buttonProps.componentClass = 'a';
    buttonProps.href = udLink.toAuth({...authParams, responseType: 'html'});

    return <Button size="medium" {...buttonProps} />;
};
