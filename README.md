# OpenPaaS ESN standalone SPA converter

This project goal is to provide a tool for the development team, to convert current OpenPaaS frontend, glued in the backend server, to a set of standalone frontend-only SPA.

## Usage

```
npm install
node index.js
npm run serve
```

Then, use one browser tab to login to your OpenPaaS system (https://localhost:8080/), then go to the application page on https://localhost:9900/.

## How it works

### npm install

Install the dependencies, containing among others:

* the linagora-rse package and all its dependencies
* the "bower" dependencies that are available also on NPM
* webpack

### node index.js

This script creates the target layout for development, in the `src/` folder.

### npm run serve

Start webpack-dev-server in watch mode. The assets are created in the `dist/` folder. webpack-dev-server points to this URL.

Once the system is fully working:
Delete `dist/` folder, run node index.js a last time, remove all files but `assets/`, `src/`, `dist/` and `webpack.config.js`. Remove `linagora-rse` from the dependencies listed in `package.json`. Commit. The standalone SPA is done.

## Layout

```
index.js
constants.js
css-utils.js
file-utils.js
webpack.config.js
assets/
  index.html
replacements/
  src/
    frontend/
      [...files]
```

### constants.js

This file contains all the configuration to build the ESN standalone SPA:

* the list of bower packages that have NPM counterparts
* the list of bower packages that don't have NPM counterparts
* the core awesome modules (located originaly at ESN_ROOT/modules)
* the dependent awesome modules (located originally at ESN_ROOT/node_modules)

### index.js, file-utils.js, css-utils.js

Used to build the initial SPA `src/` tree.

### webpack.config.js

The webpack configuration file.

### assets

The files that should be copied as is in the `dist` folder.

### repacements

Those files are copied in the `src/` folder at the end of the `node index.js` run. They contain fixes in files that really are not compatible with webpack.

## TODO

* how to login in real life ?

Right now the login is uusing the login page on the ESN server. What is the correct alternative ?

* developer experience (CSS/JS map files, hot reload)
* production builds (static assets, minification)
* pug templates
* i18n
