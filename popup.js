const { ipcRenderer } = require('electron');
const { clipboard } = require('electron');

let savedItems = [];
let currentTheme = 'dark';

// DOM Elements
const textInput = document.getElementById('text-input');
const saveBtn = document.getElementById('save-btn');
const searchInput = document.getElementById('search-input');
const savedItemsContainer = document.getElementById('saved-items');
const themeToggle = document.getElementById('theme-toggle');
const minimizeBtn = document.getElementById('minimize-btn');

// Load saved items and theme preference
async function loadData() {
    savedItems = await ipcRenderer.invoke('load-data');
    currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.checked = currentTheme === 'light';
    renderItems();
}

// Save items to file
async function saveData() {
    await ipcRenderer.invoke('save-data', savedItems);
}

// Create a new item
function createItem(text) {
    const newItem = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toISOString()
    };
    savedItems.unshift(newItem);
    saveData();
    renderItems();
}

// Delete an item
function deleteItem(id) {
    savedItems = savedItems.filter(item => item.id !== id);
    saveData();
    renderItems();
}

// Copy text to clipboard
function copyToClipboard(text) {
    clipboard.writeText(text);
}

// Render items in the container
function renderItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = savedItems.filter(item => 
        item.text.toLowerCase().includes(searchTerm)
    );

    savedItemsContainer.innerHTML = filteredItems.map(item => `
        <div class="saved-item">
            <div class="item-text" title="${item.text}">${item.text}</div>
            <div class="item-controls">
                <button class="copy-btn" onclick="handleCopy(${item.id})">Copy</button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle copy button click
function handleCopy(id) {
    const item = savedItems.find(item => item.id === id);
    if (item) {
        copyToClipboard(item.text);
        const copyBtn = document.querySelector(`button[onclick="handleCopy(${id})"]`);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    }
}

// Event Listeners
saveBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text) {
        createItem(text);
        textInput.value = '';
    }
});

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const text = textInput.value.trim();
        if (text) {
            createItem(text);
            textInput.value = '';
        }
    }
});

searchInput.addEventListener('input', () => {
    renderItems();
});

themeToggle.addEventListener('change', () => {
    currentTheme = themeToggle.checked ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
});

minimizeBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

// Initialize
loadData(); 