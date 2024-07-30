const HOST = "http://localhost:3005";

const AUTH_ROUTE = `${HOST}/api/auth`;

const CHECK_USER_ROUTE = `${AUTH_ROUTE}/login`;
const PROFILE_ROUTE = `${HOST}/api/profile`;

export { 
    HOST,
    CHECK_USER_ROUTE,
    PROFILE_ROUTE, 
};