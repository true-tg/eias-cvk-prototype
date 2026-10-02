document.addEventListener('DOMContentLoaded', () => {
    // 1. Завантажуємо збережені дані з пам'яті браузера (localStorage)
    const savedDataJSON = localStorage.getItem('aix_election_data');
    
    if (savedDataJSON) {
        const data = JSON.parse(savedDataJSON);

        // Оновлюємо назву кампанії на публічному табло, якщо вона там є
        const titleElement = document.querySelector('header h1');
        if (titleElement && data.name) {
            titleElement.innerText = `АІКС «ВИБОРИ» • ${data.name}`;
        }

        // Оновлюємо статус-бейдж (показуємо відсоток опрацьованих протоколів)
        const statusBadge = document.getElementById('campaign-status');
        if (statusBadge && data.percent) {
            statusBadge.innerText = `Опрацьовано протоколів: ${data.percent}%`;
        }

        // 2. Тестова логіка для карти (фарбуємо регіони на основі вибору в адмінці)
        if (data.testLeader) {
            const regions = document.querySelectorAll('.region');
            regions.forEach(region => {
                // Оновлюємо дата-атрибути
                region.setAttribute('data-leader', data.testLeader === 'zelensky' ? 'В. Зеленський' : 'П. Порошенко');
                region.setAttribute('data-percent', data.percent || '0.00');

                // Очищаємо старі класи кольорів
                region.classList.remove('leader-zelensky', 'leader-poroshenko');

                // Додаємо новий клас залежно від лідера
                if (data.testLeader === 'zelensky') {
                    region.classList.add('leader-zelensky');
                } else if (data.testLeader === 'poroshenko') {
                    region.classList.add('leader-poroshenko');
                }
            });
        }
    }

    // 3. Інтерактивна логіка для спливаючого вікна (Tooltip) на карті
    const tooltip = document.getElementById('map-tooltip');
    const regions = document.querySelectorAll('.region');

    if (tooltip && regions.length > 0) {
        regions.forEach(region => {
            region.addEventListener('mousemove', (e) => {
                const name = region.getAttribute('data-name');
                const leader = region.getAttribute('data-leader') || 'Немає даних';
                const percent = region.getAttribute('data-percent') || '0.00';
                
                tooltip.innerHTML = `
                    <strong>${name}</strong><br/>
                    Лідер: ${leader}<br/>
                    Результат: <span style="color:#38bdf8; font-weight:bold;">${percent}%</span>
                `;
                
                tooltip.style.display = 'block';
                tooltip.style.left = (e.pageX + 15) + 'px';
                tooltip.style.top = (e.pageY - 60) + 'px';
            });

            region.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }
});
