import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

export default class ImageMarkup {
    constructor({ selector }) {
        this.items = null;
        this.selector = selector;
        this.lightbox = null;
    }

    renderGalleryMarkup() {
        const gallery = this.items
            .reduce((acc, { largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => acc +
            `<a href="${largeImageURL}">
            <div class="photo-card">
            
            <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b>Likes</b>: ${likes}
                </p>
                <p class="info-item">
                <b>Views</b>: ${views}
                </p>
                <p class="info-item">
                <b>Comments</b>: ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>: ${downloads}
                </p>
            </div>
            </div></a>`, "");
        this.insertGalleryMarkup(gallery);
        this.initLightbox('.gallery a');
    }

    initLightbox(selector) {
        this.lightbox = new SimpleLightbox(selector, { captionsData: 'alt', captionDelay: 500, });
    }

    insertGalleryMarkup(markup) {
        this.selector.insertAdjacentHTML('beforeend', markup);
    };

    resetMarkup() {
        this.selector.innerHTML = '';
    }
};




