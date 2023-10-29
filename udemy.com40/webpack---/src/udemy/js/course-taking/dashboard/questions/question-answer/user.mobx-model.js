export default class User {
    constructor(apiData) {
        this.id = apiData.id;
        this.name = apiData.name;
        this.displayName = apiData.display_name;
        this.initials = apiData.initials;
        this.image = apiData.image_50x50;
        this.isBanned = apiData.is_banned;
        this.url = apiData.url;
    }
}
