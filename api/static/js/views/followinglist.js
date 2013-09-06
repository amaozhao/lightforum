/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/user',
	'views/friend',
	'jquery.bootstrap'
], function ($, _, Backbone, UserCollection, FriendView) {
	'use strict';

	var FollowingListView = Backbone.View.extend({

		initialize: function (options) {
            this.collection.fetch();
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'remove', this.render);
            this.listenTo(this.collection, 'add', this.render);
            _.bindAll(this, 'render', 'addOne', 'addAll', 'scroll');
        },

        render: function () {
		    this.$el.html('');
            this.$el.html(this.addAll());
            var self = this;
            $(window).scroll(function() { self.scroll(); });
		    return this;
		},

		addOne: function (friend) {
			var view = new FriendView({ model: friend });
			this.$el.append(view.render().el);
		},

		addAll: function () {
			this.collection.each(this.addOne, this);
		},
		
		scroll: function() {
            var bottom = $(document).height() - $(window).height() - 50 <= $(window).scrollTop();
            
            var self = this;
            if (bottom && this.collection.next) {
                $(window).unbind('scroll');
                self.$el.ajaxStart(function(){
                    $('#spin').removeClass('hide').spin('tiny', 'teal');
                });
                
                self.$el.ajaxStop(function(){
                    $('#spin').addClass('hide').spin(false);
                });
                
                $.getJSON(this.collection.next, function(data) {
                    self.collection.add(data.results);
                    if(data.next){
                        self.collection.next = data.next;
                    } else {
                        self.collection.next = null;
                    }
                    $(window).scroll(function() { self.scroll(); });
                });
            }
        },
	});

	return FollowingListView;
});