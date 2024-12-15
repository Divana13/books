<template>
    <div v-if="book">
        <PageTitle :title="book.title" />
        <PdfViewer :pdfUrl="book.pdf_url"/>
    </div>
    <div v-else>
        <p>Loading...</p>
    </div>
</template>

<script setup>
    import { useBookStore } from '@/stores/BookStore';
    import { storeToRefs } from 'pinia';
    import { onMounted } from 'vue';
    import { useRoute } from 'vue-router';

    import PdfViewer from '@/components/PdfViewer.vue';
    import PageTitle from '@/components/PageTitle.vue';

    const bookStore = useBookStore();
    const {book} = storeToRefs(bookStore);
    const route = useRoute();

    // const {id} = route.params;
    // console.log(id);
    onMounted(async () => {
        const {id} = route.params;
        await bookStore.fetchBookDetails(id);
        console.log(book.value)
    })
</script>