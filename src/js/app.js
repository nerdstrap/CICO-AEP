define(function(require) {

    'use strict';

    var $ = require('jquery'),
            Backbone = require('backbone'),
            cicoStyleOverwrite = require('cico-style-overwrite');

    // these modules setup functions & configuration that are used elsewhere
    require('foundation');
    require('cico-util');
    require('routers/appRouter');

    Backbone.history.start();

    var doc = $(document);
    if (doc.foundation) {
        doc.foundation();
    }
    
    cicoStyleOverwrite.disableHover();

});
