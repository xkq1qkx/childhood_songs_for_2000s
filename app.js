/* app.js */
let currentView = 'table';
let filteredData = [...songsData];

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    renderGallery();
    updateCount();
    setupEventListeners();
    createModal();
});

function setupEventListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchView(e.target.dataset.view));
    });
    document.getElementById('searchBox').addEventListener('input', filterData);
    document.getElementById('filterImpression').addEventListener('change', filterData);
    document.getElementById('filterType').addEventListener('change', filterData);
}

function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
    document.querySelectorAll('.view-content').forEach(content => content.classList.remove('active'));
    document.getElementById(view === 'table' ? 'tableView' : 'galleryView').classList.add('active');
}

function filterData() {
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    const impressionFilter = document.getElementById('filterImpression').value;
    const typeFilter = document.getElementById('filterType').value;

    filteredData = songsData.filter(song => {
        const matchSearch = song.songName.toLowerCase().includes(searchText) || song.workName.toLowerCase().includes(searchText);
        const matchImpression = !impressionFilter || song.impression === impressionFilter;
        const matchType = !typeFilter || song.type === typeFilter;
        return matchSearch && matchImpression && matchType;
    });

    renderTable();
    renderGallery();
    updateCount();
}

// 渲染画廊 - 关键点：使用 song.cover
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    filteredData.forEach(song => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.onclick = () => showModal(song);
        
        card.innerHTML = `
            <img src="${song.cover}" class="card-cover" onerror="this.src='images/背景.jpg'">
            <div class="card-body">
                <div class="card-title">📺 ${song.songName}</div>
                <div class="card-property">
                    <span class="impression-badge impression-${song.impression}">${song.impression}</span>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 8px;">🎬 ${song.workName}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    filteredData.forEach(song => {
        const row = document.createElement('tr');
        row.onclick = () => showModal(song);
        row.innerHTML = `
            <td>📺 <strong>${song.songName}</strong></td>
            <td>${song.workName}</td>
            <td><span class="impression-badge impression-${song.impression}">${song.impression}</span></td>
            <td>${song.releaseYear}</td>
            <td>${song.singer || '-'}</td>
            <td>${song.type || '-'}</td>
            <td><a href="${song.bilibiliLink}" target="_blank" class="bilibili-link" onclick="event.stopPropagation()">🔗</a></td>
        `;
        tbody.appendChild(row);
    });
}

function showModal(song) {
    const modal = document.getElementById('songModal');
    document.getElementById('modalCover').src = song.cover;
    document.getElementById('modalTitle').textContent = song.songName;
    document.getElementById('modalWork').textContent = song.workName;
    document.getElementById('modalYear').textContent = song.releaseYear;
    document.getElementById('modalSinger').textContent = song.singer || '未知';
    document.getElementById('modalImpression').innerHTML = `<span class="impression-badge impression-${song.impression}">${song.impression}</span>`;
    document.getElementById('modalDescription').textContent = song.description || '暂无简介';
    document.getElementById('modalLink').href = song.bilibiliLink;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function createModal() {
    if (document.getElementById('songModal')) return;
    const modal = document.createElement('div');
    modal.id = 'songModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img id="modalCover" src="" class="modal-cover">
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <h1 class="modal-title" id="modalTitle"></h1>
            <div class="modal-body">
                <div class="modal-info">
                    <div class="info-item"><div class="info-label">🎬 作品名称</div><div class="info-value" id="modalWork"></div></div>
                    <div class="info-item"><div class="info-label">📅 发行年份</div><div class="info-value" id="modalYear"></div></div>
                    <div class="info-item"><div class="info-label">🎤 演唱者</div><div class="info-value" id="modalSinger"></div></div>
                    <div class="info-item"><div class="info-label">💡 印象程度</div><div class="info-value" id="modalImpression"></div></div>
                </div>
                <div class="modal-description">
                    <p id="modalDescription"></p>
                </div>
                <div style="margin-top: 20px;">
                    <a id="modalLink" href="" target="_blank" style="color: #00a1d6; text-decoration: none;">🔗 在 BiliBili 观看</a>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeModal() {
    document.getElementById('songModal').classList.remove('active');
    document.body.style.overflow = '';
}

function updateCount() { document.getElementById('totalCount').textContent = filteredData.length; }