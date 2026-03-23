import { create } from 'zustand'
import axiosinstance from '../lib/axios'

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosinstance.get('/auth/check');
            set({ authUser: res.data.user });
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosinstance.post('/auth/signup', data);
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Signup failed';
            return { success: false, message };
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosinstance.post('/auth/login', data);
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosinstance.post('/auth/logout');
            set({ authUser: null });
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosinstance.post('/auth/update-profile', data);
            set({ authUser: res.data });
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.message || 'Update failed';
            return { success: false, message };
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
}));