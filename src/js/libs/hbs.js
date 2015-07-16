define(function (require) {
    'use strict';

    var module = require('module');

    var masterConfig = (module.config && module.config()) || {};

    var hbs = {
        load: function (name, req, load, config) {
            config = config || {};

            var extension = masterConfig.extension;
            if (config.extension) {
                extension = config.extension;
            }
            extension = extension || 'html';

            var textName = 'text!' + name + '.' + extension;

            return req(['Handlebars', textName], function (Handlebars, template) {
                if (!config.isBuild) {
                    load(Handlebars.compile(template));
                }
                else {
                    load(template);
                }
            });
        }
    };

    return hbs;
});