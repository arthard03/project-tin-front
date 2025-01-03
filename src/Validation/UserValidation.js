export const validateAuthForm = (username, password) => {
    const errors = {};

    if (!username.trim()) {
        errors.username = 'Username is required.';
    } else if (username.length > 30) {
        errors.username = 'Username must not exceed 30 characters.';
    }

    if (!password.trim()) {
        errors.password = 'Password is required.';
    } else if (password.length < 10) {
        errors.password = 'Password must be at least 10 characters.';
    }

    return errors;
};
//username , password