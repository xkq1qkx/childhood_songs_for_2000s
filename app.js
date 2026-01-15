let currentView = 'table';
let filteredData = [...songsData];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    renderGallery();
    updateCount();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    // 视图切换
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });

    // 搜索
    document.getElementById('searchBox').addEventListener('input', filterData);
    
    // 筛选器
    document.getElementById('filterImpression').addEventListener('change', filterData);
    document.getElementById('filterType').addEventListener('change', filterData);
}

// 切换视图
function switchView(view) {
    currentView = view;
    
    // 更新按钮状态
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // 更新视图显示
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

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(song => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${song.songName}</strong></td>
            <td>${song.workName}</td>
            <td><span class="impression-badge impression-${song.impression}">${song.impression}</span></td>
            <td>${song.releaseYear}</td>
            <td>${song.singer || '-'}</td>
            <td>${song.type ? `<span class="type-badge type-${song.type}">${song.type}</span>` : '-'}</td>
            <td><a href="${song.bilibiliLink}" target="_blank" class="bilibili-link">🔗 观看</a></td>
        `;
        tbody.appendChild(row);
    });
}

// 渲染画廊
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    
    filteredData.forEach(song => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.onclick = () => window.open(song.bilibiliLink, '_blank');
        
        card.innerHTML = `
            <div class="card-header">
                ${song.songName}
            </div>
            <div class="card-body">
                <div class="card-field">
                    <div class="card-label">作品名称</div>
                    <div class="card-value">${song.workName}</div>
                </div>
                <div class="card-field">
                    <div class="card-label">发行时间</div>
                    <div class="card-value">${song.releaseYear}</div>
                </div>
                <div class="card-field">
                    <div class="card-label">印象程度</div>
                    <div class="card-value">
                        <span class="impression-badge impression-${song.impression}">${song.impression}</span>
                    </div>
                </div>
                ${song.singer ? `
                <div class="card-field">
                    <div class="card-label">歌手</div>
                    <div class="card-value">${song.singer}</div>
                </div>
                ` : ''}
                ${song.type ? `
                <div class="card-field">
                    <div class="card-label">类型</div>
                    <div class="card-value">
                        <span class="type-badge type-${song.type}">${song.type}</span>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// 更新计数
function updateCount() {
    document.getElementById('totalCount').textContent = filteredData.length;
}