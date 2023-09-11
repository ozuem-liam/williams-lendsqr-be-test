# williams-lendsqr-be-test
Bubbles version 1 Backend
<h1 align="center">williams-lendsqr-be-test</h1>

Set the environment variables:
(You can see all enviroment key at **src/config/config**)

```bash
cp .env.example .env
```

## Feature

-   **SQL database**: [MySQL](https://www.mysql.com/) object data modeling using [Knex](https://knexjs.org/)
-   **Authentication and authorization**: using [jwt](https://jwt.io/)
-   **Logging**: using [knex](https://knexjs.org/guide/#log)
-   **Testing**: unit and integration tests using [Jest](https://jestjs.io/)
-   **Error handling**: centralized error handling mechanism
-   **Dependency management**: with [npm](https://www.npmjs.com/)
-   **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
-   **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io/)
-   **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
-   **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
-   **Linting**: with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) (fixing)
-   **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org/)

## Commands

Running locally:

```bash
npm run dev
```

building:

```bash
npm run build
```

Running production (build before use):

```bash
npm run start
```

Testing:

```bash
# run all unit tests
npm run test

# run all unit tests in watch mode
npm run test:watch

# run unit tests coverage
npm run test:coverage

# run all e2e tests
npm run test:e2e

# run all e2e tests in watch mode
npm run test:e2e:watch
```

## Enviroment Variable

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
APP_PORT=8003

# Prefix app path
APP_PREFIX_PATH=/

# JWT
# JWT Secret
JWT_SECRET=somerandomkeyherena
# JWT Expire
JWT_EXPIRE=1y


# Database config

# If you want to use seperate database URI
DB_USER=root
DB_USER_PWD=secret
DB_HOST=localhost
DB_NAME=lendsqr
DB_PORT=3306
```

## Project Structure

This project don't have **controllers** and **services** folders because we want to minimalized. If you want them, you can create it

```bash
src\
 |--config\         # Environment variables and configuration related things
 |--database\       # Knex migrations (data layer)
 |--middlewares\    # Custom express middlewares
 |--modules\        # Modules
 |--utils\          # Utility classes and functions
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Error handling

The app has a centralized error handling mechanism.

Routes should try to catch the errors and forward them to the error handling middleware (by calling `next(e)`).

```ts
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await Knex('users').where({ email });
        if (!user || !this.validPassword(password))
            throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid email or password');
        res.json(this.toAuthJSON(user));
    } catch (e) {
        next(e);
    }
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
    "code": 401,
    "message": "Invalid email or password"
}
```

When running in development mode, the error response also contains the error stack.

## Logging

Import the logger from `src/config/log.ts`. It is using the [Knex](https://knexjs.org/guide/#log) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```ts
import logger from '@/config/logger';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`
