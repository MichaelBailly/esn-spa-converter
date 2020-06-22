# OpenPaaS ESN standalone SPA converter

This project goal is to provide a tool for the development team, to convert current OpenPaaS frontend, glued in the backend server, to a set of standalone frontend-only SPA.

This is a two-steps process:

* Have a workig SPA through a good configuration of `constants.js` and `webpack.config.js`
* Remove the tooling that created the SPA and commit

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

Start webpack-dev-server in watch mode.

## Once everything works

Once the system is fully working:
Delete all files but `assets/`, `src/` and `webpack.config.js`. Remove `linagora-rse` from the dependencies listed in `package.json`. Commit. The standalone SPA is ready.

## Layout

```
index.js
constants.js
css-utils.js
file-utils.js
webpack.config.js
assets/
  index.pug
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

### index.js, builder.js, file-utils.js, css-utils.js

Used to build the initial SPA `src/` tree.

### webpack.config.js

The webpack configuration file.

### assets

Right now, contains the file used as index.html.

### repacements

Those files are copied in the `src/` folder at the end of the `node index.js` run. They contain fixes in files that really are not compatible with webpack.

## Other usefull commands

```
npm run build:dev
```
build the artefacts in `dist/` folder, with development environment (no minification).

## TODO

* how to login in real life ?

Right now the login is uusing the login page on the ESN server. What is the correct alternative ?

* developer experience (CSS/JS map files, hot reload)
* production builds (static assets, minification)
* pug templates
* i18n
