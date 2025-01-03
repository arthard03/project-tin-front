export const validateAuthForm = (username, password,t) => {
    const errors = {};

    if (!username.trim()) {
        errors.username = t('player.username_required');
    } else if (username.length > 30) {
        errors.username = t('player.username_invalid');
    }

    if (!password.trim()) {
        errors.password = t('player.password_required');
    } else if (password.length < 10) {
        errors.password = t('player.password_invalid');
    }

    return errors;
};
//username , password