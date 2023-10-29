import {observer} from 'mobx-react';
import React from 'react';

import {Button, Image} from '@udemy/react-core-components';
import {useUDData} from '@udemy/ud-data';

import {udemyBenesseLogoInvertedUrl} from '../../external/utils/udemy-logo-urls';

interface LogoProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

interface LogosProps {
    isJpFooter: boolean;
}

export const Logos = observer(({isJpFooter}: LogosProps) => {
    const {Config} = useUDData();

    const logoHeight = 34;
    const udemyBenesseLogoHeight = 43; // Chosen so the 'Udemy' portion of the combined logo matches the normal Udemy logo.
    const udemyBenesseLogoAspectRatio = 1501 / 268; // Aspect ratio of the combined logo. Used to calculate the displayed width.

    const logos: LogoProps[] = [
        // First logo is always Udemy
        // in UB China, this is both UB logo and sanjieke logo
        {
            src: Config.brand.product_logo_light as string,
            alt: Config.brand.product_name as string,
            width: logoHeight * (Config.brand.product_logo_aspect_ratio as number),
            height: logoHeight,
        },
    ];

    // Replace the Udemy logo with a combined Udemy and Benesse logo in Marketplace Japan.
    if (isJpFooter && !Config.brand.has_organization) {
        logos[0] = {
            src: udemyBenesseLogoInvertedUrl,
            alt: 'Udemy-Benesse-Logo',
            width: udemyBenesseLogoHeight * udemyBenesseLogoAspectRatio,
            height: udemyBenesseLogoHeight,
        };
    }

    return (
        <>
            {logos.map((logo: LogoProps, i) => {
                if (i === 0) {
                    return (
                        <Button key={logo.alt} componentClass="a" udStyle="link" href="/">
                            <Image {...logo} lazy={false} />
                        </Button>
                    );
                }
                return <Image key={logo.alt} {...logo} lazy={false} />;
            })}
        </>
    );
});
