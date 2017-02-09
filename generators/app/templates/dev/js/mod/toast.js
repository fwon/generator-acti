'use strict';

function Toast() {
    if (!this.toastEle) {
        this.toastEle = $("#toast").length ?  $("#toast") :
                        $('<div id="toast" style="display:none;"></div>')[0];
        $("body").append(this.toastEle);
    }
    this.timeout = null;
}

Toast.prototype.show = function(txt, disappear) {
    var that = this;
    this.toastEle.innerText = txt;
    this.toastEle.style.display = "block";
    if (!disappear) {
        this.timeout = setTimeout(that.hide.bind(that), 1500);   
    }
};

Toast.prototype.hide = function() {
    this.toastEle.innerText = '';
    this.toastEle.style.display = "none";
    clearTimeout(this.timeout);
};

module.exports = Toast;