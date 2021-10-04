/* caption: Apex; extensions: apex,cls,trigger,tgr */
"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "../mode/text.js";
import { ApexHighlightRules as ApexHighlightRules } from "./apex_highlight_rules.js";
import { FoldMode as FoldMode } from "../mode/folding/cstyle.js";
import { CstyleBehaviour as CstyleBehaviour } from "../mode/behaviour/cstyle.js";

function ApexMode() {
    TextMode.call(this);

    this.HighlightRules = ApexHighlightRules;
    this.foldingRules = new FoldMode();
    this.$behaviour = new CstyleBehaviour();
}

oop.inherits(ApexMode, TextMode);

ApexMode.prototype.lineCommentStart = "//";

ApexMode.prototype.blockComment = {
    start: "/*",
    end: "*/"
};

export { ApexMode as Mode };
