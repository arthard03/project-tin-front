export const validateRewardClaimData = (formData) => {
    const errors = {};

    if (!formData.bountyID) {
        errors.bountyID = "Bounty ID is required";
    } else if (!Number.isInteger(Number(formData.bountyID)) || formData.bountyID <= 0) {
        errors.bountyID = "Bounty ID must be a valid integer";
    }

    if (!formData.claimDate) {
        errors.claimDate = "Claim Date is required";
    }

    if (formData.finishDate && formData.claimDate) {
        if (formData.finishDate < formData.claimDate) {
            errors.finishDate = "Finish Date cannot be earlier than Claim Date";
        }
    }

    if (!formData.playerID) {
        errors.playerID = "Player ID is required";
    } else if (!Number.isInteger(Number(formData.playerID)) || formData.playerID <= 0) {
        errors.playerID = "Player ID must be a valid integer";
    }

    return errors;
};