<template>
    <div>
        <div class="z-0" :class="isModalOpen ? 'blur': ''">
            <header class="h-16 bg-white border-b border-light-gray px-6 flex items-center justify-between">
                <div>
                    <button 
                        @click="openModal" 
                        class="bg-primary text-secondary px-4 py-2 rounded font-medium hover:bg-accent hover:border hover:border-primary"
                    >
                        New Book
                    </button>
                    <button @click="deleteBook" class="ml-6 bg-red-500 text-white px-4 py-2 rounded font-medium hover:bg-red-600 hover:border hover:border-red-700">Delete</button>
                </div>
                <router-link :to="{name:'BookView'}" target="_blank" class="ml-6 bg-gray-100 text-gray-800 px-4 py-2 rounded font-medium hover:bg-gray-200 hover:text-gray-900 hover:border hover:border-gray-300">Previews</router-link>
            </header>
        
            <PageTitle title="Book Page" />
            
            <p v-if="errorMessages" class="bg-red-500 text-white text-center py-3 mx-6 rounded">{{ errorMessages }}</p>
            <div class="relative overflow-x-auto p-6">
                <table class="sm:min-w-full max-w-2xl m-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-primary uppercase bg-white border-b dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3"><input type="checkbox"></th>
                            <th scope="col" class="px-6 py-3">Title</th>
                            <th scope="col" class="px-6 py-3">Author</th>
                            <th scope="col" class="px-6 py-3">File Name</th>
                            <th scope="col" class="px-6 py-3 w-56">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="book in books" 
                            :key="book.id" 
                            class="bg-white border-b border-primary hover:bg-accent hover:text-secondary dark:bg-gray-800 dark:border-gray-700"
                        >
                            <td class="px-6 py-4"><input type="checkbox" :checked="selectedBooks === book.id" @change="selectBook(book.id)"></td>
                            <th @dblclick="updateBook(book.id)" scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {{ book.title }}
                            </th>
                            <td class="px-6 py-4">{{ book.author }}</td>
                            <td class="px-6 py-4">{{ book.file_name }}</td>
                            <td class="px-6 py-4">{{ book.created_at }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <div 
            v-if="isModalOpen" 
            class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            @click.self="closeModal"
        >
            <div 
                class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative"
                @click.stop
            >
                <button 
                    @click="closeModal" 
                    class="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                >
                    ✕
                </button>
                <h2 class="text-2xl font-bold mb-6 text-primary">Create New Book</h2>
                
                <form @submit.prevent="createBook">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
                            Title
                        </label>
                        <input 
                            v-model="newBook.title"
                            id="title"
                            type="text" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="author">
                            Author
                        </label>
                        <input 
                            v-model="newBook.author"
                            id="author"
                            type="text" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                    </div>
                    
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="file">
                            File
                        </label>
                        <input 
                            @change="handleFileUpload"
                            id="file"
                            type="file" 
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            :required="!newBook.id"
                        >
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <button 
                            type="submit" 
                            class="bg-primary text-secondary px-4 py-2 rounded font-medium hover:bg-accent"
                        >
                            {{ newBook.id ? 'Update' : 'Create' }}
                        </button>
                        <button 
                            type="button"
                            @click="closeModal"
                            class="text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBookStore } from '@/stores/BookStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import PageTitle from '@/components/PageTitle.vue';

const bookStore = useBookStore();
const { books } = storeToRefs(bookStore);

// Modal state and methods
const isModalOpen = ref(false);
const newBook = ref({
    id: '',
    title: '',
    author: '',
    pdf: null
});

const selectedBooks = ref();
const errorMessages = ref();

const openModal = () => {
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    // Reset form
    newBook.value = {
        id: '',
        title: '',
        author: '',
        pdf: null
    };
};

const handleFileUpload = (event) => {
    newBook.value.pdf = event.target.files[0]; 
};

const createBook = async () => {
    try {
        // Create a FormData object to send file and other data
        const formData = new FormData();
        formData.append('id', newBook.value.id || '');
        formData.append('title', newBook.value.title);
        formData.append('author', newBook.value.author);
        formData.append('pdf', newBook.value.pdf);

        if (newBook.value.id) {
            // Call store method to update book
            await bookStore.updateBook(formData, newBook.value.id);
        } else {
            // Call store method to create book
            await bookStore.createBook(formData);
        }
     
        // Close modal after successful creation
        closeModal();
    } catch (error) {
        console.error('Error creating book:', error);
        // Optionally, show error message to user
    }
};

const updateBook = (id) => {
    const book = books.value.find(book => book.id === id);
    newBook.value.id = book.id;
    newBook.value.title = book.title;
    newBook.value.author = book.author;
    openModal();
}

const selectBook = (bookId) => {
    // If the clicked book is already selected, deselect it
    if (selectedBooks.value === bookId) {
        selectedBooks.value = null;
    } else {
        // Otherwise, select the new book
        selectedBooks.value = bookId;
    }
    
    // Log the selected book ID
    console.log('Selected Book ID:', selectedBooks.value);
};

const deleteBook = async () => {
    if (selectedBooks.value) {
        await bookStore.deleteBook(selectedBooks.value)

        selectedBooks.value = null;
    } else {
        errorMessages.value = 'Please select any book first';

        setTimeout(() => {
            errorMessages.value = ''
        }, 5000)
    }
}

onMounted(async () => {
    await bookStore.getBooks();
});
</script>