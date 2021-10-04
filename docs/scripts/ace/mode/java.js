"use strict";

import * as oop from "../lib/oop.js";
import { Mode as JavaScriptMode } from "./javascript.js";
import { JavaHighlightRules as JavaHighlightRules } from "./java_highlight_rules.js";
import { FoldMode as JavaFoldMode } from "./folding/java.js";

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = JavaHighlightRules;
    this.foldingRules = new JavaFoldMode();
};
oop.inherits(Mode, JavaScriptMode);

(function() {
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/java";
    this.snippetFileId = "ace/snippets/java";
}).call(Mode.prototype);

export { Mode as Mode };