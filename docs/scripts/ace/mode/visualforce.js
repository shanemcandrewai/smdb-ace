/* caption: Visualforce; extensions: component,page,vfp */
"use strict";

import * as oop from "../lib/oop.js";
import { Mode as HtmlMode } from "./html.js";
import { VisualforceHighlightRules as VisualforceHighlightRules } from "./visualforce_highlight_rules.js";
import { XmlBehaviour as XmlBehaviour } from "./behaviour/xml.js";
import { FoldMode as HtmlFoldMode } from "./folding/html.js";

function VisualforceMode() {
    HtmlMode.call(this);

    this.HighlightRules = VisualforceHighlightRules;
    this.foldingRules = new HtmlFoldMode();
    this.$behaviour = new XmlBehaviour();
}

oop.inherits(VisualforceMode, HtmlMode);

VisualforceMode.prototype.emmetConfig = {
    profile: "xhtml"
};

export { VisualforceMode as Mode };
