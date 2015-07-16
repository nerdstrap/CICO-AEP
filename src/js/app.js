define(function(require) {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var CoreRouter = require('routers/CoreRouter');

    // these modules setup functions & configuration that are used elsewhere
    require('handlebars-helpers');
    require('foundation');

    var coreRouterInstance = new CoreRouter();

    Backbone.history.start();

    var doc = $(document);
    if (doc.foundation) {
        doc.foundation();
    }
});
