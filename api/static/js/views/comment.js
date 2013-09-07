/*global define*/
define([
	'jquery',
	'underscore',
	'underi18n',
	'backbone',
	'i18n/zh-cn',
	'text!templates/comment.html',
	'gfm',
	'jquery.bootstrap'
], function ($, _, underi18n, Backbone, zh_CN, commentTemplate, GFM) {
	'use strict';

	var CommentView = Backbone.View.extend({
		// template: _.template(commentTemplate),

		events: {
			"mouseenter .panel-heading":               "displaycommentconfig",
			"mouseleave .panel-heading":               "hidecommentconfig",
			"mouseenter .comment-user-img > img":      "popover",
			"mouseleave .comment":                     "hidepopover",
			"click .user-img":                         "usertopic",
            "click .edit-comment":                     "edit",
            "click .cancel":                           "cancel",
            "click .save":                             "save",
            "click .comment-friend":                   "addfriend",
		},

		initialize: function (options) {
			var zh = new zh_CN();
		    var locale = underi18n.MessageFactory(zh);
			this.template = _.template(underi18n.template(commentTemplate, locale));
		
			this.options = options;
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'add', this.render);
			_.bindAll(this, 'render', 'edit', 'cancel', 'save', 'displaycommentconfig', 'hidecommentconfig');
		},

		render: function () {
			this.$el.html('');
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		displaycommentconfig: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.edit-comment').removeClass('hide');
		},
		hidecommentconfig: function(e){
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.edit-comment').addClass('hide');
            this.$el.find('.comment-user-img').popover('hide');
		},
		
		edit: function(e){
            var self = this;
            this.$el.find('.comment-content').addClass('hide');
            this.$el.find('.comment-edit').removeClass('hide');
            this.$el.find("#comment-editor-"+ this.model.id).val(this.model.get('content'));
            var editor = CodeMirror.fromTextArea(document.getElementById("comment-editor-"+ this.model.id), {
		        mode: 'gfm',
		        lineNumbers: false,
		        theme: "default"
	      	});
	      	editor.on("change", function() {
	            $('#comment-editor-'+ self.model.id).val(editor.getValue());
	        });
	        editor.on("focus", function() {
	        	self.$el.find('.CodeMirror').addClass('focusedCodeMirror');
	        });
	        editor.on("blur", function() {
	        	self.$el.find('.CodeMirror').removeClass('focusedCodeMirror');
	        });
		},

		cancel: function(e) {
			this.$el.find('.comment-content').removeClass('hide');
            this.$el.find('.comment-edit').addClass('hide');
            this.$el.find("#comment-editor-"+ this.model.id).val('');
            this.$el.find('.CodeMirror').remove();
		},
		
		save: function(e){
		    e.stopImmediatePropagation();
            e.preventDefault();
            var content = this.$el.find('textarea').val();
            if(content){
                this.model.save({ content: content });
            }
            this.$el.find('.CodeMirror').remove();
		},

		popover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.comment-user-img').popover("show", 
                {
                	html: true,
        		}
            );
            this.$el.find('.popover-title').addClass('text-center');
		},
		hidepopover: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            this.$el.find('.comment-user-img').popover('hide');
		},

		addfriend: function(e) {
			e.stopImmediatePropagation();
            e.preventDefault();
            var to_user = this.model.get('author_id'),
            	following = this.model.get('following'),
            	csrfmiddlewaretoken = $('meta[name="csrf-token"]').attr('content');
            	self = this;
            $.ajax({
            	url: '/friends/action',
            	type: 'POST',
            	dataType: 'html',
            	data: {to_user: to_user, csrfmiddlewaretoken: csrfmiddlewaretoken},
            }).done(function() {
            	self.model.set('following', !following);
            });
		}
	});

	return CommentView;
});
