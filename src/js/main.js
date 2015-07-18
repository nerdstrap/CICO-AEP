require.config({
    config: {
        'config': {
            apiUrl: '/CheckInCheckOutMobile-services/webresources',
            siteRoot: '/CheckInCheckOutMobile-web/',
            myPersonnelId: 's251201',
            expirationThreshold: 30,
            contactHelpEmailAddress: 'helpaep@aep.com',
            contactHelpSubject: 'CICO Help'
        },
        'services/GeoLocationService': {
            'timeout': 5000,
            'enableHighAccuracy': false,
            'maximumAge': 6000
        },
        'hbs': {
            'extension': 'html'
        }
    },
    paths: {
        /* Require */
        'require': 'libs/require',
        'text': 'libs/text',
        'hbs': 'libs/hbs',
        /* jQuery */
        'jquery': 'libs/jquery',
        'jquery-highlight': 'libs/jquery-highlight',
        'jquery-magnific-popup': 'libs/jquery-magnific-popup',
        'jquery-formatter': 'libs/jquery-formatter',
        /* Underscore */
        'underscore': 'libs/underscore',
        /* Backbone */
        'backbone': 'libs/backbone',
        'backbone-modal': 'libs/backbone-modal',
        'backbone-validation': 'libs/backbone-validation',
        /* Handlebars */
        'Handlebars': 'libs/handlebars',
        'handlebars-helpers': 'libs/handlebars-helpers',
        /* Modernizr */
        'modernizr': 'libs/modernizr',
        /* Foundation */
        'foundation': 'libs/foundation',
        'foundation.reveal': 'libs/foundation.reveal',
        /* App */
        'config': 'libs/config',
        'console': 'libs/console',
        'resources': 'libs/resources',
        'utils': 'libs/utils',
        /* Convenience */
        'collections': '../collections',
        'contexts': '../contexts',
        'controllers': '../controllers',
        'dispatchers': '../dispatchers',
        'enums': '../enums',
        'mappers': '../mappers',
        'models': '../models',
        'repositories': '../repositories/memory',
        'routers': '../routers',
        'services': '../services',
        'templates': '../templates',
        'views': '../views'

    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'foundation': {
            deps: [
                'jquery',
                'modernizr'
            ]
        },
        'foundation.reveal': {
            deps: [
                'foundation'
            ]
        },
        'magnific-jquery-popup': {
            deps: ['jquery']
        },
        'Handlebars': {
            exports: 'Handlebars'
        }
    }
});

// Global error handler
requirejs.onError = function(err) {
    if (err) {
        console.log(err.message);
        if (err.originalError) {
            console.log(err.originalError.message);
        }
        if (err.requireType) {
            if (err.requireType === 'timeout') {
                console.log('modules: ' + err.requireModules);
            }
        }
    }

    throw err;
};

// Load our app module and pass it to our definition function
require(['console', 'app']);