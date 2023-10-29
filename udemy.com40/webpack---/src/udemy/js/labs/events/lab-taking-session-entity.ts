/**
 Record representing a lab taking session (i.e. a student starting a lab)
 See source: https://github.com/udemy/schema-store/blob/master/fields/LabTakingSession.avdl
 */
export class LabTakingSessionEntity {
    /**
     * The time current lab taking session was started
     * Format "%Y-%m-%dT%H:%M:%SZ"
     */
    sessionStartTime: string | null;

    /**
     * Session duration in seconds
     * The time between the lab instance start / resume time and the pause event
     */
    sessionDurationSeconds: number;
    constructor(sessionStartTime: string | null, sessionDurationSeconds: number) {
        this.sessionStartTime = sessionStartTime;
        this.sessionDurationSeconds = sessionDurationSeconds;
    }
}
