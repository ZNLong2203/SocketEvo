import { reducerCases } from "./constants";

export const initialState = {
    userInfo: undefined,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case reducerCases.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
            };
        default:
            return state;
    }
};

