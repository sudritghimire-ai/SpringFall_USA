import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage
const loadUserFromLocalStorage = () => {
    try {
        const serializedState = localStorage.getItem('user');
        if (serializedState === null) {
            return { user: null };
        }
        return { user: JSON.parse(serializedState) };
    } catch (error) {
        return { user: null };
    }
}

// Initial state based on localStorage
const initialState = loadUserFromLocalStorage();

// Create auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            localStorage.setItem('user', JSON.stringify(state.user)); // Store user in localStorage
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user'); // Remove user from localStorage
        }
    }
})

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
