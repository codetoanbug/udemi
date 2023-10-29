/**
 * Warning: this is no longer the canonical version of this module/file.
 *
 * The canonical code is now published in `@udemy/shopping`
 *
 * Avoid updating this file as it may be removed soon. If you need to make changes
 * then please remove this file and update all references to point to the version
 * published in the package above. Apply your changes to the version in that package.
 **/

import {useI18n} from '@udemy/i18n';
import WishlistedIcon from '@udemy/icons/dist/wishlisted.ud-icon';
import {Button, ButtonProps, IconButton, ButtonSizeType} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';
import React, {MouseEventHandler} from 'react';

import {UnwishlistedIcon} from './unwishlisted-icon.react-component';

export interface WishlistButtonProps {
    isWishlisted: boolean;
    isLoading: boolean;
    onClick?: MouseEventHandler<HTMLElement>;
    round?: boolean;
    size?: ButtonSizeType;
    wishlistCta?: string;
    wishlistedCta?: string;
    labelPosition?: 'left' | 'right';
    square?: boolean;
    givenButtonProps?: ButtonProps;
}

export const WishlistButton = (props: WishlistButtonProps) => {
    const {
        isWishlisted,
        isLoading,
        onClick,
        round = false,
        size = 'medium',
        wishlistCta = undefined,
        wishlistedCta = null,
        labelPosition = 'left',
        square = false,
        givenButtonProps,
    } = props;
    const {gettext} = useI18n();
    const buttonProps: ButtonProps = {
        udStyle: 'secondary',
        size,
        onClick,
        ...givenButtonProps,
        disabled: givenButtonProps?.disabled,
        'aria-pressed': isWishlisted,
        'aria-label': wishlistCta,
    };
    const WishlistIcon = isWishlisted ? WishlistedIcon : UnwishlistedIcon;
    const loader = isLoading ? <Loader color="inherit" /> : null;
    const wishlistCtaText = wishlistCta ?? gettext('Add to wishlist');
    const wishlistedCtaText = wishlistedCta ?? gettext('Wishlisted');
    const label = isWishlisted ? wishlistedCtaText : wishlistCtaText;
    if (square || round) {
        return (
            <IconButton {...buttonProps} round={round}>
                {loader ?? <WishlistIcon color="inherit" label={false} />}
            </IconButton>
        );
    }
    return (
        <Button {...buttonProps}>
            {loader ?? (
                <>
                    {labelPosition == 'left' && <span>{label}</span>}
                    <WishlistIcon
                        color="inherit"
                        size={labelPosition == 'right' ? size : 'small'}
                        label={false}
                    />
                    {labelPosition == 'right' && <span>{label}</span>}
                </>
            )}
        </Button>
    );
};
