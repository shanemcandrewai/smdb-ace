"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "./text.js";
import { CsoundDocumentHighlightRules as CsoundDocumentHighlightRules } from "./csound_document_highlight_rules.js";

var Mode = function() {
    this.HighlightRules = CsoundDocumentHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/csound_document";
    this.snippetFileId = "ace/snippets/csound_document";
}).call(Mode.prototype);

export { Mode as Mode };