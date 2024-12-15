import { defineStore } from "pinia";
import axiosClient from "@/axios";

export const useAuthStore = defineStore('authStore', {
    state : () => ({
        userName : localStorage.getItem('USER_NAME') || null,
        token : localStorage.getItem('TOKEN'),
        errorMessage : null
}),
    
    actions : {
        async loginUser(userData) {
            try {
                const response = await axiosClient.post('/login', userData);
                this.userName = response.data.user
                console.log(this.userName);
                this.token = response.data.token

                localStorage.setItem('USER_NAME', this.userName);
                localStorage.setItem('TOKEN', this.token);
            } catch (error) {
                this.errorMessage = error.response?.data?.error
                this.token = null;
                this.userName = null;
                localStorage.removeItem('USER_NAME');
                localStorage.removeItem('TOKEN');
                throw error;
            }
        },
        async logout() {
            try{
                await axiosClient.post('/logout');
                this.token = null;
                this.userName = null;
                this.errorMessage = null
                localStorage.removeItem('USER_NAME');
                localStorage.removeItem('TOKEN');
            } catch (error) {
                console.error('Logout error: ', error);
            }
                
        }
    }
});