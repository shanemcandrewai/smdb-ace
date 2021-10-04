"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "./text.js";
import { MediaWikiHighlightRules as MediaWikiHighlightRules } from "./mediawiki_highlight_rules.js";

var Mode = function() {
    this.HighlightRules = MediaWikiHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.blockComment = {start: "<!--", end: "-->"};
    this.$id = "ace/mode/mediawiki";
}).call(Mode.prototype);

export { Mode as Mode };