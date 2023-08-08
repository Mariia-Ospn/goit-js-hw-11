import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { refs } from './js/refs';
import { getPicturesService } from './js/api';

const perPage = 40;
let currentPage = 1;
let quantityPage = null;
let querry = '';
let lightbox = createLightbox();

refs.btnLoadMore.classList.add('is-hidden');
refs.btnSearch.disabled = true;

refs.input.addEventListener('input', onInput);

function onInput() {
  refs.btnSearch.disabled = false;
  refs.form.addEventListener('submit', onSubmit);
}

async function onSubmit(evt) {
  onInput();
  evt.preventDefault();
  refs.gallery.innerHTML = '';

  querry = refs.input.value.trim();
  currentPage = 1;

  if (evt.type === 'submit') {
    refs.btnLoadMore.classList.add('is-hidden');
    try {
      const getPictures = await getPicturesService(querry);
      const { hits, totalHits } = getPictures;

      if (!hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      Notify.info(`Hooray! We found ${totalHits} images.`);
      refs.gallery.insertAdjacentHTML(
        'beforeend',
        createPhotoCardsMarkup(hits)
      );

      lightbox.refresh();

      quantityPage = Math.ceil(totalHits / perPage);

      if (currentPage < quantityPage) {
        refs.btnLoadMore.classList.remove('is-hidden');
        refs.btnLoadMore.addEventListener('click', handlerLoadMore);
      }
    } catch (error) {
      Notify.failure(error.message);
      console.log(error);
    }
  }
}

function createPhotoCardsMarkup(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      
        <div class="photo-card">
        <a href ="${largeImageURL}">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>`;
      }
    )
    .join(' ');
}

async function handlerLoadMore() {
  currentPage += 1;
  //   console.log(currentPage);
  try {
    const { hits } = await getPicturesService(querry, currentPage);

    refs.gallery.insertAdjacentHTML('beforeend', createPhotoCardsMarkup(hits));

    lightbox.refresh();
    scrollGallery();

    if (currentPage === quantityPage) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      refs.btnLoadMore.classList.add('is-hidden');
    }
  } catch (error) {
    Notify.failure(error.message);
  }
}

function createLightbox() {
  return new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function scrollGallery() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
