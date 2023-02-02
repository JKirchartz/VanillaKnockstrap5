﻿ko.bindingHandlers.modal = {
    defaults: {
        css: 'modal fade',
        dialogCss: '',
        attributes: {
            role: 'dialog'  
        },

        events: {
            shown: 'shown.bs.modal',
            hidden: 'hidden.bs.modal'
        },

        headerTemplate: {
            name: 'modalHeader',
            templateEngine: ko.stringTemplateEngine.instance
        },

        bodyTemplate: {
            name: 'modalBody',
            templateEngine: ko.stringTemplateEngine.instance
        },

        footerTemplate: {
            name: 'modalFooter',
            templateEngine: ko.stringTemplateEngine.instance,
            data: {
                closeLabel: 'Close',
                primaryLabel: 'Ok'
            }
        }
    },
    modalInstance : {},
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element = $(element),
            value = valueAccessor(),
            defaults = ko.bindingHandlers.modal.defaults,
            events = $.extend({}, defaults.events, ko.toJS(value.events)),
            options = ko.utils.extend({ show: $element.data().show || false }, ko.toJS(value.options)),
            extendDefaults = function (defs, val) {
                var extended = {
                    name: defs.name,
                    data: defs.data,
                };

                // reassign to not overwrite default content of data property
                extended = $.extend(true, {}, extended, val);
                if (!val || !val.name) {
                    extended.templateEngine = defs.templateEngine;
                }

                return extended;
            };

        if (!value.header || !value.body) {
            throw new Error('header and body options are required for modal binding.');
        }

        // fix for not working escape button
        if (options.keyboard || typeof options.keyboard === 'undefined') {
            $element.attr('tabindex', -1);
        }

        var model = {
            dialogCss: value.dialogCss || defaults.dialogCss,
            headerTemplate: extendDefaults(defaults.headerTemplate, ko.unwrap(value.header)),
            bodyTemplate: extendDefaults(defaults.bodyTemplate, ko.unwrap(value.body)),
            footerTemplate: value.footer ? extendDefaults(defaults.footerTemplate, ko.unwrap(value.footer)) : null
        };

        ko.renderTemplate('modal', bindingContext.createChildContext(model), { templateEngine: ko.stringTemplateEngine.instance }, element);

        $element.addClass(defaults.css).attr(defaults.attributes);
        // $element.modal(options);

        viewModel.modalInstance = new bootstrap.Modal($element, options);

        $element.on(events.shown, function () {
            if (typeof value.visible !== 'undefined' && typeof value.visible === 'function' && !ko.isComputed(value.visible)) {
                value.visible(true);
            }

            $(this).find("[autofocus]:first").focus();
        });

        if (typeof value.visible !== 'undefined' && typeof value.visible === 'function' && !ko.isComputed(value.visible)) {
            $element.on(events.hidden, function() {
                value.visible(false);
            });

            // if we need to show modal after initialization, we need also set visible property to true
            if (options.show) {
                value.visible(true);
            }
        }

        return { controlsDescendantBindings: true };
    },

    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        if (typeof value.visible !== 'undefined') {
            if (ko.unwrap(value.visible)){
                viewModel.modalInstance.show();
            }
            else {
                viewModel.modalInstance.hide();
            }
        }
    }
};