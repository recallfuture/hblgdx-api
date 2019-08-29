import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import * as tough from 'tough-cookie';

axiosCookieJarSupport(axios);

export const cookieJar = new tough.CookieJar();

axios.defaults.headers = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
  'Accept':
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip',
  'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4',
  'Content-Type': 'application/x-www-form-urlencoded'
};
axios.defaults.responseType = 'document';
axios.defaults.timeout = 5000;
axios.defaults.validateStatus = status => {
  return status >= 200 && status < 400;
};
axios.defaults.maxRedirects = 0;
axios.defaults.withCredentials = true;
axios.defaults.jar = cookieJar;

export default axios;
