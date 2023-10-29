import FacebookIcon from '@udemy/icons/dist/facebook.ud-icon';
import LinkIcon from '@udemy/icons/dist/link.ud-icon';
import LinkedinIcon from '@udemy/icons/dist/linkedin.ud-icon';
import TwitterIcon from '@udemy/icons/dist/twitter.ud-icon';
import YoutubeIcon from '@udemy/icons/dist/youtube.ud-icon';

export default class Instructor {
    constructor(apiData) {
        this.id = apiData.id;
        this.title = apiData.title;
        this.name = apiData.name;
        this.initials = apiData.initials;
        this.url = apiData.url;
        this.jobTitle = apiData.job_title;
        this.description = apiData.description;
        this.image = apiData.image_200_H;
        this.image50x50 = apiData.image_50x50;
        this.socialProfiles = [
            {name: 'Twitter', Icon: TwitterIcon, url: apiData.url_twitter},
            {name: 'Facebook', Icon: FacebookIcon, url: apiData.url_facebook},
            {name: 'LinkedIn', Icon: LinkedinIcon, url: apiData.url_linkedin},
            {name: 'YouTube', Icon: YoutubeIcon, url: apiData.url_youtube},
            {
                name: gettext('Personal website'),
                Icon: LinkIcon,
                url: apiData.url_personal_website,
            },
        ].filter((profile) => profile.url);
    }
}
