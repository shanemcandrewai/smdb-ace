# Ace editor configuration
## Installation
    cd ..
    git clone https://github.com/ajaxorg/ace-builds.git 
## to do
### server HTML / js for local webserver
node
### HTML / js to load test.json in editor window
use fetch api
## alternative simplication
node.js cli app which opens the html file and static assets on local browser
$ npm install open
### Notes about [local testing](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)
Some browsers (including Chrome) will not run async requests (see Fetching data from the server) if you just run the example from a local file.
#### [solution](https://support.mozilla.org/en-US/questions/1264280) to "CORS request not http" error
change privacy_file_unique_origin to false in about:config
