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

// define(function(require, exports, module) {
"use strict";

// var keys = require("./keys");
import * as keys from './keys.js'
// var useragent = require("./useragent");
import * as useragent from './useragent.js'

var pressedKeys = null;
var ts = 0;

var activeListenerOptions;
function detectListenerOptionsSupport() {
    activeListenerOptions = false;
    try {
        document.createComment("").addEventListener("test", function() {}, { 
            get passive() { 
                activeListenerOptions = {passive: false};
            }
        });
    } catch(e) {}
}

function getListenerOptions() {
    if (activeListenerOptions == undefined)
        detectListenerOptionsSupport();
    return activeListenerOptions;
}

function EventListener(elem, type, callback) {
    this.elem = elem;
    this.type = type;
    this.callback = callback;
}
EventListener.prototype.destroy = function() {
    removeListener(this.elem, this.type, this.callback);
    this.elem = this.type = this.callback = undefined;
};

export let addListener = function(elem, type, callback, destroyer) {
    elem.addEventListener(type, callback, getListenerOptions());
    if (destroyer)
        destroyer.$toDestroy.push(new EventListener(elem, type, callback));
};

export let removeListener = function(elem, type, callback) {
    elem.removeEventListener(type, callback, getListenerOptions());
};

/*
* Prevents propagation and clobbers the default action of the passed event
*/
export let stopEvent = function(e) {
    stopPropagation(e);
    preventDefault(e);
    return false;
};

export let stopPropagation = function(e) {
    if (e.stopPropagation)
        e.stopPropagation();
};

export let preventDefault = function(e) {
    if (e.preventDefault)
        e.preventDefault();
};

/*
 * @return {Number} 0 for left button, 1 for middle button, 2 for right button
 */
export let getButton = function(e) {
    if (e.type == "dblclick")
        return 0;
    if (e.type == "contextmenu" || (useragent.isMac && (e.ctrlKey && !e.altKey && !e.shiftKey)))
        return 2;

    // DOM Event
    return e.button;
};

export let capture = function(el, eventHandler, releaseCaptureHandler) {
    var ownerDocument = el && el.ownerDocument || document;
    function onMouseUp(e) {
        eventHandler && eventHandler(e);
        releaseCaptureHandler && releaseCaptureHandler(e);

        removeListener(ownerDocument, "mousemove", eventHandler);
        removeListener(ownerDocument, "mouseup", onMouseUp);
        removeListener(ownerDocument, "dragstart", onMouseUp);
    }

    addListener(ownerDocument, "mousemove", eventHandler);
    addListener(ownerDocument, "mouseup", onMouseUp);
    addListener(ownerDocument, "dragstart", onMouseUp);
    
    return onMouseUp;
};

export let addMouseWheelListener = function(el, callback, destroyer) {
    if ("onmousewheel" in el) {
        addListener(el, "mousewheel", function(e) {
            var factor = 8;
            if (e.wheelDeltaX !== undefined) {
                e.wheelX = -e.wheelDeltaX / factor;
                e.wheelY = -e.wheelDeltaY / factor;
            } else {
                e.wheelX = 0;
                e.wheelY = -e.wheelDelta / factor;
            }
            callback(e);
        }, destroyer);
    } else if ("onwheel" in el) {
        addListener(el, "wheel",  function(e) {
            var factor = 0.35;
            switch (e.deltaMode) {
                case e.DOM_DELTA_PIXEL:
                    e.wheelX = e.deltaX * factor || 0;
                    e.wheelY = e.deltaY * factor || 0;
                    break;
                case e.DOM_DELTA_LINE:
                case e.DOM_DELTA_PAGE:
                    e.wheelX = (e.deltaX || 0) * 5;
                    e.wheelY = (e.deltaY || 0) * 5;
                    break;
            }
            
            callback(e);
        }, destroyer);
    } else {
        addListener(el, "DOMMouseScroll", function(e) {
            if (e.axis && e.axis == e.HORIZONTAL_AXIS) {
                e.wheelX = (e.detail || 0) * 5;
                e.wheelY = 0;
            } else {
                e.wheelX = 0;
                e.wheelY = (e.detail || 0) * 5;
            }
            callback(e);
        }, destroyer);
    }
};

export let addMultiMouseDownListener = function(elements, timeouts, eventHandler, callbackName, destroyer) {
    var clicks = 0;
    var startX, startY, timer; 
    var eventNames = {
        2: "dblclick",
        3: "tripleclick",
        4: "quadclick"
    };

    function onMousedown(e) {
        if (getButton(e) !== 0) {
            clicks = 0;
        } else if (e.detail > 1) {
            clicks++;
            if (clicks > 4)
                clicks = 1;
        } else {
            clicks = 1;
        }
        if (useragent.isIE) {
            var isNewClick = Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5;
            if (!timer || isNewClick)
                clicks = 1;
            if (timer)
                clearTimeout(timer);
            timer = setTimeout(function() {timer = null;}, timeouts[clicks - 1] || 600);

            if (clicks == 1) {
                startX = e.clientX;
                startY = e.clientY;
            }
        }
        
        e._clicks = clicks;

        eventHandler[callbackName]("mousedown", e);

        if (clicks > 4)
            clicks = 0;
        else if (clicks > 1)
            return eventHandler[callbackName](eventNames[clicks], e);
    }
    if (!Array.isArray(elements))
        elements = [elements];
    elements.forEach(function(el) {
        addListener(el, "mousedown", onMousedown, destroyer);
    });
};

var getModifierHash = function(e) {
    return 0 | (e.ctrlKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.shiftKey ? 4 : 0) | (e.metaKey ? 8 : 0);
};

export let getModifierString = function(e) {
    return keys.KEY_MODS[getModifierHash(e)];
};

function normalizeCommandKeys(callback, e, keyCode) {
    var hashId = getModifierHash(e);

    if (!useragent.isMac && pressedKeys) {
        if (e.getModifierState && (e.getModifierState("OS") || e.getModifierState("Win")))
            hashId |= 8;
        if (pressedKeys.altGr) {
            if ((3 & hashId) != 3)
                pressedKeys.altGr = 0;
            else
                return;
        }
        if (keyCode === 18 || keyCode === 17) {
            var location = "location" in e ? e.location : e.keyLocation;
            if (keyCode === 17 && location === 1) {
                if (pressedKeys[keyCode] == 1)
                    ts = e.timeStamp;
            } else if (keyCode === 18 && hashId === 3 && location === 2) {
                var dt = e.timeStamp - ts;
                if (dt < 50)
                    pressedKeys.altGr = true;
            }
        }
    }
    
    if (keyCode in keys.MODIFIER_KEYS) {
        keyCode = -1;
    }
    
    if (!hashId && keyCode === 13) {
        var location = "location" in e ? e.location : e.keyLocation;
        if (location === 3) {
            callback(e, hashId, -keyCode);
            if (e.defaultPrevented)
                return;
        }
    }
    
    if (useragent.isChromeOS && hashId & 8) {
        callback(e, hashId, keyCode);
        if (e.defaultPrevented)
            return;
        else
            hashId &= ~8;
    }

    // If there is no hashId and the keyCode is not a function key, then
    // we don't call the callback as we don't handle a command key here
    // (it's a normal key/character input).
    if (!hashId && !(keyCode in keys.FUNCTION_KEYS) && !(keyCode in keys.PRINTABLE_KEYS)) {
        return false;
    }
    
    return callback(e, hashId, keyCode);
}


export let addCommandKeyListener = function(el, callback, destroyer) {
    if (useragent.isOldGecko || (useragent.isOpera && !("KeyboardEvent" in window))) {
        // Old versions of Gecko aka. Firefox < 4.0 didn't repeat the keydown
        // event if the user pressed the key for a longer time. Instead, the
        // keydown event was fired once and later on only the keypress event.
        // To emulate the 'right' keydown behavior, the keyCode of the initial
        // keyDown event is stored and in the following keypress events the
        // stores keyCode is used to emulate a keyDown event.
        var lastKeyDownKeyCode = null;
        addListener(el, "keydown", function(e) {
            lastKeyDownKeyCode = e.keyCode;
        }, destroyer);
        addListener(el, "keypress", function(e) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        }, destroyer);
    } else {
        var lastDefaultPrevented = null;

        addListener(el, "keydown", function(e) {
            pressedKeys[e.keyCode] = (pressedKeys[e.keyCode] || 0) + 1;
            var result = normalizeCommandKeys(callback, e, e.keyCode);
            lastDefaultPrevented = e.defaultPrevented;
            return result;
        }, destroyer);

        addListener(el, "keypress", function(e) {
            if (lastDefaultPrevented && (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey)) {
                stopEvent(e);
                lastDefaultPrevented = null;
            }
        }, destroyer);

        addListener(el, "keyup", function(e) {
            pressedKeys[e.keyCode] = null;
        }, destroyer);

        if (!pressedKeys) {
            resetPressedKeys();
            addListener(window, "focus", resetPressedKeys);
        }
    }
};
function resetPressedKeys() {
    pressedKeys = Object.create(null);
}

export let nextTick;
if (typeof window == "object" && window.postMessage && !useragent.isOldIE) {
    var postMessageId = 1;
    nextTick = function(callback, win) {
        win = win || window;
        var messageName = "zero-timeout-message-" + (postMessageId++);
        
        var listener = function(e) {
            if (e.data == messageName) {
                stopPropagation(e);
                removeListener(win, "message", listener);
                callback();
            }
        };
        
        addListener(win, "message", listener);
        win.postMessage(messageName, "*");
    };
}

export let $idleBlocked = false;
export let onIdle = function(cb, timeout) {
    return setTimeout(function handler() {
        if (!$idleBlocked) {
            cb();
        } else {
            setTimeout(handler, 100);
        }
    }, timeout);
};

export let $idleBlockId = null;
export let blockIdle = function(delay) {
    if ($idleBlockId)
        clearTimeout($idleBlockId);
        
    $idleBlocked = true;
    $idleBlockId = setTimeout(function() {
        $idleBlocked = false;
    }, delay || 100);
};

export let nextFrame = typeof window == "object" && (window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || window.oRequestAnimationFrame);

if (nextFrame)
    nextFrame = nextFrame.bind(window);
else
    nextFrame = function(callback) {
        setTimeout(callback, 17);
    };
// });
