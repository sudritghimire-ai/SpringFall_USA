import { createSlice } from "@reduxjs/toolkit";

// Load user and loginTime from localStorage
const loadUserFromLocalStorage = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const loginTime = JSON.parse(localStorage.getItem('loginTime'));
        return {
            user: user || null,
            loginTime: loginTime || null
        };
    } catch (error) {
        return { user: null, loginTime: null };
    }
};

// Initial state based on localStorage
const initialState = loadUserFromLocalStorage();

// Create auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.loginTime = new Date().getTime();
            localStorage.setItem('user', JSON.stringify(state.user));
            localStorage.setItem('loginTime', JSON.stringify(state.loginTime));
        },
        logout: (state) => {
            state.user = null;
            state.loginTime = null;
            localStorage.removeItem('user');
            localStorage.removeItem('loginTime');
        }
    }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
