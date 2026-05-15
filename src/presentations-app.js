// tjSTAR — presentations-app.js

(function () {
  const searchInput = document.getElementById('searchInput');
  const labFilter = document.getElementById('labFilter');
  const slotPills = document.getElementById('slotPills');
  const clearBtn = document.getElementById('clearBtn');
  const resultCount = document.getElementById('resultCount');
  const presList = document.getElementById('presList');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

  const labs = [...new Set(PRESENTATIONS.flatMap(p => p.labs))].sort();
  labs.forEach(lab => {
    const opt = document.createElement('option');
    opt.value = lab;
    opt.textContent = lab;
    labFilter.appendChild(opt);
  });

  const slots = [...new Set(PRESENTATIONS.map(p => p.timeSlot.charAt(0)))].sort();
  slots.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'slot-pill';
    btn.dataset.slot = s;
    const slotTimes = { A: '10:00–10:45', B: '10:55–11:40', C: '11:50–12:35' };
    btn.textContent = `${s} ${slotTimes[s] || ''}`;
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      render();
    });
    slotPills.appendChild(btn);
  });

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 200);
  });
  labFilter.addEventListener('change', render);
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    labFilter.value = '';
    slotPills.querySelectorAll('.slot-pill').forEach(b => b.classList.remove('active'));
    render();
  });

  function getFiltered() {
    const q = searchInput.value.toLowerCase().trim();
    const lab = labFilter.value;
    const activeSlots = [...slotPills.querySelectorAll('.slot-pill.active')].map(b => b.dataset.slot);

    const roomMatch = q.match(/^(?:room|rm)\s*(.+)$/i);

    return PRESENTATIONS.filter(p => {
      if (q) {
        if (roomMatch) {
          const roomQuery = roomMatch[1].trim().toLowerCase();
          if (!p.room || !p.room.toLowerCase().includes(roomQuery)) return false;
        } else {
          const searchable = [p.title, p.abstract, ...p.authors, p.room, p.labDirector, ...p.labs].join(' ').toLowerCase();
          if (!searchable.includes(q)) return false;
        }
      }
      if (lab && !p.labs.includes(lab)) return false;
      if (activeSlots.length > 0 && !activeSlots.includes(p.timeSlot.charAt(0))) return false;
      return true;
    });
  }

  function render() {
    const filtered = getFiltered();
    const hasFilters = searchInput.value || labFilter.value || slotPills.querySelector('.active');
    clearBtn.classList.toggle('show', !!hasFilters);
    resultCount.textContent = `${filtered.length} of ${PRESENTATIONS.length}`;

    if (filtered.length === 0) {
      presList.innerHTML = `
        <div class="empty-state">
          <h3>No presentations found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>`;
      return;
    }

    presList.innerHTML = filtered.map(p => `
      <div class="pres-card" data-id="${p.id}">
        <div class="pres-card__room">
          <span>Rm</span>
          <strong>${p.room || '—'}</strong>
        </div>
        <div class="pres-card__body">
          <h3>${escapeHtml(p.title)}</h3>
          <div class="pres-card__meta">
            ${p.labs.map(l => `<span class="badge">${escapeHtml(l)}</span>`).join('')}
            <span class="badge badge--slot">${escapeHtml(p.timeSlot)}</span>
          </div>
          <div class="pres-card__authors">${p.authors.map(escapeHtml).join(', ')}</div>
        </div>
        <div class="pres-card__arrow">→</div>
      </div>
    `).join('');

    presList.querySelectorAll('.pres-card').forEach(card => {
      card.addEventListener('click', () => openModal(card.dataset.id));
    });
  }

  function openModal(id) {
    const p = PRESENTATIONS.find(x => x.id === id);
    if (!p) return;
    modalContent.innerHTML = `
      <button class="modal-close" id="modalClose">&times;</button>
      <h2>${escapeHtml(p.title)}</h2>
      <div class="pres-card__meta" style="margin-bottom:1.2rem;">
        ${p.labs.map(l => `<span class="badge">${escapeHtml(l)}</span>`).join('')}
        <span class="badge badge--slot">${escapeHtml(p.timeSlot)}</span>
      </div>
      <div class="modal-field">
        <strong>Authors</strong>
        <p>${p.authors.map(escapeHtml).join('<br>')}</p>
      </div>
      ${p.labDirector ? `<div class="modal-field"><strong>Lab Director</strong><p>${escapeHtml(p.labDirector)}</p></div>` : ''}
      ${p.room ? `<div class="modal-field"><strong>Room</strong><p>${escapeHtml(p.room)}</p></div>` : ''}
      ${p.abstract ? `<div class="modal-field"><strong>Abstract</strong><p>${escapeHtml(p.abstract)}</p></div>` : ''}
    `;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').addEventListener('click', closeModal);
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  render();
})();
