## Fastify starter

A starter project using [Fastify](https://fastify.dev/).

### Structure

- **data** - a place to put data sources like SQLite databases.
- **generators** - scripts used to generate project files.
- **generators/templates** - templates used in generators.
- **public** - static files served directly to the client.
- **public/css** - CSS stylesheets.
- **public/images** - Images.
- **public/js** - JavaScript files.
- **src** - server-side application files.
- **src/controllers** - request handlers grouped by a resource.
- **src/hooks** - Fastify route level
  [hooks](https://fastify.dev/docs/latest/Reference/Hooks/#route-level-hooks).
- **src/migrations** - Knex.js database
  [migrations](https://knexjs.org/guide/migrations.html).
- **src/models** - classes used to interact with the database.
- **src/plugins** - Fastify
  [plugins](https://fastify.dev/docs/latest/Guides/Plugins-Guide/).
- **src/views** - Liquid templates grouped by a resource.
- **src/views/layouts** - Liquid layouts.
- **index.js** - the main application file.
- **knexfile.js** - Knex.js configuration file used for migrations.

### Controllers

Controllers are defined as classes. All controllers inherit from BaseController
defined in **src/controllers/base_controller.js**. BaseController specifies the
hooks that will be assigned to each route. Hooks defined in `hooks` field will
be assigned to all routes. Hooks for individula routes can be specified using
route-specific fields, e.g., `indexHooks`.

The default routes are inspired by Ruby on Rails and they are functions named
`index`, `new`, `create`, `view`, `edit`, `update` and `delete`. `create` route
is being called on a `POST` request. `update` route is being called on both
`POST` and `PUT` requests. `delete` route is being called on `GET`, `POST` and
`DELETE` requests.

You can add custom routes using a special attribute `customRoutes`. It is an
array of arrays with 3 or 4 elements: the HTTP method as a string, the route as
a string, the handler as a function and optionally a hooks object.

```js
const BaseController = require('./base_controller')
const { authenticate } = require('../hooks/authenticator')

function logSomething(request, response) {
	console.log('something')
}

class Home extends BaseController {
	hooks = {
		preHandler: authenticate
	}

	indexHooks = {
		preHandler: logSomething
	}

	customRoutes = [
		['GET', '/do-something', this.doSomething, {
			preHandler: logSomething
		}]
	]

  index(request, response) {
    return response.render('home/index')
  }

  doSomething(request, response) {
  	// ...

  	return response.render('home/do_something')
  }
}

module.exports = Home
```

### Views

The views are using Liquid template engine through a custom plugin defined in
**src/plugins/renderer.js**. Fastify has a great plugin
[@fastify/view](https://github.com/fastify/point-of-view) that you can use
instead, but it doesn't support Liquid layouts.

### Special files

#### src/plugins/router.js

The router automatically loads all controllers and registers the route handlers.

#### src/database.js

Creates a connection to the database.

### Database

This starter comes with SQLite database support by default using better-sqlite3
and Knex.js specifically for migrations. Interation with the database is done
using better-sqlite3 directly. The connection is created in **src/database.js**
file and can be used anywhere in the project.

#### Migration commands

```bash
npx knex migrate:make migration_name

npx knex migrate:latest

npx knex migrate:rollback
```
