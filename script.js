document.addEventListener('DOMContentLoaded', () => {
    // Зчитуємо єдину базу даних з localStorage
    const savedDB = localStorage.getItem('aix_db');
    if (!savedDB) return;

    const db = JSON.parse(savedDB);

    // 1. Оновлюємо шапку табла
    const titleElement = document.querySelector('header h1');
    if (titleElement && db.config.name) {
        titleElement.innerText = `АІКС «ВИБОРИ» • ${db.config.name}`;
    }

    const statusBadge = document.getElementById('campaign-status');
    if (statusBadge) {
        statusBadge.innerText = `ОПРАЦЬОВАНО ПРОТОКОЛІВ ПО КРАЇНІ: ${db.protocols.globalPercent || '0.00'}%`;
    }

    // 2. Рендеримо результати кандидатів у лівій колонці табло
    const infoPanel = document.getElementById('public-results-container');
    if (infoPanel) {
        if (db.candidates.length === 0) {
            infoPanel.innerHTML = '<div class="empty-state">НЕМАЄ ЗАРЕЄСТРОВАНИХ КАНДИДАТІВ ТА ПРОТОКОЛІВ</div>';
        } else {
            let html = '<h3 style="color: #FFFF00; margin-bottom: 15px; border-bottom: 2px solid #00FFFF; padding-bottom: 5px;">РЕЙТИНГ СУБ'ЄКТІВ</h3>';
            db.candidates.forEach(c => {
                html += `
                    <div style="background: #000c24; border: 2px solid #00FFFF; padding: 12px; margin-bottom: 10px;">
                        <div style="display: flex; justify-content: space-between; font-weight: bold; margin-bottom: 5px;">
                            <span>${c.name}</span>
                            <span style="color: #FFFF00;">${c.percent}%</span>
                        </div>
                        <div style="font-size: 0.8rem; color: #00FFFF; margin-bottom: 8px;">${c.party} (${c.votes} голосів)</div>
                        <div style="width: 100%; background: #002060; height: 16px; border: 1px solid #00FFFF;">
                            <div style="width: ${c.percent}%; background: ${c.color === 'leader-zelensky' ? '#00FF00' : (c.color === 'leader-poroshenko' ? '#FF0000' : '#00FFFF')}; height: 100%;"></div>
                        </div>
                    </div>
                `;
            });
            infoPanel.innerHTML = html;
        }
    }

    // 3. Фарбуємо SVG-карту на основі регіональних даних Модуля Г
    if (db.regions) {
        for (const regId in db.regions) {
            const regionElement = document.getElementById(regId);
            const regInfo = db.regions[regId];

            if (regionElement && regInfo) {
                regionElement.setAttribute('data-leader', regInfo.leader);
                regionElement.setAttribute('data-percent', regInfo.percent);

                regionElement.classList.remove('leader-zelensky', 'leader-poroshenko', 'leader-blue');
                if (regInfo.leader) {
                    regionElement.classList.add(regInfo.leader);
                }
            }
        }
    }
});
