<template>
    <div class="md:flex block">
        <div class="md:flex hidden min-h-screen">
            <!-- Sidebar -->
            <aside class="md:64 w-48 bg-primary text-secondary flex flex-col">
                <div class="h-16 px-4 flex justify-center items-center font-bold text-lg border-b border-light-gray">
                Admin Dashboard
                </div>
                <nav class="flex-1">
                <ul v-for="item in nav" :key="item.key">
                    <li class="m-6 ">
                    <router-link
                        :to="item.route"
                        class="block p-3 font-bold rounded"
                        :class="route.name == item.route.name ? 'bg-secondary text-primary' : 'hover:bg-accent'"
                    >
                        {{ item.label }}
                    </router-link>
                    </li>
                </ul>
                </nav>
                <div class="p-4 border-t border-gray-700">
                <a
                    @click.prevent="logout"
                    class="block text-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
                >
                    Logout
                </a>
                </div>
            </aside>
        </div>
        <nav class="md:hidden block bg-primary flex">
            <ul v-for="item in nav" :key="item.key">
                <li>
                    <router-link
                    :to="item.route"
                    class="block text-secondary font-medium px-4 py-3 hover:bg-gray-700"
                    >
                    {{ item.label }}
                    </router-link>
                </li>
            </ul>
        </nav>
        <!-- Main Content -->
        <main class="flex-1 bg-gray-100">
            <section>
                <router-view />
            </section>
        </main>
    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const nav = [
    {label: 'Books', route: {name: "AdminBookView"}},
    {label: 'Image', route: ''},
]

const logout = async () => {
    await authStore.logout();
    router.push({name: 'BookView'})
}
</script>
  