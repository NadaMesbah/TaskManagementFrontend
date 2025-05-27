import axios from 'axios';

export const request = (method, url, data, customHeaders = {}) => {
    const headers = {
        ...customHeaders,
    };

    if (!(data instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    } // Otherwise, allow the browser to set `Content-Type` when it's `FormData`

    return axios({
        method,
        url: `http://localhost:8080${url}`,
        data,
        headers,
    });
};