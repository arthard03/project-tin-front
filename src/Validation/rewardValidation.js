export const validateRewardData = (formData) => {
    const errors = {};

    if (!formData.description) {
        errors.description = "Description is required";
    } else if (formData.description.length < 10 || formData.description.length > 150) {
        errors.description = "Description must be between 10 and 150 characters";
    }

    if (!formData.reward) {
        errors.reward = "Reward is required";
    } else if (!Number.isInteger(Number(formData.reward)) || formData.reward < 0 || formData.reward > 9999999999) {
        errors.reward = "Reward must be a positive integer with up to 10 digits";
    }

    if (!formData.status) {
        errors.status = "Status is required";
    } else if (!Number.isInteger(Number(formData.status)) || formData.status < 0 || formData.status > 1) {
        errors.status = "Status must be a single digit between 0 and 9";
    }

    if (!formData.difficulty) {
        errors.difficulty = "Difficulty is required";
    } else if (formData.difficulty.length < 4 || formData.difficulty.length > 20) {
        errors.difficulty = "Difficulty must be between 4 and 20 characters";
    }

    if (!formData.guildID) {
        errors.guildID = "Guild ID is required";
    } else if (!Number.isInteger(Number(formData.guildID)) || formData.guildID<=0) {
        errors.guildID = "Guild ID must be a valid integer";
    }

    return errors;
};