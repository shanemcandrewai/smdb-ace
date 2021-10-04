"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "./text.js";
import { HaxeHighlightRules as HaxeHighlightRules } from "./haxe_highlight_rules.js";
import { MatchingBraceOutdent as MatchingBraceOutdent } from "./matching_brace_outdent.js";
import { CstyleBehaviour as CstyleBehaviour } from "./behaviour/cstyle.js";
import { FoldMode as CStyleFoldMode } from "./folding/cstyle.js";

var Mode = function() {
    this.HighlightRules = HaxeHighlightRules;
    
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
oop.inherits(Mode, TextMode);

(function() {
    this.lineCommentStart = "//";
    this.blockComment = {start: "/*", end: "*/"};
    
    this.getNextLineIndent = function(state, line, tab) {
        var indent = this.$getIndent(line);

        var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
        var tokens = tokenizedLine.tokens;

        if (tokens.length && tokens[tokens.length-1].type == "comment") {
            return indent;
        }

        if (state == "start") {
            var match = line.match(/^.*[\{\(\[]\s*$/);
            if (match) {
                indent += tab;
            }
        }

        return indent;
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };

    this.$id = "ace/mode/haxe";
}).call(Mode.prototype);

export { Mode as Mode };