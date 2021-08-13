# ICARUS

## Requirements

The icarus-backend is needed, in order to run this component locally.

## Project setup

Run:
```
npm install
```
 to install the required npm packages. Avoid using `yarn`, as project was set-up using `npm`, and no `yarn.lock` file exists.  Project was tested using the latest node v10.15.0 and npm v6.4.1.

### Compiles and hot-reloads for development

For local development, run:
```
npm run serve
```
and access the app at http://127.0.0.1:8080/.

### Compiles and minifies for production
To prepare a production set of assets, run:
```
npm run build
```
Built assets will be in `dist/` folder (can be changed/defined in `vue.config.js`).

### Lints and fixes files
Project was initialized with ESLint support, using the `vue/essential` and the `airbnb` rules minus some exceptions (found in `.eslintrc.js` file) to avoid annoying errors.  Running:
```
npm run lint
```
will print a list of the lint errors, and try to fix them (if possible).

### Customize configuration
Finally, to customize the configuration, see [Configuration Reference](https://cli.vuejs.org/config/).
