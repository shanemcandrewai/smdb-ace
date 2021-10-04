/* global define */
  "use strict";

import * as oop from "../lib/oop.js";
import { Mode as HtmlMode } from "./html.js";
import { HandlebarsHighlightRules as HandlebarsHighlightRules } from "./handlebars_highlight_rules.js";
import { HtmlBehaviour as HtmlBehaviour } from "./behaviour/html.js";
import { FoldMode as HtmlFoldMode } from "./folding/html.js";

var Mode = function() {
    HtmlMode.call(this);
    this.HighlightRules = HandlebarsHighlightRules;
    this.$behaviour = new HtmlBehaviour();
};

oop.inherits(Mode, HtmlMode);

(function() {
    this.blockComment = {start: "{{!--", end: "--}}"};
    this.$id = "ace/mode/handlebars";
}).call(Mode.prototype);

export { Mode as Mode };