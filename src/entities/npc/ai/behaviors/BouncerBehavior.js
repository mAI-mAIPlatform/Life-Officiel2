/**
 * BouncerBehavior.js
 * 
 * Gatekeeper logic for clubs, VIP areas, and restricted zones.
 * Validates player attributes (clothes, reputation, mCoins) before granting access.
 */

export class BouncerBehavior {
    constructor(bouncerEntity, accessRules) {
        this.bouncerEntity = bouncerEntity;
        this.accessRules = accessRules || {
            minReputation: 50,
            requiredDressCode: 'formal',
            bribeAmount: 2000
        };
        this.state = 'guarding';
    }

    evaluatePlayer(playerData) {
        let reasonsForDenial = [];

        if (playerData.reputation < this.accessRules.minReputation) {
            reasonsForDenial.push("reputation too low");
        }

        if (this.accessRules.requiredDressCode && playerData.outfitStyle !== this.accessRules.requiredDressCode) {
            reasonsForDenial.push("inappropriate attire");
        }

        return reasonsForDenial;
    }

    interact(playerData, offeredBribe = 0) {
        const denialReasons = this.evaluatePlayer(playerData);

        if (denialReasons.length === 0) {
            return this.grantAccess();
        }

        // Handle bribes
        if (offeredBribe >= this.accessRules.bribeAmount) {
            console.log("[Bouncer]: (Takes money) You're not dressed for it, but I didn't see you. Go in.");
            return this.grantAccess(true);
        } else if (offeredBribe > 0) {
            console.log("[Bouncer]: You're joking, right? This isn't enough.");
            return false;
        }

        console.log(`[Bouncer]: You can't come in. Reason: ${denialReasons.join(', ')}.`);
        return false;
    }

    grantAccess(wasBribed = false) {
        this.state = 'letting_pass';

        if (!wasBribed) {
            console.log("[Bouncer]: Looks good. Go right ahead.");
        }

        // Trigger door opening logic
        return true;
    }
}
