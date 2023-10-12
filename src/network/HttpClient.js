import {isBlob, isFormData, isURLSearchParams} from "./helpers";

class HtpClient {
  constructor(config) {
    this.config = config || {};
    this.middlewares = [];
  }
  create(config) {
    return new HtpClient(config);
  }

  addMiddlewares(middlewares) {
    this.middlewares.push(...middlewares);
  }

  clearMiddlewares() {
    this.middlewares = [];
  }

  setConfig(config) {
    this.config = config;
  }

  fetch(url, options) {
    return this._request(url, options);
  }

  get(url, options) {
    return this._request(url, options, 'GET');
  }

  post(url, data, options) {
    return this._request(url, options, 'POST', data);
  }

  patch(url, data, options) {
    return this._request(url, options, 'PATCH', data);
  }

  put(url, data, options) {
    return this._request(url, options, 'PUT', data);
  }

  delete(url, options) {
    return this._request(url, options, 'DELETE');
  }

  head(url, options) {
    return this._request(url, options, 'HEAD');
  }

  _createRequest(url, options, method, data) {
    options = Object.assign({}, this.config, options || {});

    let defaultMethod = !data && !options.body ? 'GET' : 'POST';

    options.method = method || options.method || defaultMethod;
    if (!!data) {
      if (typeof data === 'string' || isFormData(data) ||
          isURLSearchParams(data) || isBlob(data)) {
        options.body = data;
      } else {
        try {
          options.body = JSON.stringify(data);
        } catch (e) {
          options.body = data;
        }
      }
    }

    return new Request(url, options);
  }

  _request(urlOrRequest, ...options) {
    let request;
    if (urlOrRequest instanceof Request) {
      request = urlOrRequest;
    } else {
      request = this._createRequest(urlOrRequest, ...options);
    }

    let promise = Promise.resolve(request);
    let chain = [fetch, undefined];

    for (let middleware of this.middlewares.reverse()) {
      chain.unshift(middleware.request, middleware.requestError);
      chain.push(middleware.response, middleware.responseError);
    }

    while (!!chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }
}


export default new HtpClient();
export { HtpClient };