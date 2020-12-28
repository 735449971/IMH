(function (window, document, $) {
    'use strict';
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimaitonFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();
    var pluginName = 'jqSignature', defaults = {
        lineColor: '#222222',
        lineWidth: 5,
        border: '1px dashed #CCFF99',
        background: '#FFFFFF',
        width: 1500,
        height: 600,
        autoFit: false
    }, canvasFixture = '<canvas></canvas>';

    function Signature(element, options) {
        this.element = element;
        this.$element = $(this.element);
        this.canvas = false;
        this.$canvas = false;
        this.ctx = false;
        this.drawing = false;
        this.currentPos = {x: 0, y: 0};
        this.lastPos = this.currentPos;
        this._data = this.$element.data();
        this.settings = $.extend({}, defaults, options, this._data);
        this.init();
    }

    Signature.prototype = {
        init: function () {
            this.$canvas = $(canvasFixture).appendTo(this.$element);
            this.$canvas.attr({width: this.settings.width, height: this.settings.height});
            this.$canvas.css({
                boxSizing: 'border-box',
                width: this.settings.width + 'px',
                height: this.settings.height + 'px',
                border: this.settings.border,
                background: this.settings.background,
                // cursor: 'crosshair'
                // cursor: url('/static/assets/images/pencil.cur')
            });
            if (this.settings.autoFit === true) {
                this._resizeCanvas();
            }
            this.canvas = this.$canvas[0];
            this._resetCanvas();
            this.$canvas.on('mousedown touchstart', $.proxy(function (e) {
                this.drawing = true;
                this.lastPos = this.currentPos = this._getPosition(e);
            }, this));
            this.$canvas.on('mousemove touchmove', $.proxy(function (e) {
                this.currentPos = this._getPosition(e);
            }, this));
            this.$canvas.on('mouseup touchend', $.proxy(function (e) {
                this.drawing = false;
                var changedEvent = $.Event('jq.signature.changed');
                this.$element.trigger(changedEvent);
            }, this));
            $(document).on('touchstart touchmove touchend', $.proxy(function (e) {
                if (e.target === this.canvas) {
                    e.preventDefault();
                }
            }, this));
            var that = this;
            (function drawLoop() {
                window.requestAnimFrame(drawLoop);
                that._renderCanvas();
            })();
        }, clearCanvas: function () {
            this.canvas.width = this.canvas.width;
            this._resetCanvas();
        }, getDataURL: function () {
            return this.canvas.toDataURL();
        }, reLoadData: function () {
            this.$canvas.remove();
            this._data = this.$element.data();
            this.init();
        }, _getPosition: function (event) {
            var xPos, yPos, rect;
            rect = this.canvas.getBoundingClientRect();
            event = event.originalEvent;
            if (event.type.indexOf('touch') !== -1) {
                xPos = event.touches[0].clientX - rect.left;
                yPos = event.touches[0].clientY - rect.top;
            } else {
                xPos = event.clientX - rect.left;
                yPos = event.clientY - rect.top;
            }
            return {x: xPos, y: yPos};
        }, _renderCanvas: function () {
            if (this.drawing) {
                this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
                this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
                this.ctx.stroke();
                this.lastPos = this.currentPos;
            }
        }, _resetCanvas: function () {
            this.ctx = this.canvas.getContext("2d");
            this.ctx.strokeStyle = this.settings.lineColor;
            this.ctx.lineWidth = this.settings.lineWidth;
        }, _resizeCanvas: function () {
            var width = this.$element.outerWidth();
            this.$canvas.attr('width', width);
            this.$canvas.css('width', width + 'px');
        }
    };
    $.fn[pluginName] = function (options) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Signature(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
            this.each(function () {
                var instance = $.data(this, 'plugin_' + pluginName);
                if (instance instanceof Signature && typeof instance[options] === 'function') {
                    var myArr = Array.prototype.slice.call(args, 1);
                    returns = instance[options].apply(instance, myArr);
                }
                if (options === 'destroy') {
                    $.data(this, 'plugin_' + pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
})(window, document, jQuery);