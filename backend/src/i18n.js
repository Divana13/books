import { createI18n } from "vue-i18n";

const messages = {
    en: {
        navbar: {
            book: "Book",
            photo: 'Photos',
            setting: "Setting",
            shortcut : "Create Shortcut",
            preparedBy: "Prepared By",
            createdAt: 'Date',
            allBooks: 'All Books',
            linkShare: 'Share',
        }
    },
    kh: {
        navbar: {
            book: "សៀវភៅ",
            photo: "រូបភាព",
            setting: "ការកំណត់",
            shortcut: "បង្កើតតំណរភ្ជាប់",
            preparedBy: "រៀបរៀងដោយ",
            createdAt: 'ថ្ងៃខែបញ្ចូល',
            allBooks: 'សៀវភៅទាំងអស់',
            linkShare: 'ចែកបន្តរ'
        }
    }
}

const i18n = createI18n({
    legacy:false,
    locale: 'kh',
    fallbackLocale: 'en',
    messages,
});

export default i18n;