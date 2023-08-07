import axios from 'axios';

const BAZE_URL = 'http://pixabay.com/api';

const params = {
  key: '38698808-7e56244eefe65efc2e8c94340',
  orientation: 'horizontal',
  image_type: 'photo',
  safesearch: 'true',
  per_page: 40,
};

async function getPicturesService(value, page) {
  params.q = value;
  params.page = page;
  const { data } = await axios.get(BAZE_URL, { params });
  return data;
}

export { getPicturesService };
