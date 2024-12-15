<template>
    <div>
        <PageTitle :title="$t('navbar.allBooks')" />
        <div 
            class="mx-4 gap-4 grid mt-9 mb-6"
            :class="{
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4': books.length >= 4,
                'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': books.length < 4,
                'justify-center': books.length < 4
            }"
        >
        <div 
            v-for="(book) in books" 
            :key="book.id" 
            class="shadow-lg p-5 rounded w-full bg-light-gray hover:shadow-accent" 
        >
                <router-link :to="{name: 'BookDetail', params: {id: book.id} }">
                    <h1 class="font-bold text-2xl text-center text-primary mb-6">
                        {{ book.title }}
                    </h1>
                    <div class="mb-3 flex items-center">
                        <label class="font-medium text-xl w-32">{{ $t('navbar.preparedBy') }}</label>
                        <h3 class="font-medium">
                            : {{ book.author }}
                        </h3>
                    </div>
                    <div class="mb-3 flex items-center">
                        <label class="font-medium text-xl w-28">{{ $t('navbar.createdAt') }}</label>
                        <p>: {{ book.created_at }}</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useBookStore } from '@/stores/BookStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import PageTitle from '@/components/PageTitle.vue';

const bookStore = useBookStore();
const {books} = storeToRefs(bookStore);

onMounted(async() => {
    await bookStore.getBooks();
    console.log(books.value);
});
</script>