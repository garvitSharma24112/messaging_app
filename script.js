// Mock data for demo
const groups = [
    { id: 1, name: "Team Sync", avatar: "https://via.placeholder.com/40", lastMessage: "Let's meet at 3 PM" },
    { id: 2, name: "Friends", avatar: "https://via.placeholder.com/40", lastMessage: "Check this meme!" }
];

const messages = {
    1: [
        { id: 1, content: "Hey, how's the project?", sender: "other", type: "text" },
        { id: 2, content: "Looks good so far!", sender: "user", type: "text" }
    ],
    2: [
        { id: 3, content: "", sender: "other", type: "media", media: "https://via.placeholder.com/150" },
        { id: 4, content: "Haha, nice one!", sender: "user", type: "text" }
    ]
};

let currentGroupId = null;

// DOM elements
const chatList = document.querySelector('.chat-list');
const chatBody = document.querySelector('.chat-body');
const chatHeader = document.querySelector('.chat-header h2');
const chatHeaderImg = document.querySelector('.chat-header img');
const messageInput = document.querySelector('.message-input');
const sendBtn = document.querySelector('.send-btn');
const mediaUpload = document.getElementById('media-upload');
const newChatBtn = document.querySelector('.new-chat');

// Render groups
function renderGroups() {
    chatList.innerHTML = '';
    groups.forEach(group => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.tabIndex = 0;
        chatItem.setAttribute('role', 'option');
        chatItem.innerHTML = `
            <img src="${group.avatar}" alt="${group.name} avatar">
            <div class="chat-info">
                <h3>${group.name}</h3>
                <p>${group.lastMessage}</p>
            </div>
        `;
        chatItem.addEventListener('click', () => selectGroup(group.id, group.name, group.avatar));
        chatItem.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') selectGroup(group.id, group.name, group.avatar);
        });
        chatList.appendChild(chatItem);
    });
}

// Select group
function selectGroup(groupId, groupName, avatar) {
    currentGroupId = groupId;
    chatHeader.textContent = groupName;
    chatHeaderImg.src = avatar;
    renderMessages();
}

// Render messages
function renderMessages() {
    chatBody.innerHTML = '';
    const groupMessages = messages[currentGroupId] || [];
    groupMessages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', msg.sender === 'user' ? 'sent' : 'received');
        if (msg.type === 'text') {
            messageDiv.textContent = msg.content;
        } else if (msg.type === 'media') {
            const img = document.createElement('img');
            img.src = msg.media;
            img.alt = "Shared media";
            messageDiv.appendChild(img);
        }
        chatBody.appendChild(messageDiv);
    });
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Send message
function sendMessage() {
    if (!currentGroupId || !messageInput.value.trim()) return;
    const newMessage = {
        id: Date.now(),
        content: messageInput.value,
        sender: 'user',
        type: 'text'
    };
    messages[currentGroupId] = messages[currentGroupId] || [];
    messages[currentGroupId].push(newMessage);
    groups.find(g => g.id === currentGroupId).lastMessage = newMessage.content;
    renderMessages();
    renderGroups();
    messageInput.value = '';
}

// Handle media upload
function handleMediaUpload(e) {
    const file = e.target.files[0];
    if (!file || !currentGroupId) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        const newMessage = {
            id: Date.now(),
            content: "",
            sender: 'user',
            type: 'media',
            media: event.target.result
        };
        messages[currentGroupId] = messages[currentGroupId] || [];
        messages[currentGroupId].push(newMessage);
        groups.find(g => g.id === currentGroupId).lastMessage = "Shared an image";
        renderMessages();
        renderGroups();
    };
    reader.readAsDataURL(file);
}

// Create new group
function createNewGroup() {
    const name = prompt('Enter group name:');
    if (!name) return;
    const newGroup = {
        id: Date.now(),
        name,
        avatar: "https://via.placeholder.com/40",
        lastMessage: "Group created"
    };
    groups.push(newGroup);
    renderGroups();
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
mediaUpload.addEventListener('change', handleMediaUpload);
document.querySelector('.media-btn').addEventListener('click', () => mediaUpload.click());
newChatBtn.addEventListener('click', createNewGroup);

// Initialize
renderGroups();