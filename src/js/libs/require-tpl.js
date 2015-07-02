define(
    [
        'module',
        'underscore'
    ],
    function (module, _) {

        var masterConfig = (module.config && module.config()) || {};

        var tpl = {
            load: function (name, parentRequire, onload, config) {
                config || (config = {});

                var extension = masterConfig.extension;
                if (config.extension) {
                    extension = config.extension;
                }
                extension = extension || 'html';

                var textName = 'text!' + name + '.' + extension;

                return parentRequire([textName], function (textTemplate) {
                    if (!config.isBuild) {
                        onload(_.template(textTemplate));
                    } else {
                        onload(textTemplate);
                    }
                });
            }
        };

        return tpl;
    }
);