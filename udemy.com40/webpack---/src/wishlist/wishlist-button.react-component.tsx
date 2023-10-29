import React, {MouseEventHandler} from 'react';

import {useI18n} from '@udemy/i18n';
import WishlistedIcon from '@udemy/icons/dist/wishlisted.ud-icon';
import {Button, ButtonProps, IconButton, ButtonSizeType} from '@udemy/react-core-components';
import {Loader} from '@udemy/react-reveal-components';

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
