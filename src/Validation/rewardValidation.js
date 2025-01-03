export const validateRewardData = (formData,t) => {
    const errors = {};

    if (!formData.description) {
        errors.description = t('reward.description_required');
    } else if (formData.description.length < 10 || formData.description.length > 150) {
        errors.description = t('reward.description_invalid');
    }

    if (!formData.reward) {
        errors.reward = t('reward.reward_required');
    } else if (!Number.isInteger(Number(formData.reward)) || formData.reward < 0 || formData.reward > 9999999999) {
        errors.reward = t('reward.reward_invalid');
    }

    if (!formData.status) {
        errors.status = t('reward.status_required');
    } else if (!Number.isInteger(Number(formData.status)) || formData.status < 0 || formData.status > 1) {
        errors.status = t('reward.status_invalid');
    }

    if (!formData.difficulty) {
        errors.difficulty = t('reward.difficulty_required');
    } else if (formData.difficulty.length < 4 || formData.difficulty.length > 20) {
        errors.difficulty = t('reward.difficulty_invalid');
    }

    if (!formData.guildID) {
        errors.guildID = t('reward.guild_required');
    } else if (!Number.isInteger(Number(formData.guildID)) || formData.guildID<=0) {
        errors.guildID = t('reward.guild_invalid');
    }

    return errors;
};