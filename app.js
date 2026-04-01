// Shared Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Landing Page Logic
function initLanding() {
    const createBtn = document.getElementById('create-btn');
    const joinBtn = document.getElementById('join-btn');
    const roomIdInput = document.getElementById('room-id');
    const userNameInput = document.getElementById('user-name');

    // Pre-fill name if exists
    if (userNameInput) {
        userNameInput.value = localStorage.getItem('user_name') || '';
    }

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const randomId = Math.random().toString(36).substring(2, 10);
            const userName = userNameInput ? userNameInput.value.trim() : '';
            if (!userName) {
                alert('Please enter your name');
                userNameInput.focus();
                return;
            }
            saveUserName(userName);
            joinRoom(randomId, userName);
        });
    }

    if (joinBtn) {
        joinBtn.addEventListener('click', () => {
            const roomId = roomIdInput.value.trim();
            const userName = userNameInput ? userNameInput.value.trim() : '';
            
            if (!userName) {
                alert('Please enter your name');
                userNameInput.focus();
                return;
            }
            
            if (roomId) {
                saveUserName(userName);
                joinRoom(roomId, userName);
            } else {
                alert('Please enter a room name');
                roomIdInput.focus();
            }
        });
    }

    if (roomIdInput) {
        roomIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                joinBtn.click();
            }
        });
    }

    renderRecentRooms();
}

function joinRoom(roomId, userName) {
    saveRecentRoom(roomId);
    const encodedName = encodeURIComponent(userName);
    window.location.href = `meeting.html?room=${roomId}&name=${encodedName}`;
}

function saveUserName(name) {
    localStorage.setItem('user_name', name);
}

function saveRecentRoom(roomId) {
    let recents = JSON.parse(localStorage.getItem('recent_rooms') || '[]');
    if (!recents.includes(roomId)) {
        recents.unshift(roomId);
        recents = recents.slice(0, 5); // Keep last 5
        localStorage.setItem('recent_rooms', JSON.stringify(recents));
    }
}

function renderRecentRooms() {
    const list = document.getElementById('recent-rooms-list');
    const container = document.getElementById('recent-rooms-container');
    const userNameInput = document.getElementById('user-name');
    if (!list || !container) return;

    const recents = JSON.parse(localStorage.getItem('recent_rooms') || '[]');
    
    if (recents.length > 0) {
        container.style.display = 'block';
        list.innerHTML = '';
        recents.forEach(roomId => {
            const tag = document.createElement('button');
            tag.className = 'btn btn-secondary';
            tag.style.padding = '0.3rem 0.75rem';
            tag.style.fontSize = '0.8rem';
            tag.style.borderWidth = '1px';
            tag.textContent = roomId;
            tag.onclick = () => {
                const userName = userNameInput ? userNameInput.value.trim() : '';
                if (!userName) {
                    alert('Please enter your name first');
                    userNameInput.focus();
                    return;
                }
                saveUserName(userName);
                joinRoom(roomId, userName);
            };
            list.appendChild(tag);
        });
    }
}

// Main Initialization
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    // Only init landing if we are on the landing page
    if (document.getElementById('create-btn')) {
        initLanding();
        
        // Check for room parameter in URL to auto-fill
        const params = new URLSearchParams(window.location.search);
        const roomParam = params.get('room');
        if (roomParam) {
            const roomIdInput = document.getElementById('room-id');
            if (roomIdInput) {
                roomIdInput.value = roomParam;
                // Optionally could auto-click join, but better to let user confirm
            }
        }
    }
});
