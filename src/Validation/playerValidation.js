export const validatePlayerData = (formData) => {
    const errors = {};

    if (!formData.name) {
        errors.name = "Name is required";
    } else if (formData.name.length < 5 || formData.name.length > 30) {
        errors.name = "Name must be between 5 and 30 characters";
    }

    if (!formData.clazz) {
        errors.clazz = "Class is required";
    } else if (formData.clazz.length < 5 || formData.clazz.length > 30) {
        errors.clazz = "Class must be between 5 and 30 characters";
    }

    if (!formData.speciality) {
        errors.speciality = "Speciality is required";
    } else if (formData.speciality.length < 5 || formData.speciality.length > 30) {
        errors.speciality = "Speciality must be between 5 and 30 characters";
    }

    if (formData.persuasionLevel === null || formData.persuasionLevel === undefined) {
        errors.persuasionLevel = "Persuasion Level is required";
    } else if (!Number.isInteger(formData.persuasionLevel) || formData.persuasionLevel < 0 || formData.persuasionLevel > 9999999999) {
        errors.persuasionLevel = "Persuasion Level must be a positive integer with up to 10 digits";
    }

    return errors;
};
