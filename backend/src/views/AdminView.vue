<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
        <div class="bg-white sm:p-6 p-3 rounded shadow-md w-96 border-2 border-primary">
            <div class="flex justify-center mb-3">
                <img src="/imgs/logo.webp" class="w-16 h-16" alt="">
            </div>
            <h1 class="text-3xl font-bold sm:mb-3 mb-6 text-center text-primary">Login</h1>
            <form @submit.prevent="login">
                <div class="mb-3">
                    <label for="user_name" class="block text-primary text-sm font-bold mb-2">User Name</label>
                    <input type="text" class="border border-primary rounded-md p-2 w-full" v-model="authModel.user_name">
                </div>
                <div class="mb-6">
                    <label for="password" class="block text-primary text-sm font-bold mb-2">Password</label>
                    <input type="password" id="password" class="border border-primary rounded-md p-2 w-full" v-model="authModel.password">
                </div>
                <div class="flex justify-center">
                    <button type="submit" class="bg-accent hover:bg-primary text-white flex font-bold py-3 px-6 rounded">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { useAuthStore } from '@/stores/AuthStore';
    import { reactive } from 'vue';
    import { useRouter } from 'vue-router';

    const authStore = useAuthStore();
    const route = useRouter();
    const authModel = reactive({
        'user_name' : '',
        'password' : '',
    });

    const login = async () => {
        await authStore.loginUser(authModel);
        route.push({name: 'AdminBookView'})
    }
</script>