"use strict";

import * as oop from "../lib/oop.js";
import { Mode as JavaScriptMode } from "./javascript.js";
import { GobstonesHighlightRules as GobstonesHighlightRules } from "./gobstones_highlight_rules.js";

var Mode = function() {
    JavaScriptMode.call(this);
    this.HighlightRules = GobstonesHighlightRules;
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, JavaScriptMode);

(function() {

    this.createWorker = function() {
        return null;
    };

    this.$id = "ace/mode/gobstones";
    this.snippetFileId = "ace/snippets/gobstones";
}).call(Mode.prototype);

export { Mode as Mode };