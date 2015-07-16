define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var EventNameEnum = require('enums/EventNameEnum');
    var ModalView = require('backbone-modal');

    var BaseModalView = ModalView.extend({
        hideModalBlanket: function() {
            // don't hide the modal background if another popup is open or in the process of opening
            if ($("div#modalContainer").length <= 1) {
                ModalView.prototype.hideModalBlanket.call(this);
            }
        },
        show: function() {
            console.debug("BaseModalView.show");
            var showModal = true;
            if (this.beforeShow) {
                showModal = this.beforeShow.apply(this, arguments);
            }

            if (showModal) {
                var options = $.extend({closeImageUrl: "img/close-modal.png",
                    backgroundClickClosesModal: false,
                    pressingEscapeClosesModal: false,
                    css:
                            {
                            }}, this.popupOptions);

                if (this.modal) {
                    options.permanentlyVisible = true;
                }
                this.showModal(options);
                this.delegateEvents();
            }
        },
        hide: function() {
            console.debug("BaseModalView.hide");
            this.hideModal();
            this.undelegateEvents();
        }

    });
    
    return BaseModalView

});