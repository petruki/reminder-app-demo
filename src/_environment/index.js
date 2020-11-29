export const getEnvURL = () => {
    if (process.env.REACT_APP_ENV === 'production' ||
        process.env.REACT_APP_ENV === 'staging') {
            return 'https://reminder-api-demo.herokuapp.com';
    } else {
        return 'http://localhost:3001';
    }
}

export const env = {
    API_URL: getEnvURL()
};