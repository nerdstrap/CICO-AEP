define(function (require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var ConfirmationModalView = require('views/ConfirmationModalView');
    var EventNameEnum = require('enums/EventNameEnum');

    var CoreController = function (options) {
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(CoreController.prototype, Backbone.Events, {

        initialize: function (options) {
            console.trace('CoreController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
            this.geoLocationService = options.geoLocationService;
            this.persistenceContext = options.persistenceContext;

            this.listenTo(this.dispatcher, EventNameEnum.showConfirmation, this.showConfirmation);
        },

        showConfirmation: function () {
            var currentContext = this;
            var deferred = $.Deferred();

            var confirmationModalView = new ConfirmationModalView({
                dispatcher: currentContext.dispatcher
            });

            currentContext.router.showModal(confirmationModalView);

            window.setTimeout(function () {
                deferred.resolveWith(currentContext, [confirmationModalView]);
            }, 5);

            return deferred.promise();
        }

    });

    return CoreController;
});