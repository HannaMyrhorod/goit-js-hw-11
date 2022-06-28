import { Notify } from 'notiflix/build/notiflix-notify-aio';

import GalleryApiService from './js/gallery-api-service';
import ImageMarkup from './js/gallery-card-markup'
import LoadMoreBtn from './js/load-more-btn';

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
};
const galleryApiService = new GalleryApiService();
const imageMarkup = new ImageMarkup({ selector: refs.gallery });
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', });

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
    event.preventDefault();
    loadMoreBtn.hide();
    imageMarkup.resetMarkup();
    galleryApiService.query = event.currentTarget.searchQuery.value.trim();

    if (galleryApiService.query === '') {
        loadMoreBtn.hide();
        Notify.info('Your search query is empty. Please try again.');
        return
    }

    galleryApiService.resetPage();

    try {
        await createGalleryMarkup();
        loadMoreBtn.show();
    } catch (error) {
        Notify.failure(error.message);
    }
    
    refs.form.reset();
};

async function onLoadMore() {
    try {
        await createGalleryMarkup();
    } catch (error) {
        Notify.failure(error.message);
    }

    smoothScroll();
    imageMarkup.lightbox.refresh();
};

async function createGalleryMarkup() {
    try {
        loadMoreBtn.disable();
        const gallery = await galleryApiService.fetchImages();
        imageMarkup.items = gallery;
        imageMarkup.renderGalleryMarkup();

    } catch {
        loadMoreBtn.hide();
        Notify.failure(error.message);
    }

    if (galleryApiService.endOfHits) {
        loadMoreBtn.hide();
        return;
    }
    loadMoreBtn.enable();
    
};

///////////SMOOTH SCROLLING////////////

function smoothScroll() {
    const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
     
    window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


