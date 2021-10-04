"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "./text.js";
import { CsoundOrchestraHighlightRules as CsoundOrchestraHighlightRules } from "./csound_orchestra_highlight_rules.js";

var Mode = function() {
    this.HighlightRules = CsoundOrchestraHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {

    this.lineCommentStart = ";";
    this.blockComment = {start: "/*", end: "*/"};

    this.$id = "ace/mode/csound_orchestra";
    this.snippetFileId = "ace/snippets/csound_orchestra";
}).call(Mode.prototype);

export { Mode as Mode };