# smdb-ace

## Design

An editor that saves / loads an encrypted JSON file from the server which has no access to the decryption key

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

##### [Ace editor](https://ace.c9.io)

npm install [brace](https://github.com/thlorenz/brace) [browserify](https://github.com/browserify/browserify)

###### [build bundle.js from main.js](https://github.com/browserify/browserify#example)

npx browserify public\main.js > public\bundle.js

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

##### create a .prettierignore file to let the Prettier CLI and editors know which files to not format

    echo public/bundle.js > .prettierignore

##### format all files

    npx prettier --write .

##### [Publish on GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

Copy to public directory to docs

###### Navagate to https://shanemcandrewai.github.io/smdb-ace/

#### Local markdown file viewer

##### Firefox

[Markdown Viewer Webext](https://addons.mozilla.org/en-US/firefox/addon/markdown-viewer-webext)

#### Notes about [local testing](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)

Some browsers (including Chrome) will not run async requests (see Fetching data from the server) if you just run the example from a local file.

##### [solution](https://support.mozilla.org/en-US/questions/1264280) to "CORS request not http" error

change privacy_file_unique_origin to false in about:config

#### git warning : [warning: LF will be replaced by CRLF in package-lock.json](https://git-scm.com/docs/git-config#Documentation/git-config.txt-coreautocrlf)

    git config --global core.autocrlf false

#### git switch to tagged version (equivalent to https://github.com/ajaxorg/ace/tree/v1.4.12)

    git checkout v1.4.12
