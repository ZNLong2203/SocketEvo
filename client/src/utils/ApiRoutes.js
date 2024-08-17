// const HOST = "http://localhost:3005";
const HOST = "https://be-socketevo.up.railway.app";

const CHECK_USER_ROUTE = `${HOST}/api/auth/login`;
const USERS_ROUTE = `${HOST}/api/users`;
const GET_ALL_CONTACTS_ROUTE = `${HOST}/api/users`;
const SEND_MESSAGE_ROUTE = `${HOST}/api/messages`;
const GET_MESSAGES_ROUTE = `${HOST}/api/messages`;
const ADD_IMAGE_MESSAGE_ROUTE = `${HOST}/api/messages/image`;
const ADD_AUDIO_MESSAGE_ROUTE = `${HOST}/api/messages/audio`;
const GET_INITIAL_CONTACTS_ROUTE = `${HOST}/api/messages/contacts`;

export { 
    HOST,
    CHECK_USER_ROUTE,
    USERS_ROUTE, 
    GET_ALL_CONTACTS_ROUTE,
    SEND_MESSAGE_ROUTE,
    GET_MESSAGES_ROUTE,
    ADD_IMAGE_MESSAGE_ROUTE,
    ADD_AUDIO_MESSAGE_ROUTE,
    GET_INITIAL_CONTACTS_ROUTE,
};