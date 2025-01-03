export const validatePlayerData = (formData,t) => {
    const errors = {};

    if (!formData.name) {
        errors.name = t('playerPage.name_required');
    } else if (formData.name.length < 5 || formData.name.length > 30) {
        errors.name = t('playerPage.name_invalid');
    }

    if (!formData.clazz) {
        errors.clazz = t('playerPage.clazz_required');
    } else if (formData.clazz.length < 5 || formData.clazz.length > 30) {
        errors.clazz = t('playerPage.name_invalid');
    }

    if (!formData.speciality) {
        errors.speciality = t('playerPage.speciality_required');
    } else if (formData.speciality.length < 5 || formData.speciality.length > 30) {
        errors.speciality = t('playerPage.speciality_invalid');
    }

    if (formData.persuasionLevel === null || formData.persuasionLevel === undefined) {
        errors.persuasionLevel = t('playerPage.persuasionLevel_required');
    } else if (!Number.isInteger(formData.persuasionLevel) || formData.persuasionLevel < 0 || formData.persuasionLevel > 9999999999) {
        errors.persuasionLevel = t('playerPage.persuasionLevel_invalid');
    }

    return errors;
};
