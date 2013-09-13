/*global define*/
define([
    'jquery',
    'underscore',
    'underi18n',
    'backbone',
    'i18n/zh-cn',
    'models/simpleuser',
    'text!templates/password_change.html',
    'text!templates/password_change_alert.html',
    'jquery.spin'
], function (
    $, 
    _, 
    underi18n, 
    Backbone, 
    zh_CN, 
    SimpleUserModel, 
    passwordchangeTemplate,
    passwordchangealertTemplate
    ) {
    'use strict';

    var PasswordChangeView = Backbone.View.extend({

        tagName:  'div',
        className: "clearfix",

        events: {
            "click .password-change": "password_change",
            "keypress input[name=username]":        "keypresssignin",
            "keypress input[name=password]":        "keypresssignin",
        },

        initialize: function (options) {
            var zh = new zh_CN();
            var locale = underi18n.MessageFactory(zh);
            this.template = _.template(underi18n.template(passwordchangeTemplate, locale));
            this.alerttemplate = _.template(underi18n.template(passwordchangealertTemplate, locale));
        },

        render: function () {
            this.$el.html(this.template);
            return this;
        },

        password_change: function(e){
            e.stopImmediatePropagation();
            e.preventDefault();

            var old_password = this.$el.find('input[name=old_password]').val().trim(),
                new_password1 = this.$el.find('input[name=new_password1]').val().trim(),
                new_password2 = this.$el.find('input[name=new_password2]').val().trim(),
                self = this,
                csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');

            if(!old_password){
                this.$el.find('input[name=old_password]').focus().closest('.form-group').addClass('has-error');
            }
            if(!new_password1 || !new_password2 || (new_password1 !== new_password2)){
                this.$el.find('input[name=password1]').focus().closest('.form-group').addClass('has-error');
                this.$el.find('input[name=password2]').focus().closest('.form-group').addClass('has-error');
            }

            if(old_password && new_password1 && new_password2){
                $.ajax({
                    type: 'POST',
                    url: '/accounts/password/change/',
                    dataType: 'json',
                    data: { 
                        old_password: old_password, 
                        new_password1: new_password1, 
                        new_password2: new_password2,
                        csrfmiddlewaretoken: csrfmiddlewaretoken 
                    },
                }).done(function(data, textStatus, jqXHR){
                    if(textStatus === 'success'){
                        self.$el.prepend(self.alerttemplate);
                    }
                }).fail(function(jqXHR, textStatus){
                    self.$el.find('input[name=old_password]').parent().addClass('has-error');
                    self.$el.find('input[name=old_password]').prev('label').removeClass('hide');
                });
            }
        },

        keypresssignin: function(e) {
            if (e.which !== 13) {
                return;
            }
            this.signin(e);
        },
    });

    return PasswordChangeView;
});