import { authHeader, handleResponse } from '../_helpers';
import { env } from '../_environment';

export const userService = {
    getUser
};

function getUser() {
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${env.API_URL}/api/user/me`, requestOptions).then(handleResponse);
}