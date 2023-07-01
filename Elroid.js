// Class Elroid: A simple templating engine that compiles a template string with data and binds event listeners based on the provided options.
class Elroid {
  constructor(options) {
    // Cache the provided element selector, data, and template.
    this.el = options.el;
    this.data = options.data;
    this.template = document.querySelector(options.el).innerHTML;

    // Compile the initial template and bind events.
    this.compile();
    this.bindEvents();
  }

  // Compile all elements matching the element selector provided in the options.
  compile() {
    const elements = document.querySelectorAll(this.el);
    elements.forEach((element) => {
      this.compileElement(element);
    });
  }

  // Compile a single element's template string.
  compileElement(element) {
    const template = element.innerHTML;
    const compiled = this.compileTemplate(template);
    element.innerHTML = compiled;
  }

  // Compile a template string with data.
  compileTemplate(template) {
    const regex = /\{\{(.*?)\}\}/g; // Use a regex to match all instances of {{...}} in the template.
    const compiled = template.replace(regex, (match, p1) => {
      return p1.split('.').reduce((acc, key) => acc[key.trim()], this.data) || ''; // Replace each matched string with the corresponding data value.
    });
    return compiled;
  }

  // Bind event listeners to elements with the el-click attribute.
  bindEvents() {
    const elements = document.querySelectorAll('[el-click]');
    elements.forEach((element) => {
      const methodName = element.getAttribute('el-click');
      const method = this.data.methods[methodName];
      if (method && typeof method === 'function') {
        element.addEventListener('click', () => {
          method.bind(this.data)(); // Bind the method to the data object and invoke it on click.
          const route = this.data.route || '/';
          router.navigateTo(route); // Navigate to the route specified in the data object, or the root route by default.
        });
      }
    });
  }

  // Update the data object and recompile the template.
  update(data) {
    Object.assign(this.data, data);
    const compiledTemplate = this.compileTemplate(this.template);
    const el = document.querySelector(this.el);
    el.innerHTML = compiledTemplate;
    this.bindEvents();
  }
}


// Class Elroid Component: A subclass of Elroid that represents a single component with its own template and data.
class ElComponent {
  constructor(options) {
    // Cache the provided template, data, route, and element selector.
    this.template = options.template;
    this.data = options.data;
    this.route = options.route;
    this.el = document.querySelector(options.el);

    // Compile the initial template and bind events.
    this.compile();
    this.bindEvents();
  }

  // Compile the component's template string.
  compile() {
    const compiledTemplate = this.compileTemplate(this.template);
    this.el.innerHTML = compiledTemplate;
  }

  // Compile a template string with data.
  compileTemplate(template) {
    const regex = /\{\{(.*?)\}\}/g; // Use a regex to match all instances of {{...}} in the template.
    const compiled = template.replace(regex, (match, p1) => {
      return p1.split('.').reduce((acc, key) => acc[key.trim()], this.data) || ''; // Replace each matched string with the corresponding data value.
    });
    return compiled;
  }

  // Bind event listeners to elements with the el-click attribute.
  bindEvents() {
    const elements = this.el.querySelectorAll('[el-click]');
    elements.forEach((element) => {
      const methodName = element.getAttribute('el-click');
      const method = this.data.methods[methodName];
      if (method && typeof method === 'function') {
        element.addEventListener('click', () => {
          method.bind(this.data)(); // Bind the method to the data object and invoke it on click.
          const route = this.data.route || '/';
          router.navigateTo(route); // Navigate to the route specified in the data object, or the root route by default.
        });
      }
    });
  }

  // Update the data object and recompile the template.
  update(data) {
    Object.assign(this.data, data);
    const compiledTemplate = this.compileTemplate(this.template);
    this.el.innerHTML = compiledTemplate;
    this.bindEvents();
  }
}


// ElRouter: A simple client-side router for single-page applications.
class ElRouter {
  constructor(options) {
    this.routes = options.routes; // An array of route objects, where each object contains a route and a component.
    this.defaultRoute = options.defaultRoute; // The default route to navigate to if no matching route is found.
    this.errorRoute = options.errorRoute; // The error route to navigate to if a matching route is not found.
    this.el = options.el; // The DOM element to render components into.
    this.visitedRoutes = []; // An array of visited routes.

    this.init(); // Initialize the router.
  }

  // Initialize the router by setting up event listeners and handling the initial page load.
  init() {
    // Handle initial page load
    this.navigateTo(window.location.pathname);

    // Handle back/forward button clicks
    window.addEventListener('popstate', () => {
      this.goToPreviousRoute();
    });

    // Handle anchor tag clicks
    document.addEventListener('click', (event) => {
      const anchor = event.target.closest('a');
      if (anchor && anchor.getAttribute('href').startsWith('/')) {
        event.preventDefault();
        this.navigateTo(anchor.getAttribute('href'));
      }
    });
  }

  // Navigate to the specified path by finding the corresponding route and rendering the component.
  navigateTo(path) {
    const route = this.findRoute(path) || this.findRoute(this.errorRoute); // Find the route object for the specified path or the error route.
    const { component, data } = route; // Destructure the component and data properties from the route object.

    // Create a new component instance
    const elComponent = new component({ el: this.el, data });

    // Add the current route to the visited routes array
    this.visitedRoutes.push(path);

    // Update the browser history without reloading the page
    history.pushState({ path }, '', path);
  }

  // Navigate to the previous route by retrieving the previous path from the visited routes array and rendering the corresponding component.
  goToPreviousRoute() {
    if (this.visitedRoutes.length > 1) {
      // Remove the current route from the visited routes array
      this.visitedRoutes.pop();
      // Retrieve the previous route from the visited routes array
      const previousPath = this.visitedRoutes[this.visitedRoutes.length - 1];
      const previousRoute = this.findRoute(previousPath) || this.findRoute(this.errorRoute);
      const { component: previousComponent, data: previousData } = previousRoute;

      // Create a new component instance for the previous route
      const previousElComponent = new previousComponent({ el: this.el, data: previousData });

      // Update the browser history without reloading the page
      history.pushState({ path: previousPath }, '', previousPath);
    }
  }

  // Find the route object for the specified path.
  findRoute(path) {
    return this.routes.find((route) => route.route === path);
  }
}


// ElRequest: A simple XMLHttpRequest wrapper for making HTTP requests.
class ElRequest {
  constructor() {
    this.http = new XMLHttpRequest(); // Create a new instance of XMLHttpRequest.
    this.headers = {}; // Initialize an empty headers object.
  }

  // Set a header for the request.
  setHeader(key, value) {
    this.headers[key] = value;
  }

  // Make a GET request.
  get(url = '', data = {}, callback = () => { }) {
    // Convert the data object to a query string.
    const queryString = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    this.http.open('GET', `${url}?${queryString}`, true); // Open a GET request to the provided URL with the query string.

    // Set any headers provided.
    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    // Handle the response when it loads.
    this.http.onload = function () {
      if (this.http.status === 200) {
        callback(null, this.http.responseText); // Invoke the callback with no errors and the response text.
      } else {
        callback(`Error: ${this.http.status}`); // Invoke the callback with an error message.
      }
    }.bind(this);

    this.http.send(); // Send the request.
  }

  // Make a POST request.
  post(url = '', data = {}, callback = () => { }) {
    this.http.open('POST', url, true); // Open a POST request to the provided URL.

    // Set any headers provided.
    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    // Handle the response when it loads.
    this.http.onload = function () {
      callback(null, this.http.responseText); // Invoke the callback with no errors and the response text.
    }.bind(this);

    // Convert the data object to a request body string.
    const requestBody = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    this.http.send(requestBody); // Send the request with the request body.
  }

  // Make a PUT request.
  put(url = '', data = {}, callback = () => { }) {
    this.http.open('PUT', url, true); // Open a PUT request to the provided URL.

    // Set any headers provided.
    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    // Handle the response when it loads.
    this.http.onload = function () {
      callback(null, this.http.responseText); // Invoke the callback with no errors and the response text.
    }.bind(this);

    // Convert the data object to a request body string.
    const requestBody = Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    this.http.send(requestBody); // Send the request with the request body.
  }

  // Make a DELETE request.
  delete(url = '', callback = () => { }) {
    this.http.open('DELETE', url, true); // Open a DELETE request to the provided URL.

    // Set any headers provided.
    for (const [key, value] of Object.entries(this.headers)) {
      this.http.setRequestHeader(key, value);
    }

    // Handle the response when it loads.
    this.http.onload = function () {
      if (this.http.status === 200) {
        callback(null, 'Post Deleted!'); // Invoke the callback with no errors and a success message.
      } else {
        callback(`Error: ${this.http.status}`); // Invoke the callback with an error message.
      }
    }.bind(this);

    this.http.send(); // Send the request.
  }
}