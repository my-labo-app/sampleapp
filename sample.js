const calendar = document.getElementById("calendar");
const detailDate = document.getElementById("detailDate");
const monthNum = document.getElementById("monthNum");

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth(); // 0始まり
const todayDate = today.getDate();

/* ===== 月表示 ===== */
monthNum.textContent = month + 1;

/* ===== 月の日数計算 ===== */
const firstDay = new Date(year, month, 1).getDay(); // 0=日
const lastDate = new Date(year, month + 1, 0).getDate();

/* ===== カレンダー生成 ===== */
calendar.innerHTML = "";

const startIndex = (firstDay + 6) % 7; // 月曜始まり

// 空白
for (let i = 0; i < startIndex; i++) {
  calendar.appendChild(document.createElement("div"));
}

// 日付
for (let d = 1; d <= lastDate; d++) {
  const div = document.createElement("div");
  div.className = "day";
  div.textContent = d;

  if (d === todayDate) {
    div.classList.add("today");
    updateDetail(d);
  }

  div.addEventListener("click", () => {
    document.querySelectorAll(".day").forEach(el =>
      el.classList.remove("today")
    );
    div.classList.add("today");
    updateDetail(d);
  });

  calendar.appendChild(div);
}

/* ===== 詳細更新 ===== */
function updateDetail(day) {
  const date = new Date(year, month, day);
  const week = ["日","月","火","水","木","金","土"];

  detailDate.textContent =
    `${year}年${month + 1}月${day}日（${week[date.getDay()]}）`;
}