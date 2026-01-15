/* app.js */
let currentView = 'gallery'; // 默认改为画廊视图，因为它是重点
let filteredData = [...songsData];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 默认触发一次画廊视图切换，确保按钮状态正确
    switchView('gallery'); 
    renderTable();
    renderGallery();
    updateCount();
    setupEventListeners();
    createModal();
});

// 设置事件监听器
function setupEventListeners() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view; // 获取 data-view 属性
            // 如果点击的是图标或内部元素，向上查找按钮
            const targetBtn = e.target.closest('.view-btn');
            if(targetBtn) {
                switchView(targetBtn.dataset.view);
            }
        });
    });

    document.getElementById('searchBox').addEventListener('input', filterData);
    document.getElementById('filterImpression').addEventListener('change', filterData);
    document.getElementById('filterType').addEventListener('change', filterData);
}

// 切换视图
function switchView(view) {
    currentView = view;
    
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    document.querySelectorAll('.view-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (view === 'table') {
        document.getElementById('tableView').classList.add('active');
    } else {
        document.getElementById('galleryView').classList.add('active');
    }
}

// 筛选数据
function filterData() {
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    const impressionFilter = document.getElementById('filterImpression').value;
    const typeFilter = document.getElementById('filterType').value;
    
    filteredData = songsData.filter(song => {
        const matchSearch = !searchText || 
            song.songName.toLowerCase().includes(searchText) ||
            song.workName.toLowerCase().includes(searchText) ||
            (song.singer && song.singer.toLowerCase().includes(searchText));
        
        const matchImpression = !impressionFilter || song.impression === impressionFilter;
        const matchType = !typeFilter || song.type === typeFilter;
        
        return matchSearch && matchImpression && matchType;
    });
    
    renderTable();
    renderGallery();
    updateCount();
}

// 渲染表格 (保持基本不变，适配一下图标)
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(song => {
        const row = document.createElement('tr');
        row.onclick = () => showModal(song);
        row.innerHTML = `
            <td>📺 ${song.songName}</td>
            <td>${song.workName}</td>
            <td><span class="impression-badge impression-${song.impression}">${song.impression}</span></td>
            <td>${song.releaseYear}</td>
            <td>${song.singer || '-'}</td>
            <td>${song.type || '-'}</td>
            <td><a href="${song.bilibiliLink}" target="_blank" class="bilibili-link" onclick="event.stopPropagation()">链接</a></td>
        `;
        tbody.appendChild(row);
    });
}

// ★★★ 核心修改：渲染画廊 (Notion 风格) ★★★
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    filteredData.forEach(song => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.onclick = () => showModal(song);
        
        // 简化 B站链接显示
        const shortLink = song.bilibiliLink.replace('https://www.', '').substring(0, 20) + '...';

        card.innerHTML = `
            <img src="${song.cover}" alt="${song.workName}" class="card-cover" onerror="this.src='images/背景.jpg'">
            <div class="card-body">
                <div class="card-title-row">
                    <span class="card-icon">📺</span>
                    <span class="card-title">${song.songName}</span>
                </div>
                
                <div class="card-property" title="作品">
                    <span class="card-property-icon">🎬</span> ${song.workName}
                </div>
                
                <div class="card-property" title="发行时间">
                    <span class="card-property-icon">📅</span> ${song.releaseYear}-01-01
                </div>

                <div class="card-property">
                     <span class="impression-badge impression-${song.impression}">${song.impression}</span>
                </div>

                <div class="card-property">
                    <span class="card-property-icon">🔗</span>
                    <span class="bilibili-text-link">${shortLink}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function updateCount() {
    document.getElementById('totalCount').textContent = filteredData.length;
}

// ★★★ 核心修改：创建弹窗 (Notion 属性列表风格) ★★★
function createModal() {
    // 移除旧弹窗如果存在
    const existingModal = document.getElementById('songModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'songModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img id="modalCover" src="" alt="" class="modal-cover">
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            
            <div class="modal-title-area">
                <div class="modal-icon-large">📺</div>
                <h1 class="modal-title-text" id="modalTitle"></h1>
            </div>

            <div class="modal-body">
                <div class="modal-info">
                    <div class="info-item">
                        <div class="info-label">🔗 B站链接</div>
                        <div class="info-value"><a id="modalLink" href="" target="_blank" class="bilibili-link">点击观看</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🎬 作品名称</div>
                        <div class="info-value" id="modalWork"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🏷️ 印象程度</div>
                        <div class="info-value" id="modalImpression"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📅 发行时间</div>
                        <div class="info-value" id="modalYear"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🎤 歌手</div>
                        <div class="info-value" id="modalSinger"></div>
                    </div>
                     <div class="info-item">
                        <div class="info-label">🎵 类型</div>
                        <div class="info-value" id="modalType"></div>
                    </div>
                </div>

                <div class="modal-description">
                    <h3>作品简介</h3>
                    <p id="modalDescription"></p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function showModal(song) {
    const modal = document.getElementById('songModal');
    if(!modal) createModal();

    document.getElementById('modalCover').src = song.cover;
    document.getElementById('modalTitle').textContent = song.songName;
    
    // 更新链接
    const linkEl = document.getElementById('modalLink');
    linkEl.href = song.bilibiliLink;
    linkEl.textContent = song.bilibiliLink; // 显示完整链接文本

    document.getElementById('modalWork').textContent = song.workName;
    document.getElementById('modalYear').textContent = song.releaseYear + "-01-01";
    document.getElementById('modalSinger').textContent = song.singer || 'Empty';
    document.getElementById('modalType').innerHTML = song.type ? `<span class="type-badge">${song.type}</span>` : 'Empty';
    
    const impressionSpan = `<span class="impression-badge impression-${song.impression}">${song.impression}</span>`;
    document.getElementById('modalImpression').innerHTML = impressionSpan;
    
    document.getElementById('modalDescription').textContent = song.description;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('songModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}