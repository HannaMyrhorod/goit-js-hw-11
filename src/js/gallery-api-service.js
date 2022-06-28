import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '28308864-0f1287e47f7c483b17ea4190a';
const BASE_URL = 'https://pixabay.com/api/';

axios.defaults.baseURL = BASE_URL;

export default class GalleryApiService {
    constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.PER_PAGE = 40;
    this.totalHits = null;
    this.totalPages = null;
    this.endOfHits = false;
    }

    async fetchImages() {
        try {
            const options = this.setOptions();
            const response = await axios.get(`?${options}`);
            const data = await response.data;

            this.totalHits = data.totalHits;
            this.totalPages = Math.ceil(this.totalHits / this.PER_PAGE);
            this.resetEndOfHits();
            
            if (data.total === 0) {
                throw new Error('Sorry, there are no images matching your search query. Please try again.');
            }
            const gallery = await data.hits;
            this.notificationOnFirstPage();
            this.notificationAboutEndHits();
            this.incrementPage();
            return gallery;

        } catch {
            Notify.failure(error.message);
        }
    }
        
    setOptions() {
        const options = new URLSearchParams({
            key: `${API_KEY}`,
            q: `${this.searchQuery}`,
            page: `${this.page}`,
            per_page: `${this.PER_PAGE}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        });
        return options;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
        
    resetEndOfHits() {
        this.endOfHits = false;
    }

    notificationOnFirstPage() {
        if (this.page === 1) {
            Notify.success(`Hooray! We found ${this.totalHits} images.`);
        }
    }
    notificationAboutEndHits() {
        if (this.page === this.totalPages || this.totalHits < this.PER_PAGE) {
            this.endOfHits = true;
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
};