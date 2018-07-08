export const ENDPOINTS = {
    BASE_URL: 'https://obaview.azurewebsites.net',
    STOPS_FOR_ROUTE: '/stops-for-route/',
    STOP: '/stop/',
    ARRIVALS_DEPARTURES: '/arrivals-departures/',
    SEARCH: '/search/'
};

export const COOKIE = 'obaview-stopIds';

export const REFRESH_SECONDS = 60;
export const REFRESH_MILLI = 1000 * REFRESH_SECONDS;

export const INVALID_ROUTE_ERROR =
    "The route ID or number you've entered was not recognized - did you enter a route number by accident?";
export const GENERAL_ERROR =
    'Please check your internet connection and try again.';

export const RESPONSE_OK = 200;
