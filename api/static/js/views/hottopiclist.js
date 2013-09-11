/*global define*/
define([
    'jquery',
    'underscore',
    'underi18n',
    'backbone',
    'i18n/zh-cn',
    'collections/simpletopic',
    'views/simpletopic',
    'text!templates/sidebarhottopics.html',
    'text!templates/none.html',
], function (
    $, 
    _, 
    underi18n,
    Backbone, 
    zh_CN,
    SimpleTopicCollection,
    SimpleTopicView,
    sidebarhottopicsTemplate,
    noneTemplate) {
    'use strict';

    var HotTopicListView = Backbone.View.extend({
        // template: _.template(sidebarhottopicsTemplate),

        initialize: function (options) {
            var zh = new zh_CN();
            var locale = underi18n.MessageFactory(zh);
            this.template = _.template(underi18n.template(sidebarhottopicsTemplate, locale));
            this.nonetemplate = _.template(underi18n.template(noneTemplate, locale));
            this.hottopics = new SimpleTopicCollection();
            this.hottopics.url = '/api/topics/hot';
            this.hottopics.fetch();
            this.listenTo(this.hottopics, 'all', this.render);
            // this.listenTo(this.model, 'add', this.render);

            _.bindAll(this, 'render');
        },

        render: function () {
            this.$el.html(this.template);
            this.$el.html(this.hottopicaddAll());
            return this;
        },

        hottopicaddOne: function (topic) {
            var view = new SimpleTopicView({ model: topic });
            this.$el.find('.panel-body').append(view.render().el);
        },

        hottopicaddAll: function () {
            if(_.size(this.collection) === 0) {
                this.$el.find('.panel-body').html(this.nonetemplate());
            } else {
                this.hottopics.each(this.hottopicaddOne, this);
            }
        },
    });

    return HotTopicListView;
});
