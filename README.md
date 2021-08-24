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
#### Express
##### Create a package.json file
    [npm init -y](https://docs.npmjs.com/cli/v6/commands/npm-init)
#### Install the package
    [npm install express](https://docs.npmjs.com/cli/v6/commands/npm-install)
#### Code formatter
### Development tools
#### Local markdown file viewer
##### Firefox
[Markdown Viewer Webext](https://addons.mozilla.org/en-US/firefox/addon/markdown-viewer-webext)

[Prettier](https://prettier.io/)
### Notes about [local testing](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)
Some browsers (including Chrome) will not run async requests (see Fetching data from the server) if you just run the example from a local file.
#### [solution](https://support.mozilla.org/en-US/questions/1264280) to "CORS request not http" error
change privacy_file_unique_origin to false in about:config
