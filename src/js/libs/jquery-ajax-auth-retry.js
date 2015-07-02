
define(function(require) {
    var $   = require("jquery"),
        env = require('env');
    
    var setup = function(loginHandler) {
        $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
            if (!originalOptions.skipAuthTransport) {
                return "auth-wrapper";
            }
        });

        $.ajaxTransport("auth-wrapper", function(options, originalOptions, jqXHR) {
            options.dataTypes.shift(); // remove the "auth-wrapper" dataType
            return {
                send: function(headers, completeCallback) {
                    var newOptions = $.extend({}, originalOptions, {skipAuthTransport: true, timeout: 50000});
                    delete newOptions.error;
                    delete newOptions.complete;
                    delete newOptions.success;
                    newOptions.complete = function(jqXHR, textStatus) {
                        // if the response is an Access Manager auth request
                        if (textStatus === "parsererror" && jqXHR && jqXHR.responseText && jqXHR.responseText.indexOf('AEP Logon') > 0) {
                            // reloading the page from the server should force the user to reauthenticate
                            window.location.reload(true);
                        } else {
                            var responseData = {text:jqXHR.responseText};
                            completeCallback(jqXHR.status, textStatus, responseData, jqXHR.getAllResponseHeaders());
                        }
                    };
                    $.ajax(newOptions);
                },
                abort: function() {
                    //alert('abort');
                }
            };
        });
    };
    
    return setup;
});