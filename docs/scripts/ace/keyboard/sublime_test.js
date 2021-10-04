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

if (typeof process !== "undefined") {
    require("amd-loader");
    require("../test/mockdom");
}
"use strict";

import * as multi_select from "../multi_select.js";

import { EditSession as EditSession } from "./../edit_session.js";
import { Editor as Editor } from "./../editor.js";
import { Range as Range } from "./../range.js";
import { MockRenderer as MockRenderer } from "./../test/mockrenderer.js";
import * as assert from "./../test/assertions.js";
import { handler as handler } from "./sublime.js";
var editor;

function initEditor(docString) {
    var doc = new EditSession(docString.split("\n"));
    editor = new Editor(new MockRenderer(), doc);
    editor.setKeyboardHandler(handler);
}

export default {

    "test: move by subwords": function() {
        initEditor("\n   abcDefGHKLmn_op ++ xyz$\nt");
        
        [0, 3, 6, 9, 12, 15, 18, 21, 25, 26, 0, 1, 1].forEach(function(col) {
            assert.equal(editor.selection.lead.column, col);
            editor.execCommand(handler.commands.moveSubWordRight);
        });
        [1, 0, 26, 25, 22, 19, 16, 12, 9, 6, 3, 0, 0].forEach(function(col) {
            assert.equal(editor.selection.lead.column, col);
            editor.execCommand(handler.commands.moveSubWordLeft);
        });
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
