export const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.input = refs.form.firstElementChild;
refs.btnSearch = refs.form.lastElementChild;
