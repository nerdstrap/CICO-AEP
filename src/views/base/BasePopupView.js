define(function (require) {

    "use strict";

    var $ = require('jquery'),
        Backbone = require('backbone'),
        ModalView = require('backbone-modal');

    return ModalView.extend({

        hideModalBlanket: function () {
            // don't hide the modal background if another popup is open or in the process of opening
            if ($("div#modalContainer").length <= 1) {
                ModalView.prototype.hideModalBlanket.call(this);
            }
        },

        show: function () {
            console.debug("BasePopupView.show");
            var showPopup = true;
            if (this.beforeShow) {
                showPopup = this.beforeShow.apply(this, arguments);
            }

            if (showPopup) {
                var options = $.extend({ closeImageUrl: "img/close-modal.png",
                    backgroundClickClosesModal: false,
                    pressingEscapeClosesModal: false,
                    css:
                        {
                        } }, this.popupOptions);

                if (this.modal) {
                    options.permanentlyVisible = true;
                }
                this.showModal(options);
                this.delegateEvents();
            }
        },

        hide: function () {
            console.debug("BasePopupView.hide");
            this.hideModal();
            this.undelegateEvents();
        }

    });

});