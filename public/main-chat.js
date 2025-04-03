const socket = io();
    //get elements thingy
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    const userList = document.getElementById('user-list');
    const usernameContainer = document.getElementById('username-container');
    const usernameInput = document.getElementById('username-input');
    const joinBtn = document.getElementById('join-btn');
    
    // join
    joinBtn.addEventListener('click', () => {
      const username = usernameInput.value.trim();
      if (username) {
        socket.emit('join', username);
        usernameContainer.style.display = 'none';
      }
    });
    
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = messageInput.value.trim();
      if (message) {
        socket.emit('sendMessage', message);
        messageInput.value = '';
      }
    });
    socket.on('message', (message) => {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      
      const userElement = document.createElement('div');
      userElement.classList.add('user');
      userElement.textContent = message.user;
      
      const textElement = document.createElement('div');
      textElement.textContent = message.text;
      
      messageElement.appendChild(userElement);
      messageElement.appendChild(textElement);
      chatContainer.appendChild(messageElement);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    });
    socket.on('userList', (users) => {
      userList.innerHTML = '';
      users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
      });
    });


    //more functions soon