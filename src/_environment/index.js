export const procEnv = process.env.REACT_APP_ENV || process.env.NODE_ENV;

export const getEnvURL = () => {
    if (procEnv === 'production' || procEnv === 'staging') {
        return 'https://reminder-api-demo.herokuapp.com';
    } else {
        return 'http://localhost:3001';
    }
}

export const env = {
    API_URL: getEnvURL()
};