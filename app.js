let currentView = 'table';
let filteredData = [...songsData];
let currentSort = 'default';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    renderGallery();
    updateCount();
    setupEventListeners();
    createModal();
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
    
    // 排序
    document.getElementById('sortBy').addEventListener('change', (e) => {
        currentSort = e.target.value;
        sortData();
        renderTable();
        renderGallery();
    });
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
    
    sortData();
    renderTable();
    renderGallery();
    updateCount();
}

// 排序数据
function sortData() {
    switch(currentSort) {
        case 'year-asc':
            filteredData.sort((a, b) => a.releaseYear.localeCompare(b.releaseYear));
            break;
        case 'year-desc':
            filteredData.sort((a, b) => b.releaseYear.localeCompare(a.releaseYear));
            break;
        case 'name-asc':
            filteredData.sort((a, b) => a.songName.localeCompare(b.songName, 'zh-CN'));
            break;
        case 'name-desc':
            filteredData.sort((a, b) => b.songName.localeCompare(a.songName, 'zh-CN'));
            break;
        case 'work-asc':
            filteredData.sort((a, b) => a.workName.localeCompare(b.workName, 'zh-CN'));
            break;
        case 'work-desc':
            filteredData.sort((a, b) => b.workName.localeCompare(a.workName, 'zh-CN'));
            break;
        default:
            // 默认排序：按发行时间
            filteredData.sort((a, b) => a.releaseYear.localeCompare(b.releaseYear));
    }
}

// 渲染表格
function renderTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';
    
    filteredData.forEach(song => {
        const row = document.createElement('tr');
        row.onclick = () => showModal(song);
        row.innerHTML = `
            <td><strong>${song.songName}</strong></td>
            <td>${song.workName}</td>
            <td><span class="impression-badge impression-${song.impression}">${song.impression}</span></td>
            <td>${song.releaseYear}</td>
            <td>${song.singer || '-'}</td>
            <td>${song.type ? `<span class="type-badge type-${song.type}">${song.type}</span>` : '-'}</td>
            <td><a href="${song.bilibiliLink}" target="_blank" class="bilibili-link" onclick="event.stopPropagation()">🔗 观看</a></td>
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
        card.onclick = () => showModal(song);
        
        card.innerHTML = `
            <img src="${song.cover}" alt="${song.workName}" class="card-cover" onerror="this.src='${DEFAULT_COVER}'">
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
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// 更新计数
function updateCount() {
    document.getElementById('totalCount').textContent = filteredData.length;
}

// 创建弹窗
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'songModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <img id="modalCover" src="" alt="" class="modal-cover">
                <h2 class="modal-title" id="modalTitle"></h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="modal-info">
                    <div class="info-item">
                        <div class="info-label">作品名称</div>
                        <div class="info-value" id="modalWork"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">发行时间</div>
                        <div class="info-value" id="modalYear"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">演唱者</div>
                        <div class="info-value" id="modalSinger"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">类型</div>
                        <div class="info-value" id="modalType"></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">印象程度</div>
                        <div class="info-value" id="modalImpression"></div>
                    </div>
                </div>
                <div class="modal-description">
                    <h3>歌曲介绍</h3>
                    <p id="modalDescription"></p>
                </div>
                <div class="modal-actions">
                    <a id="modalLink" href="" target="_blank" class="btn btn-primary">
                        <img src="images/bilibili_icon.png" alt="bilibili" class="btn-icon">前往B站观看
                    </a>
                </div>
                <div class="modal-comments">
                    <h3>💬 大家的感想</h3>
                    <div id="song-comments"></div>
                </div>                
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 点击背景关闭弹窗
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC键关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 显示弹窗
function showModal(song) {
    const modal = document.getElementById('songModal');
    
    document.getElementById('modalCover').src = song.cover;
    document.getElementById('modalTitle').textContent = song.songName;
    document.getElementById('modalWork').textContent = song.workName;
    document.getElementById('modalYear').textContent = song.releaseYear;
    document.getElementById('modalSinger').textContent = song.singer || '未知';
    
    const typeSpan = song.type ? `<span class="type-badge type-${song.type}">${song.type}</span>` : '-';
    document.getElementById('modalType').innerHTML = typeSpan;
    
    const impressionSpan = `<span class="impression-badge impression-${song.impression}">${song.impression}</span>`;
    document.getElementById('modalImpression').innerHTML = impressionSpan;
    
    document.getElementById('modalDescription').textContent = song.description;
    document.getElementById('modalLink').href = song.bilibiliLink;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // 加载该歌曲的评论区
    loadSongComments(song.songName);
}

// 加载歌曲评论
/*
function loadSongComments(songName) {
    const commentsContainer = document.getElementById('song-comments');
    commentsContainer.innerHTML = ''; // 清空之前的评论
    
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'xkq1qkx/childhood_songs_for_2000s'); // 👈 替换这里
    script.setAttribute('data-repo-id', 'R_kgDOQ6oPAA'); // 👈 替换这里
    script.setAttribute('data-category', 'General'); // 或你选择的分类
    script.setAttribute('data-category-id', 'DIC_kwDOQ6oPAM4C1AdC'); // 👈 替换这里
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', `歌曲：${songName}`); // 使用歌曲名作为话题
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'dark');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    
    commentsContainer.appendChild(script);
}
*/
// 关闭弹窗
function closeModal() {
    const modal = document.getElementById('songModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}