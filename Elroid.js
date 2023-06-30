// Class Elroid
class Elroid {
  constructor(options) {
    this.el = options.el;
    this.data = options.data;

    this.compile();
    this.bindEvents();
  }

  compile() {
    const elements = document.querySelectorAll(this.el);
    elements.forEach((element) => {
      this.compileElement(element);
    });
  }

  compileElement(element) {
    const template = element.innerHTML;
    const compiled = this.compileTemplate(template);
    element.innerHTML = compiled;
  }

  compileTemplate(template) {
    const regex = /\{\{(.*?)\}\}/g;
    const compiled = template.replace(regex, (match, p1) => {
      return p1.split('.').reduce((acc, key) => acc[key.trim()], this.data) || '';
    });
    return compiled;
  }

  bindEvents() {
    const elements = document.querySelectorAll('[el-click]');
    elements.forEach((element) => {
      const methodName = element.getAttribute('el-click');
      const method = this.data.methods[methodName];
      if (method && typeof method === 'function') {
        element.addEventListener('click', () => {
          method.bind(this.data)();
          this.compile();
          this.bindEvents();
        });
      }
    });
  }

  update(data) {
    Object.assign(this.data, data);
    const compiledTemplate = this.compileTemplate(this.template);
    this.el.innerHTML = compiledTemplate;
    this.bindEvents();
  }
}

// Elroid Component
class ElComponent {
  constructor(options) {
    this.template = options.template;
    this.data = options.data;
    this.el = document.querySelector(options.el);

    this.compile();
    this.bindEvents();
  }

  compile() {
    const compiledTemplate = this.compileTemplate(this.template);
    this.el.innerHTML = compiledTemplate;
  }

  compileTemplate(template) {
    const regex = /\{\{(.*?)\}\}/g;
    const compiled = template.replace(regex, (match, p1) => {
      return p1.split('.').reduce((acc, key) => acc[key.trim()], this.data) || '';
    });
    return compiled;
  }

  bindEvents() {
    const elements = this.el.querySelectorAll('[el-click]');
    elements.forEach((element) => {
      const methodName = element.getAttribute('el-click');
      const method = this.data.methods[methodName];
      if (method && typeof method === 'function') {
        element.addEventListener('click', () => {
          method.bind(this.data)();
        });
      }
    });
  }

  update(data) {
    Object.assign(this.data, data);
    const compiledTemplate = this.compileTemplate(this.template);
    this.el.innerHTML = compiledTemplate;
    this.bindEvents();
  }
}

// Elroid Request
class ElRequest {
  constructor() {
    this.http = new XMLHttpRequest();
    this.headers = {};
  }

  setHeader(key, value) {
    this.headers[key] = value;
  }

  get(url = '', data = {}, callback = () => { }) {
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    this.http.open('GET', `${url}?${queryString}`, true);

    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    this.http.onload = function () {
      if (this.http.status === 200) {
        callback(null, this.http.responseText);
      } else {
        callback(`Error: ${this.http.status}`);
      }
    }.bind(this);

    this.http.send();
  }

  post(url = '', data = {}, callback = () => { }) {
    this.http.open('POST', url, true);

    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    this.http.onload = function () {
      callback(null, this.http.responseText);
    }.bind(this);

    const requestBody = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    this.http.send(requestBody);
  }

  put(url = '', data = {}, callback = () => { }) {
    this.http.open('PUT', url, true);

    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    this.http.onload = function () {
      callback(null, this.http.responseText);
    }.bind(this);

    const requestBody = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    this.http.send(requestBody);
  }

  delete(url = '', callback = () => { }) {
    this.http.open('DELETE', url, true);

    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    this.http.onload = function () {
      if (this.http.status === 200) {
        callback(null, 'Post Deleted!');
      } else {
        callback(`Error: ${this.http.status}`);
      }
    }.bind(this);

    this.http.send();
  }
}