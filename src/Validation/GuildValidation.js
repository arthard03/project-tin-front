export const validateGuildData = (formData, t) => {
    const errors = {};

    if (!formData.name) {
        errors.name = t('guilds.form.name.required');
    } else if (formData.name.length < 10 || formData.name.length > 30) {
        errors.name = t('guilds.form.name.length');
    }

    if (!formData.description) {
        errors.description = t('guilds.form.description.required');
    } else if (formData.description.length < 10 || formData.description.length > 150) {
        errors.description = t('guilds.form.description.length');
    }

    if (formData.members === null || formData.members === undefined) {
        errors.members = t('guilds.form.members.required');
    } else if (!Number.isInteger(formData.members) || formData.members < 0 || formData.members > 9999999999) {
        errors.members = t('guilds.form.members.invalid');
    }

    return errors;
};