document.addEventListener("DOMContentLoaded", () => {

  /* ===== 基本参照 ===== */
  const today = new Date();

  const scrollContainer = document.getElementById("calendar-scroll");
  const headerMonth = document.getElementById("header-month");
  const picker = document.getElementById("month-picker");

  const bottomSheet = document.getElementById("bottomSheet");
  const selectedDate = document.getElementById("selectedDate");

/* ===== 予定管理 ===== */
const events = {};
let selectedKey = "";

const viewMode = document.getElementById("view-mode");
const addMode = document.getElementById("add-mode");
const eventList = document.getElementById("event-list");
const noEvent = document.getElementById("no-event");

const addBtn = document.getElementById("add-btn");
const eventTitle = document.getElementById("event-title");
const saveBtn = document.getElementById("save-event");

  /* ===== 定数 ===== */
  const START_YEAR = 2025;
  const END_YEAR = 2040;

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const rokuyo = ["大安","赤口","先勝","友引","先負","仏滅"];

  /* ===== ヘッダー更新 ===== */
  function updateHeader(year, month) {
    headerMonth.textContent = `${year} ${monthNames[month]}`;
  }
  
  /* ===== Todayへ戻るボタン ===== */
  document.getElementById("go-today").addEventListener("click", () => {
  const todayIndex =
    (today.getFullYear() - START_YEAR) * 12 + today.getMonth();

  scrollContainer.scrollTo({
    left: window.innerWidth * todayIndex,
    behavior: "smooth"
  });

  updateHeader(today.getFullYear(), today.getMonth());
});

  /* ===== month picker ===== */
  document.getElementById("open-picker").addEventListener("click", () => {
    picker.focus();
  });

  picker.addEventListener("input", () => {
    const [y, m] = picker.value.split("-");
    const target = document.querySelector(
      `.calendar-container[data-year="${y}"][data-month="${Number(m)}"]`
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
    updateHeader(Number(y), Number(m) - 1);
  });

/* ===== 中央検索モーダル ===== */
const openSearch = document.getElementById("open-search");
const searchModal = document.getElementById("search-modal");
const centerSearch = document.getElementById("center-search");

openSearch.addEventListener("click", () => {
  searchModal.classList.add("active");
  centerSearch.focus();
});

/* 背景タップで閉じる */
searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    searchModal.classList.remove("active");
    centerSearch.value = "";
  }
});

/* 入力検知 */
centerSearch.addEventListener("input", () => {
  const keyword = centerSearch.value;
  console.log("検索:", keyword);
});

  /* ===== カレンダー描画 ===== */
  function renderCalendar(year, month) {

    const container = document.createElement("div");
    container.className = "calendar-container";
    container.dataset.year = year;
    container.dataset.month = month + 1;

    /* 曜日 */
    const weekdays = document.createElement("div");
    weekdays.className = "weekdays";

    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].forEach((d, i) => {
      const div = document.createElement("div");
      div.textContent = d;
      if (i === 5) div.className = "sat";
      if (i === 6) div.className = "sun";
      weekdays.appendChild(div);
    });

    container.appendChild(weekdays);

    /* カレンダー本体 */
    const cal = document.createElement("div");
    cal.className = "calendar";

    const firstDay = new Date(year, month, 1).getDay();
    const startIndex = (firstDay + 6) % 7;
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    /* 前月 */
    for (let i = startIndex; i > 0; i--) {
      cal.appendChild(createOtherCell(prevLastDate - i + 1));
    }

    /* 今月 */
    for (let day = 1; day <= lastDate; day++) {

      const cell = document.createElement("div");

      const isToday =
        year === today.getFullYear() &&
        month === today.getMonth() &&
        day === today.getDate();

      if (isToday) cell.classList.add("today");

      const d = document.createElement("div");
      d.className = "date";
      d.textContent = day;

      const r = document.createElement("div");
      r.className = "rokuyo";

      const startDate = new Date(year, 0, 1);
      const currentDate = new Date(year, month, day);
      const diffDays = Math.floor(
        (currentDate - startDate) / 86400000
      );

      r.textContent = rokuyo[diffDays % 6];

      cell.addEventListener("click", () => {
  const key = `${year}-${month + 1}-${day}`;
  openView(key, `${month + 1}月${day}日`);
});
      
      cell.appendChild(d);
      cell.appendChild(r);
      cal.appendChild(cell);
    }

    /* 翌月（42マス） */
    let nextDay = 1;

while (cal.children.length < 42) {
  cal.appendChild(createOtherCell(nextDay));
  nextDay++;
}

    container.appendChild(cal);
    scrollContainer.appendChild(container);
  }

  function createOtherCell(num) {
    const cell = document.createElement("div");
    cell.className = "other-month";

    const d = document.createElement("div");
    d.className = "date";
    d.textContent = num;

    cell.appendChild(d);
    return cell;
  }

function renderEvents(dateKey) {
  eventList.innerHTML = "";

  if (!events[dateKey] || events[dateKey].length === 0) {
    noEvent.style.display = "block";
    return;
  }

  noEvent.style.display = "none";

  events[dateKey].forEach(title => {
    const div = document.createElement("div");
    div.textContent = title;
    eventList.appendChild(div);
  });
}

  /* ===== 全月生成 ===== */
  for (let y = START_YEAR; y <= END_YEAR; y++) {
    for (let m = 0; m < 12; m++) {
      renderCalendar(y, m);
    }
  }

  /* ===== 初期位置（今日の月へ） ===== */
  const initialIndex =
    (today.getFullYear() - START_YEAR) * 12 + today.getMonth();

  scrollContainer.scrollLeft = window.innerWidth * initialIndex;
  updateHeader(today.getFullYear(), today.getMonth());

  /* ===== スクロール連動ヘッダー ===== */
  scrollContainer.addEventListener("scroll", () => {
    const index = Math.round(
      scrollContainer.scrollLeft / window.innerWidth
    );

    const year = START_YEAR + Math.floor(index / 12);
    const month = index % 12;

    updateHeader(year, month);
  });

/* ===== Bottom Sheet ===== */
let startY = 0;
let currentY = 0;
let isDragging = false;

function openView(dateKey, label) {
  selectedKey = dateKey;
  selectedDate.textContent = label;

  viewMode.style.display = "block";
  addMode.style.display = "none";

  renderEvents(dateKey);
  bottomSheet.classList.add("active");
}

addBtn.addEventListener("click", () => {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();

  selectedKey = `${y}-${m}-${d}`;
  selectedDate.textContent = `${m}月${d}日`;

  viewMode.style.display = "none";
  addMode.style.display = "block";

  eventTitle.value = "";
  bottomSheet.classList.add("active");
});

saveBtn.addEventListener("click", () => {
  const title = eventTitle.value.trim();
  if (!title) return;

  if (!events[selectedKey]) {
    events[selectedKey] = [];
  }

  events[selectedKey].push(title);

  eventTitle.value = "";

  openView(selectedKey, selectedDate.textContent);
});

/* タッチ開始 */
bottomSheet.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
  isDragging = true;
});

/* スワイプ中 */
bottomSheet.addEventListener("touchmove", (e) => {
  if (!isDragging) return;

  currentY = e.touches[0].clientY;
  const diff = currentY - startY;

  if (diff > 0) {
    bottomSheet.style.transform = `translateY(${diff}px)`;
  }
});

/* 指を離した */
bottomSheet.addEventListener("touchend", () => {
  isDragging = false;

  if (currentY - startY > 120) {
    bottomSheet.classList.remove("active");
  }

  bottomSheet.style.transform = "";
  startY = 0;
  currentY = 0;
});

});