class HomeComponent extends ElComponent {
  constructor() {
    super({
      el: '#app',
      template: `
        <div>
          <h1>Welcome to the Home Page</h1>
          <p>Click the links in the navigation bar to go to other pages.</p>
        </div>
      `,
      data: {},
      route: '/',
    });
  }
}

class AboutComponent extends ElComponent {
  constructor() {
    super({
      el: '#app',
      template: `
        <div>
          <h1>About Us</h1>
          <p>We are a company that specializes in creating web applications.</p>
        </div>
      `,
      data: {},
      route: '/about',
    });
  }
}

class NotFoundComponent extends ElComponent {
  constructor() {
    super({
      el: '#app',
      template: `
        <div>
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for could not be found.</p>
        </div>
      `,
      data: {},
      route: '/404',
    });
  }
}

const router = new ElRouter({
  el: '#app',
  routes: [
    { route: '/', component: HomeComponent },
    { route: '/about', component: AboutComponent },
    { route: '/404', component: NotFoundComponent },
  ],
  defaultRoute: '/',
  errorRoute: '/404',
});