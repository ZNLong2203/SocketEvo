const HOST = "http://localhost:3005";

const AUTH_ROUTE = `${HOST}/api/auth`;

const CHECK_USER_ROUTE = `${AUTH_ROUTE}/login`;
const USERS_ROUTE = `${HOST}/api/users`;
const GET_ALL_CONTACTS_ROUTE = `${HOST}/api/users`;

export { 
    HOST,
    CHECK_USER_ROUTE,
    USERS_ROUTE, 
    GET_ALL_CONTACTS_ROUTE,
};