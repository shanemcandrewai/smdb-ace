if (typeof process !== "undefined") {
    require("amd-loader");
}
"use strict";

import * as mockdom from "../test/mockdom.js";
import { Mode as Mode } from "../mode/html.js";
import * as ace from "../ace.js";
import * as assert from "assert.js";
import * as emmet from "./emmet.js";

export default {
    "test doesn't break tab when emmet is not loaded": function() {
        var editor = ace.edit(null, {
            mode: new Mode(),
            enableEmmet: true,
            useSoftTabs: false
        });
        
        window.emmet = null;
        editor.onCommandKey({}, 0, 9);
        assert.equal(editor.getValue(), "\t");
        
        try {
            var called = 0;
            window.emmet = {
                actions: {
                    run: function() {
                        called++;
                    }
                },
                resources: {
                    setVariable: function() {
                        called++;
                    }
                }
            };
            editor.onCommandKey({}, 0, 9);
            assert.equal(called, 2);
        } finally {
            window.emmet = null;
        }
    }
};

});

if (typeof module !== "undefined" && module === require.main) {
    require("asyncjs").test.testcase(module.exports).exec();
}
