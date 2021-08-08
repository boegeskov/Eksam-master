const socket = io(`http://${window.location.hostname}`)
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
let currentRoom


socket.on('message', text => {
    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)
});

socket.on('chat-message', ({ name, message }) => {
    appendMessage(message, name);
});

document.querySelector('button').onclick = () => {
    const text = document.querySelector('input').value;
    socket.emit('message', text)
}


appendMessage('You joined')
socket.emit('join-room', chatRoom);


messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    socket.emit('send-chat-message', { room: chatRoom, message });
    messageInput.value = ''
});

function appendMessage(message, name)
{
    const msg = name ? `${name}: ${message}` : message;

    const messageElement = document.createElement('div')
    messageElement.innerText = msg;
    messageContainer.append(messageElement)
}
