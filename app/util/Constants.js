const isDev = window.location.hostname === 'localhost';

export const ENDPOINTS = {
    BASE_URL: isDev
        ? 'http://localhost:8080'
        : 'https://obaview.azurewebsites.net',
    STOPS_FOR_ROUTE: '/stops-for-route/',
    STOP: '/stop/',
    ARRIVALS_DEPARTURES: '/arrivals-departures/',
    SEARCH: '/search/'
};

export const COOKIE = 'obaview-stopIds';

export const REFRESH_SECONDS = 60;
export const REFRESH_MILLI = 1000 * REFRESH_SECONDS;

export const GENERAL_ERROR =
    'Please verify your route number, or check your internet connection and try again.';

export const RESPONSE_OK = 200;
