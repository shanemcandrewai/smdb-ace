"use strict";

import * as oop from "../lib/oop.js";
import { Mode as JavaScriptMode } from "./javascript.js";
import { WollokHighlightRules as WollokHighlightRules } from "./wollok_highlight_rules.js";

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = WollokHighlightRules;
};
oop.inherits(Mode, JavaScriptMode);

(function() {
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/wollok";
    this.snippetFileId = "ace/snippets/wollok";
}).call(Mode.prototype);

export { Mode as Mode };