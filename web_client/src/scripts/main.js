'use strict';

$(function() {

    var now = function() {
        var date = new Date();
        var time = date.getTime() - date.getTimezoneOffset() * 60 * 1000;
        return new Date(time).toISOString().slice(0, 19).replace('T', ' ');
    };

    $('.pref-area .button').click(function() {
        var button = $(this);
        button.addClass('active');
        button.siblings().removeClass('active');
    });

    var inputNode = $('#input-area input');
    var chatArea = $('#chat-area');
    var chatAreaList = $('#chat-area > .list');

    var chatAreaOps = {

        added: 0,

        add: function(message) {

            var header = $('<div>').addClass('header')
                                   .text(now() + ' 发送中……');

            var description = $('<div>').addClass('description')
                                .css('font-size', message.size + 'px')
                                .text(message.text);
            if (message.color !== '#FFFFFF') {
                description.css('color', message.color);
            }

            this.added += 1;

            var id = ('message-' + this.added);
            var item = $('<div>').attr('id', id).addClass('item');
            item.append(header).append(description);
            item.prependTo(chatAreaList).hide().show('fast');

            return this.added;
        },

        success: function(index) {
            var item = $('#message-' + index);
            item.addClass('success');
            var header = item.find('.header');
            var text = header.text().replace('发送中……', '发送成功');
            header.text(text);
        },

        fail: function(index, status) {
            var item = $('#message-' + index);
            item.addClass('error');
            var header = item.find('.header');
            var text = header.text()
                             .replace('发送中……', '发送失败：' + status);
            header.text(text);
        },

    };

    var takeMessage = function() {
        var text = inputNode.val().trim();

        if (!text) {
            return null;
        }

        inputNode.val('');
        var color = $('#color-group .button.active').data('value');
        var size = $('#size-group .button.active').data('value');
        var mode = $('#mode-group .button.active').data('value');
        var message = {
            text: text,
            color: color,
            size: parseInt(size),
            mode: parseInt(mode),
        };
        return message;
    };

    var sendMessage = function(message, index) {
        $.post('/buibui/bui', message).done(function() {
            chatArea.animate({scrollTop: 0}, 200);
            chatAreaOps.success(index);
        }).fail(function(xhr) {
            chatAreaOps.fail(index, xhr.status);
        });
    };

    $('#input-area .button').click(function() {
        var message = takeMessage();
        if (!message) {
            return;
        }
        var index = chatAreaOps.add(message);
        sendMessage(message, index);
    });

});