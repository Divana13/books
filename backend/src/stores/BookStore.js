import axiosClient from "@/axios";
import { defineStore } from "pinia";

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        books : [],
        errorMessages : null,
        book : null,
    }),
    actions: {
        async getBooks() {
            try {
                const response = await axiosClient.get('/books')
                console.log(response.data.data)
                this.books = response.data.data;
                
            } catch (errors) {
                this.errorMessages = errors.response?.data?.errors
                console.error(this.errorMessages);
            }
        },
        async showBook(id) {
            try {
                const response = await axiosClient.get(`/books/${id}`);
                this.book = response.data;
                console.log(this.book)
            } catch (error) {
                console.error("error fetching", error);
            }
        },
        // For show book detail cache system
        async fetchBookDetails(id){
            // Try to get from localStorage
            const cacheBook = localStorage.getItem(`book_${id}`);
            const cachePdf = localStorage.getItem(`book_pdf_${id}`);

            if (cacheBook && cachePdf) {
                // Use cache book and PDF data
                const cacheData = JSON.parse(cacheBook);
                cacheData.pdf_url = cachePdf; // Replace URL with cache PDF data

                // Parse and set the book from localStorage
                this.book = cacheData;
                return;
            }

            try {
                const response = await axiosClient.get(`/books/${id}`);
                const book = response.data;

                // Fetch the PDF as a Blob
                const pdfResponse = await axiosClient.get(book.pdf_url, {responseType: 'blob'});
                const pdfBlob = pdfResponse.data;

                // Convert the Blob to Base64
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Pdf = reader.result;

                    // Cache book details and PDF
                    localStorage.setItem(`book_${id}`, JSON.stringify(book));
                    localStorage.setItem(`book_pdf_${id}`, base64Pdf);

                    // Set the book data with Base64 PDF
                    book.pdf_url = base64Pdf;
                    this.book = book;
                };
                reader.readAsDataURL(pdfBlob);
                console.log(this.book)
            } catch (error) {
                console.error('error fetching', error)
                this.book = null;
            }
        },
        async createBook(formData) {
            try {
                const response = await axiosClient.post('/books/upload', formData);

                this.books.push(response.data.data);
            } catch (error) {
                this.errorMessages = error.response?.data?.errors
                console.error(error)
            }
        },
        async updateBook(formData, id) {
            formData.append('_method', 'PUT');
            try {
                const response = await axiosClient.post(`/books/${id}`, formData);
                const index = this.books.findIndex(book => book.id === id);

                if (index !== -1) {
                    this.books[index] = response.data.data
                }
            } catch (error) {
                this.errorMessages = error.response?.data?.errors
                console.error(error)
            }
        },
        async deleteBook(id) {
            try {
                await axiosClient.delete(`/books/${id}`);
                this.books = this.books.filter(book => book.id !== id)
            } catch (error) {
                this.errorMessages = error.response?.data?.error
            }
        }
    }
});