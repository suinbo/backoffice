# Global Back Office

###### lastest version (v.0.1.2)

### Environment

-   [nodejs] - v.16.14.1 (LTS)
-   [ReactJS] - v.17.0.2

### Main Plugins

-   [ReactQuery] - Data caching & Auto fetch
-   [axios] - HTTP request rest api
-   [i18next] - Translation module with json
-   [DAYJS] - JS dates and times
-   [material-ui] - Free Icons from google
-   [typescript] - Typing js syntax
-   [CKEditor] - Text Editor
-   [TanStackTable] - Headless UI library for building powerful tables & datagrids

### Development

Install the dependencies and devDependencies and start the server.

will be run at 127.0.0.1:8080

```bash
cd backoffice
npm install
npm run start:dev
```

#### serve (NODE_ENV: development)

```
npm run start:dev   // .env.local
npm run start:stg   // .env.stg
npm run start:prod  // .env.prod
```

#### Build (NODE_ENV: production)

Webpack build with production environment

```bash
npm run build:prod  // .env.prod
npm run build:qa    // .env.qa
npm run build:dev   // .env.dev
npm run build:type  // tsc build
```

#### Test

```bash
npm run test:type   // type check
```

### Dependencies

`package.json`

```json
"dependencies": {
    "@aws-sdk/client-s3": "^3.194.0",
    "@ckeditor/ckeditor5-build-classic": "^34.0.0",
    "@ckeditor/ckeditor5-react": "^5.0.1",
    "@material-ui/core": "^4.12.3",
    "@material-ui/icons": "^4.11.2",
    "@tanstack/react-table": "^8.5.15",
    "@tanstack/react-query": "^4.24.10",
    "axios": "^0.26.0",
    "dayjs": "^1.11.1",
    "dotenv-webpack": "^7.1.0",
    "history": "^5.3.0",
    "i18next": "^21.6.14",
    "query-string": "^7.1.1",
    "react": "^17.0.2",
    "react-activation": "^0.9.11",
    "react-color": "^2.19.3",
    "react-datepicker": "^4.7.0",
    "react-dom": "^17.0.2",
    "react-i18next": "^11.15.7",
    "react-router-dom": "~6.3.0",
    "react-scroll": "^1.8.8",
},
"devDependencies": {
    "@aws-sdk/types": "^3.110.0",
    "@babel/core": "^7.16.10",
    "@babel/plugin-proposal-object-rest-spread": "^7.16.7",
    "@babel/plugin-proposal-optional-chaining": "^7.16.7",
    "@babel/plugin-transform-object-assign": "^7.16.7",
    "@babel/plugin-transform-runtime": "^7.17.0",
    "@babel/preset-env": "^7.16.10",
    "@babel/preset-react": "^7.18.6",
    "@babel/preset-typescript": "^7.16.7",
    "@babel/runtime": "^7.17.8",
    "@types/node": "^18.0.0",
    "@types/react": "^17.0.38",
    "@types/react-color": "^3.0.6",
    "@types/react-datepicker": "^4.3.4",
    "@types/react-dom": "^17.0.11",
    "@types/react-router": "^5.1.18",
    "@types/react-router-dom": "^5.3.3",
    "autoprefixer": "^10.4.2",
    "babel-loader": "^8.2.3",
    "classnames": "^2.3.1",
    "clean-webpack-plugin": "^4.0.0",
    "compress-webpack-plugin": "^1.0.6",
    "copy-webpack-plugin": "^11.0.0",
    "css-loader": "^6.5.1",
    "css-minimizer-webpack-plugin": "^4.0.0",
    "file-loader": "^6.2.0",
    "html-webpack-plugin": "^5.5.0",
    "json-server": "^0.17.0",
    "mini-css-extract-plugin": "^2.6.1",
    "postcss-loader": "^6.2.1",
    "prettier": "^2.5.1",
    "sass": "^1.49.9",
    "sass-loader": "^12.4.0",
    "source-map-loader": "^3.0.1",
    "style-loader": "^3.3.1",
    "terser-webpack-plugin": "^5.3.3",
    "ts-loader": "^9.2.6",
    "typescript": "^4.5.4",
    "webpack": "^5.66.0",
    "webpack-bundle-analyzer": "^4.5.0",
    "webpack-cli": "^4.9.1",
    "webpack-dev-server": "^4.7.3",
    "webpack-merge": "^5.8.0"
},
"peerDependencies": {
    "react-router": "^6.2.2"
}
```

[//]: # "OutLinks"
[git-repo-url]: https://github.com/EMBRACE-DEV/gbo-web.gitt
[reactjs]: https://reactjs.org/
[reactquery]: https://react-query-v3.tanstack.com/
[nodejs]: https://nodejs.org/en/
[axios]: https://axios-http.com/docs/intro
[dayjs]: https://day.js.org/en/
[i18next]: https://www.i18next.com/
[material-ui]: https://mui.com/
[typescript]: https://www.typescriptlang.org/
[ckeditor]: https://ckeditor.com/
[tanstacktable]: https://tanstack.com/table/v8/docs/guide/introduction
