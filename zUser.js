class User {
    constructor(profileUrl) {
        this.profileUrl = profileUrl;
        this.muted = this.isMuted();

        this.interactedWith = this.isInteractedWith();
    }

    toggleMute() {
        this.interactedWith = true;
        let interactedUsers = GM_getValue("interactedUsers", []);
        if (!interactedUsers.includes(this.profileUrl)) {
            interactedUsers.push(this.profileUrl);
            GM_setValue("interactedUsers", interactedUsers);
        }

        if (this.muted) {
            this.unmute();
        } else {
            this.mute();
        }
    }

    isMuted() {
        let mutedUsers = GM_getValue("mutedUsers", []);
        return mutedUsers.includes(this.profileUrl);
    }

    isInteractedWith() {
        let interactedUsers = GM_getValue("interactedUsers", []);
        return interactedUsers.includes(this.profileUrl);
    }

    mute() {
        this.muted = true;
        let mutedUsers = GM_getValue("mutedUsers", []);

        if (!mutedUsers.includes(this.profileUrl)) {
            mutedUsers.push(this.profileUrl);
            GM_setValue("mutedUsers", mutedUsers);
            console.log(GM_getValue("mutedUsers", []));
        }

        window.location.reload();
    }

    unmute() {
        this.muted = false;
        let mutedUsers = GM_getValue("mutedUsers", []);

        if (mutedUsers.includes(this.profileUrl)) {
            mutedUsers.splice(mutedUsers.indexOf(this.profileUrl), 1);
            GM_setValue("mutedUsers", mutedUsers);
        }

        window.location.reload();
    }
}
