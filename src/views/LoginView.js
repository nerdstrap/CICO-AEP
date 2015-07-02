define(function(require) {

    "use strict";

    var $                           = require('jquery'),
        _                           = require('underscore'),
        BasePopupView               = require('views/base/BasePopupView'),
        AuthModel                   = require('models/AuthModel'),
        template                         = require('hbs!templates/Login'),
        rendered                    = false;

    return BasePopupView.extend({
        
        initialize: function(options) {
            console.debug('LoginView.initialize');
            options || (options = {});            
        },
                
        render: function() {
            if (!rendered) {
                this.$el.html(template({}));
                rendered = true;
            }
            return this;
        },
                
        beforeShow: function() {
            this.render();

            return true;
        },
                
        events: {
            "click #btnLogIn": "login"
        },
                
        login: function() {
            var authModelInstance = this.model;
            authModelInstance.set("user", this.$('#user').val());
            authModelInstance.set('password', this.$('#password').val());
            authModelInstance.save();
        }
        
    });

});