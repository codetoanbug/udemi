import {ClientEvent} from '@udemy/event-tracking';

/* --- Events from some page TO Team Hub / My Groups page --- */

// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// dedicated Homepage dashboard, specifically on a link to view insights for a group.
export class UFBTeamHubHomePageViewInsightsLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubHomePageViewInsightsLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// dedicated Homepage dashboard, specifically on a link to view top topics for a group.
export class UFBTeamHubHomePageViewTopicsLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubHomePageViewTopicsLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// dedicated Homepage dashboard, specifically on a link to discover more about Team Hub.
export class UFBTeamHubHomePageDiscoverMoreLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubHomePageDiscoverMoreLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// Manage Menu.
export class UFBTeamHubManageMenuLinkClickEvent extends ClientEvent {
    constructor() {
        super('UFBTeamHubManageMenuLinkClickEvent');
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// Group Insights dashboard, specifically on the link related to a group name.
export class UFBTeamHubGroupInsightsGroupNameLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubGroupInsightsGroupNameLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// Group Insights dashboard, specifically on a link to view activity for a group.
export class UFBTeamHubGroupInsightsViewActivityLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubGroupInsightsViewActivityLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// Group Insights dashboard, specifically on a link to "MyGroups" in the header/banner.
export class UFBTeamHubGroupInsightsMyGroupsHeaderLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubGroupInsightsMyGroupsHeaderLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Team Hub page from the
// Group Insights dashboard, specifically on a link to "MyGroups" in the footer.
export class UFBTeamHubGroupInsightsMyGroupsFooterLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubGroupInsightsMyGroupsFooterLinkClickEvent');
        this.groupId = groupId;
    }
}

/* --- Events FROM Team Hub / My Groups page to some Insights page --- */

// Event fired when an UFB Admin or Group Admin clicks on a link to the User Activity page from
// the Team Hub page, specifically on a link in the Group learning overview widget to view more
// activity trends.
export class UFBTeamHubMyGroupsOverviewWidgetViewActivityTrendsLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubMyGroupsOverviewWidgetViewActivityTrendsLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the Courses page from
// the Team Hub page, specifically on a link in the Top course widget to view active courses.
export class UFBTeamHubMyGroupsTopCourseWidgetActiveCoursesLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubMyGroupsTopCourseWidgetActiveCoursesLinkClickEvent');
        this.groupId = groupId;
    }
}
// Event fired when an UFB Admin or Group Admin clicks on a link to the User Activity page from
// the Team Hub page, specifically on a link in the Top course widget to view active users.
export class UFBTeamHubMyGroupsTopCourseWidgetActiveUsersLinkClickEvent extends ClientEvent {
    groupId: number;
    constructor({groupId}: {groupId: number}) {
        super('UFBTeamHubMyGroupsTopCourseWidgetActiveUsersLinkClickEvent');
        this.groupId = groupId;
    }
}
