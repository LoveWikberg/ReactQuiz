$(function () {
    name = prompt("User name:")

    $('#testbtn').click(function () {

    });

});

var name;

var transport = signalR.TransportType.WebSockets;
var connection = new signalR.HubConnection(`http://${document.location.host}/quiz`, { transport: transport });
connection.on();
connection.start();

connection.on('connect', () => {
});

connection.on('testing', () => {
    alert("testing");
});

connection.on('showQuestion', (question) => {

});

function getHtmlForQuestion(question) {
    var html = '<h2>' + question.question + '</h2><br>';
    html += ''
}

