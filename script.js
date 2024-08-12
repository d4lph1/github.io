function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
}

function generateNastyaText() {
    const nastyaText = "Рома любит Настю. ";
    let fullText = '';
    for (let i = 0; i < 1000; i++) {
        fullText += nastyaText;
    }
    document.getElementById('nastya-text').textContent = fullText;
}

window.onload = () => {
    generateNastyaText();

    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('gameId');
    if (gameId) {
        joinGame(gameId);
    }
};

// Создание игры
function createGame() {
    const deckSize = document.getElementById('deck-size').value;
    const playerCount = document.getElementById('player-count').value;

    fetch(`/create-game?deckSize=${deckSize}&playerCount=${playerCount}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('game-settings').style.display = 'none';
            const linkContainer = document.getElementById('link-container');
            linkContainer.style.display = 'block';
            document.getElementById('game-link').value = data.link;
        });
}

// Присоединение к игре
function joinGame(gameId) {
    const ws = new WebSocket(`ws://${location.host}?gameId=${gameId}`);

    ws.onmessage = (event) => {
        // Обработка сообщений от других игроков
    };
}
