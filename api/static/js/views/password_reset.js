/*global define*/
define([
    'jquery',
    'underscore',
    'underi18n',
    'backbone',
    'i18n/zh-cn',
    'models/simpleuser',
    'text!templates/password_reset.html',
    'text!templates/password_reset_alert.html'
], function (
    $, 
    _, 
    underi18n, 
    Backbone, 
    zh_CN, 
    SimpleUserModel, 
    passwordresetTemplate,
    passwordresetalertTemplate
    ) {
    'use strict';

    var PasswordResetView = Backbone.View.extend({

        tagName:  'div',
        className: "clearfix",

        events: {
            "click .password-reset":             "password_reset",
            "keypress input[name=email]":        "keypressreset",
        },

        initialize: function (options) {
            var zh = new zh_CN();
            var locale = underi18n.MessageFactory(zh);
            this.template = _.template(underi18n.template(passwordresetTemplate, locale));
            this.alerttemplate = _.template(underi18n.template(passwordresetalertTemplate, locale));
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        password_reset: function(e){
            e.stopImmediatePropagation();
            e.preventDefault();

            var email = this.$el.find('input[name=email]').val().trim(),
                self = this,
                csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');

            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
            if(!myreg.test(email)){
                this.$el.find('input[name=email]').focus().closest('.form-group').addClass('has-error');
                this.$el.find('input[name=email]').prev().removeClass('hide');
                return;
            } else {
                $.ajax({
                    type: 'POST',
                    url: '/accounts/password/reset/',
                    dataType: 'json',
                    data: { 
                        email: email,
                        csrfmiddlewaretoken: csrfmiddlewaretoken 
                    },
                }).done(function(data, textStatus, jqXHR){
                    if(textStatus === 'success'){
                        self.$el.find('.alert').html(self.alerttemplate);
                        self.$el.find('.form-signin').addClass('hide');
                    }
                }).fail(function(jqXHR, textStatus){
                    self.$el.find('input[name=old_password]').parent().addClass('has-error');
                    self.$el.find('input[name=old_password]').prev('label').removeClass('hide');
                });
            }
        },

        keypressreset: function(e) {
            if (e.which !== 13) {
                return;
            }
            this.password_reset(e);
        },
    });

    return PasswordResetView;
});