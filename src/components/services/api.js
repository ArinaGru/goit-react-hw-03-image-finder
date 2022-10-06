import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '29459514-4ff3b1a06a484609b866e5052';

export const addImages = async (value, page, hitsPerPage) => {
  const response = await axios.get(
    `?q=${value}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=${hitsPerPage}`
  );
  return response.data;
};