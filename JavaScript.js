const calendar = document.getElementById('calendar');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalDay = document.getElementById('modalDay');
const reminderInput = document.getElementById('reminder');
const commentInput = document.getElementById('comment');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const title = document.getElementById('title');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectedDay = null;

// Atualiza o título do calendário
function updateTitle() {
    title.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Busca lembrete do localStorage
function getReminder(year, month, day) {
    return JSON.parse(localStorage.getItem(`reminder-${year}-${month}-${day}`) || '{}');
}

// Salva lembrete no localStorage
function saveReminder(year, month, day, reminder, comment) {
    localStorage.setItem(`reminder-${year}-${month}-${day}`, JSON.stringify({reminder, comment}));
}

// Apaga lembrete do localStorage
function deleteReminder(year, month, day) {
    localStorage.removeItem(`reminder-${year}-${month}-${day}`);
}

// Renderiza o calendário
function renderCalendar() {
    updateTitle();
    calendar.innerHTML = '';
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        // Hoje
        const isToday = (
            d === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        );
        if (isToday) dayDiv.classList.add('today');

        // Passado
        const isPast = (
            currentYear < today.getFullYear() ||
            (currentYear === today.getFullYear() && currentMonth < today.getMonth()) ||
            (currentYear === today.getFullYear() && currentMonth === today.getMonth() && d < today.getDate())
        );
        if (isPast) dayDiv.classList.add('past');

        // Tem lembrete
        if (getReminder(currentYear, currentMonth, d).reminder) {
            dayDiv.classList.add('has-reminder');
        }

        dayDiv.textContent = d;
        dayDiv.onclick = () => openModal(d);
        calendar.appendChild(dayDiv);
    }
}

// Abre o modal para adicionar/editar lembrete
function openModal(day) {
    selectedDay = day;
    modalDay.textContent = `Dia ${day}`;
    const data = getReminder(currentYear, currentMonth, day);
    reminderInput.value = data.reminder || '';
    commentInput.value = data.comment || '';
    modal.style.display = 'flex';
}

// Fecha o modal
closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

// Salva lembrete
saveBtn.onclick = () => {
    saveReminder(currentYear, currentMonth, selectedDay, reminderInput.value, commentInput.value);
    modal.style.display = 'none';
    renderCalendar();
};

// Apaga lembrete
deleteBtn.onclick = () => {
    deleteReminder(currentYear, currentMonth, selectedDay);
    modal.style.display = 'none';
    renderCalendar();
};

// Navegação de meses
prevMonthBtn.onclick = () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
};

nextMonthBtn.onclick = () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
};

// Inicialização
renderCalendar();
