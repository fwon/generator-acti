'use strict';

/**
* 事件绑定抽象，代理模式
* 解决page文件中繁杂的元素绑定
* 依赖zepto
*
* 用法：
* var handler = new Handler({
*     el : '#id'
* });
*
* //事件统一绑定
* handler.handles({
*     'click .ele1': func1,
*     'click .ele2': func2,
*     'click .ele3': func3,
*     'change .ele4': func4
* });
*
* handler.remove(); //销毁所有事件
*/

var uievent = {
    on: function(selectors, proxy) {
        if ($.isPlainObject(selectors)) {
            $.each(selectors, function(key, selector) {
                this.on(selector, proxy);
            });
        } else if (typeof selectors === 'string') {
            this.bindEvent(selectors, proxy);
        }
        return this;
    },
    off: function(selectors, proxy) {
        if ($.isPlainObject(selectors)) {
            $.each(selectors, function(key, selector) {
                this.off(selector, proxy);
            });
        } else if (typeof selectors === 'string') {
            this.unBindEvent(selectors, proxy);
        }
        return this;
    },
    bindEvent: function(selector, proxy) {
        $(document).on("click", selector, proxy);
    },
    unBindEvent: function(selector, proxy) {
        $(document).off("click", selector, proxy);
    }
};

var delegateEventSplitter = /^(\S+)\s*(.*)$/; 
var Handler = function (options) {
    this.el = options.el || '';
    this.$el = $(this.el);
};
var fn = Handler.prototype;
fn.handles = function(handles, context) {
    var key, method, match, eventName, selector;
    if (!handles) { return; }
    this.unhandles();
    for (key in handles) {
        method = handles[key];
        if (typeof method !== 'function') {
            method = context[method];
        }
        if (!method) {
            continue;
        }
        
        match = key.match(delegateEventSplitter);
        eventName = match[1];
        selector = match[2];
        method = $.proxy(method, context);

        if (eventName === 'click') {
            this.onClick(this.el + ' ' + selector, method); //pre class
        } else {
            if (selector === '') {
                this.$el.on(eventName, method);
            } else {
                this.$el.on(eventName, selector, method);
            }
        }
    }
};
fn.unhandles = function() {
    if (this.$el) {
        this.$el.off();
    }
    
    this.offClick();

    return this;
};
fn.onClick = function(selector, proxy) {
    if (! this.clickEvents) {
        this.clickEvents = [];
    }
    this.clickEvents.push(arguments);
    uievent.on(selector, proxy);
    return this;
};
fn.offClick = function(selectors, proxy) {
    var self = this;

    if (! this.clickEvents) {
        return this;
    }

    if (arguments.length === 0) {
        $.each(this.clickEvents, function(key, args) {
            uievent.off.apply(uievent, args);
        });
        this.clickEvents = [];
    } else {

        selectors = this.el + ' ' + selectors; //pre class

        $.each(this.clickEvents, function(key, args) {
            if (! args || args.length === 0) {
                return;
            }
            if (args[0] === selectors && args[1] === proxy) {
                uievent.off.apply(uievent, args);
                self.clickEvents[key] = null;
                return false;
            }
        });
        self.clickEvents = self.clickEvents.filter(function(item) {
            return item !== null;
        });
    }

    return this;
};

module.exports = Handler;