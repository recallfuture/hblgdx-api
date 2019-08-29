import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import * as tough from 'tough-cookie';

axiosCookieJarSupport(axios);

export const cookieJar = new tough.CookieJar();

axios.defaults.timeout = 5000;
axios.defaults.validateStatus = status => {
  return status >= 200 && status < 400;
};
axios.defaults.maxRedirects = 0;
axios.defaults.withCredentials = true;
axios.defaults.jar = cookieJar;

export default axios;
