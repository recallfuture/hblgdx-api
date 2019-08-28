import axios from 'axios';

axios.defaults.timeout = 5000;
axios.defaults.validateStatus = status => {
  return status >= 200 && status < 400;
};
axios.defaults.maxRedirects = 0;

export default axios;
