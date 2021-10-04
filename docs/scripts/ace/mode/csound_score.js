"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "./text.js";
import { CsoundScoreHighlightRules as CsoundScoreHighlightRules } from "./csound_score_highlight_rules.js";

var Mode = function() {
    this.HighlightRules = CsoundScoreHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ";";
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/csound_score";
}).call(Mode.prototype);

export { Mode as Mode };