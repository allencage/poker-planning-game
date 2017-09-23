$(function () {
    // Declare a proxy to reference the hub.
    var chat = $.connection.chatHub;
    // Create a function that the hub can call to broadcast messages.
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message.
        var encodedName = $('<div />').text(name).html();
        var encodedMsg = $('<div />').text(message).html();
        // Add the message to the page.
        $('#discussion').append('<li><strong>' + encodedName
            + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
    };

    chat.client.showNumberOfConnectedUsers = function (count) {
        var encodedCount = $('<div />').text(count).html();
        $('#connectedUsers').val('');
        $('#connectedUsers').append('<span>' + encodedCount + '</span>');
    }

    chat.client.updateUserNamesList = function (userNames) {
        $('#userNames').empty();
        if (userNames && userNames.length > 0) {
            for (var i = 0; i < userNames.length; i++) {
                $('#userNames').append('<li>' + userNames[i].value + '</li>');
            }
        }

    }

    // Get the user name and store it to prepend to messages.
    $('#displayName').val(prompt('Enter your name:', ''));
    // Set initial focus to message input box.
    //$('#message').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        var init = function (userName) {
            chat.server.registerUser(userName)
                .then(
                function (data) {

                }, function () {

                });
        }
        init($('#displayName').val());

        $('#sendMessage').click(function () {
            // Call the Send method on the hub.
            chat.server.send($('#displayName').val(), $('#message').val());
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });
    });
});