define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    var CoreController = function(options) {
        console.debug('new CoreController()');
        options || (options = {});
        this.initialize.apply(this, arguments);
    };

    _.extend(CoreController.prototype, Backbone.Events, {
        initialize: function(options) {
            console.debug('CoreController.initialize');
            options || (options = {});
            this.router = options.router;
            this.dispatcher = options.dispatcher;
        },
        logout: function() {
            console.debug('CoreController.logout');
            var deferred = $.Deferred();
            this.router.trigger('logout');
            var url = env.getSiteRoot() + "?ts=" + (new Date()).getTime();

            $.when(this._logoutOfApp(), this._logoutOfServer()).then(
                    function() {
                        window.location.href = url;
                        deferred.resolve(url);
                    },
                    function() {
                        deferred.reject();
                    });

            return deferred.promise();
        },
        openHelp: function() {
            window.open("docs/CicoHelp.html");
        },
        emailHelp: function() {
            var bodyLine = "%0D%0A";
            var seperator = "------------------------------------------";
            var email = env.getHelpEmail();
            var subject = env.getHelpEmailSubject();

            var firstName = '';
            var lastName = '';
            var middleName = '';
            var userEmail = "Email: ";
            var contactNumber = "Contact Number: ";
            var userName = "User Name: ";

            if (this.myPersonnelModel) {
                firstName = this.myPersonnelModel.get("firstName");
                lastName = this.myPersonnelModel.get("lastName");
                middleName = (this.myPersonnelModel.has("middleName") ? this.myPersonnelModel.get("middleName") : '');
                userEmail = userEmail + this.myPersonnelModel.get("email");
                userName = userName + firstName + " " + middleName + " " + lastName;
                contactNumber = contactNumber + (this.myPersonnelModel.has("contactNumber") ? this.myPersonnelModel.get("contactNumber") : '');
            }

            window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + userName + bodyLine + userEmail + bodyLine + contactNumber + bodyLine + seperator + bodyLine + bodyLine + "message%20goes%20here";
        },
        _logoutOfApp: function() {
            return $.get(env.getAppLogoutUrl());
        },
        _logoutOfServer: function() {
            return $.get(env.getLogoutUrl());
        }

    });

    return CoreController;
});