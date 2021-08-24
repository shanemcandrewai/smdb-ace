# smdb-ace

## Design

An editor that saves / loads an encrypted JSON file from the server which has no access to the decrytion key

### Components

#### Server side framework

Express / Node

#### Authentication

[express-session / connect-redis](https://github.com/expressjs/session#compatible-session-stores)

#### Embedded JSON editor

[Ace](https://ace.c9.io)

#### Front end symmetric encryption

[crypto-js](https://github.com/brix/crypto-js)

## Installation

### Ace builds

    cd ..
    git clone https://github.com/ajaxorg/ace-builds.git

### [Install the Node dependencies in the local node_modules folder](https://docs.npmjs.com/cli/v6/commands/npm-install)

    npm install

### Development tools

#### [Express](https://expressjs.com/en/starter/installing.html)

##### [Create a package.json file](https://docs.npmjs.com/cli/v6/commands/npm-init)

    npm init -y

##### [Install the package](https://docs.npmjs.com/cli/v6/commands/npm-install)

    npm install express

##### [Local test](https://nodejs.org/en/docs/guides/getting-started-guide/)

    node app.js

[Local URL](http://localhost:3000)

#### [ESLint](https://eslint.org/docs/user-guide/getting-started)

    npm install eslint --save-dev

##### Set up a configuration file

    npx eslint --init

##### run ESLint on any file or directory

    npx eslint app.js

#### [Prettier](https://prettier.io/docs/en/install.html)

    npm install --save-dev --save-exact prettier

##### create an empty config file

    echo {}> .prettierrc.json

##### format all files

    npx prettier --write .

##### Local markdown file viewer

###### Firefox

[Markdown Viewer Webext](https://addons.mozilla.org/en-US/firefox/addon/markdown-viewer-webext)

##### Notes about [local testing](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)

Some browsers (including Chrome) will not run async requests (see Fetching data from the server) if you just run the example from a local file.

###### [solution](https://support.mozilla.org/en-US/questions/1264280) to "CORS request not http" error

change privacy_file_unique_origin to false in about:config
