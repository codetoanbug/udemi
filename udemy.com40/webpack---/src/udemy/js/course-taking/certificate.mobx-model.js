export default class Certificate {
    constructor(apiData) {
        this.url = apiData.long_url;
        this.isReady = apiData.is_ready;
    }
}
