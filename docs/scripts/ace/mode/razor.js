"use strict";

import * as oop from "../lib/oop.js";
import { Mode as HtmlMode } from "./html.js";
import { RazorHighlightRules as RazorHighlightRules } from "./razor_highlight_rules.js";
import { RazorCompletions as RazorCompletions } from "./razor_completions.js";
import { HtmlCompletions as HtmlCompletions } from "./html_completions.js";

var Mode = function() {
    HtmlMode.call(this);
    this.$highlightRules = new RazorHighlightRules();
    this.$completer = new RazorCompletions();
    this.$htmlCompleter = new HtmlCompletions();
};
oop.inherits(Mode, HtmlMode);

(function() {
    this.getCompletions = function(state, session, pos, prefix) {
        var razorToken = this.$completer.getCompletions(state, session, pos, prefix);
        var htmlToken = this.$htmlCompleter.getCompletions(state, session, pos, prefix);
        return razorToken.concat(htmlToken);
    };
    
    this.createWorker = function(session) {
        return null;
    };

    this.$id = "ace/mode/razor";
    this.snippetFileId = "ace/snippets/razor";
}).call(Mode.prototype);

export { Mode as Mode };