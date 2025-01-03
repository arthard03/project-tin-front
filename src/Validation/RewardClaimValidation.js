export const validateRewardClaimData = (formData,t) => {
    const errors = {};

    if (!formData.bountyID) {
        errors.bountyID = t('rewardClaim.bountyID_invalid');
    } else if (!Number.isInteger(Number(formData.bountyID)) || formData.bountyID <= 0) {
        errors.bountyID =  t('rewardClaim.bountyID_required');
    }

    if (!formData.claimDate) {
        errors.claimDate =  t('rewardClaim.claimDate_invalid');
    }

    if (formData.finishDate && formData.claimDate) {
        if (formData.finishDate < formData.claimDate) {
            errors.finishDate =  t('rewardClaim.finishDate_invalid');
        }
    }

    if (!formData.playerID) {
        errors.playerID =  t('rewardClaim.playerID_required');
    } else if (!Number.isInteger(Number(formData.playerID)) || formData.playerID <= 0) {
        errors.playerID = t('rewardClaim.playerID_invalid');
    }

    return errors;
};