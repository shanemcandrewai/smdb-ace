/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */
"use strict";

import * as oop from "../lib/oop.js";
import { Mode as TextMode } from "./text.js";
import { Mode as JavaScriptMode } from "./javascript.js";
import { Mode as XmlMode } from "./xml.js";
import { Mode as HtmlMode } from "./html.js";
import { MarkdownHighlightRules as MarkdownHighlightRules } from "./markdown_highlight_rules.js";
import { FoldMode as MarkdownFoldMode } from "./folding/markdown.js";

var Mode = function() {
    this.HighlightRules = MarkdownHighlightRules;

    this.createModeDelegates({
        javascript: require("./javascript").Mode,
        html: require("./html").Mode,
        bash: require("./sh").Mode,
        sh: require("./sh").Mode,
        xml: require("./xml").Mode,
        css: require("./css").Mode
    });

    this.foldingRules = new MarkdownFoldMode();
    this.$behaviour = this.$defaultBehaviour;
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.blockComment = {start: "<!--", end: "-->"};
    this.$quotes = {'"': '"', "`": "`"};

    this.getNextLineIndent = function(state, line, tab) {
        if (state == "listblock") {
            var match = /^(\s*)(?:([-+*])|(\d+)\.)(\s+)/.exec(line);
            if (!match)
                return "";
            var marker = match[2];
            if (!marker)
                marker = parseInt(match[3], 10) + 1 + ".";
            return match[1] + marker + match[4];
        } else {
            return this.$getIndent(line);
        }
    };
    this.$id = "ace/mode/markdown";
    this.snippetFileId = "ace/snippets/markdown";
}).call(Mode.prototype);

export { Mode as Mode };