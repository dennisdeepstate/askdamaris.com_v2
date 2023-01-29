class Reply{
    /**
     * @param {boolean} success
     * @param {String []} replies
     */
    constructor(success, replies){
        this.success = success,
        this.replies = replies
    }
}
class Session{
    /**
     * @param {string} sessionId
     * @param {string} email
     * @param {string | null} userAgent
     * @param {number} expiry
     */
    constructor(sessionId, email, userAgent, expiry){
        this.sessionId = sessionId,
        this.email = email,
        this.userAgent = userAgent
        this.expiry = expiry
    }
}

export {
    Reply,
    Session
}