import getConfigData from 'utils/get-config-data';
import udExternalLoaders from 'utils/ud-external-loaders';

const udConfig = getConfigData();

const networkBehaviors = {
    facebook: (shareTarget) => {
        udExternalLoaders.loadFacebookSDK(() => {
            // eslint-disable-next-line no-undef
            FB.init({
                appId: udConfig.third_party.facebook_app_id,
                autoLogAppEvents: true,
                xfbml: true,
                version: 'v2.11',
            });
            // eslint-disable-next-line no-undef
            FB.ui({
                method: 'share',
                app_id: udConfig.third_party.facebook_app_id,
                display: 'iframe',
                href: shareTarget,
                redirect_uri: shareTarget,
            });
        });
    },
    fb_workplace: (shareTarget) => {
        const url = `https://work.facebook.com/sharer.php?display=popup&u=${shareTarget}`;
        const options = 'toolbar=0,status=0,resizable=1,width=626,height=436';
        window.open(url, 'sharer', options);
    },
    twitter: (shareTarget, componentContext) => {
        const twitterBoxWidth = 550;
        const twitterBoxHeight = 420;
        const twitterBoxLeft = window.innerWidth / 2 - twitterBoxWidth / 2;
        const twitterBoxTop = window.innerHeight / 2 - twitterBoxHeight / 2;
        const windowParams = `scrollbars=yes,resizable=yes,toolbar=no,location=yes,
        width=${twitterBoxWidth},height=${twitterBoxHeight}, left=${twitterBoxLeft},
        top=${twitterBoxTop}`;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                componentContext.shareableText,
            )}&url=${encodeURIComponent(shareTarget)}`,
            'intent',
            windowParams,
        );
    },
    mailto: (shareTarget, componentContext) => {
        const emailBody = `${componentContext.shareableText}\n${shareTarget}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(
            componentContext.title,
        )}&body=${encodeURIComponent(emailBody)}`;
    },
    mail_ref: (shareTarget, componentContext, actions) => {
        actions.showImportEmailModal();
    },
    clipboard: (shareTarget, componentContext, actions) => {
        actions.showCopyText();
    },
    messenger: (shareTarget) => {
        const appId = udConfig.third_party.facebook_app_id;
        window.open(
            `fb-messenger://share?link=${encodeURIComponent(
                shareTarget,
            )}&app_id=${encodeURIComponent(appId)}`,
        );
    },
    whatsapp: (shareTarget, componentContext) => {
        const url = `https://wa.me?text=${encodeURIComponent(
            `${componentContext.shareableText}\n${shareTarget}`,
        )}`;
        window.open(url);
    },
};

export default networkBehaviors;
