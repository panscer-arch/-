export const crmManagers = [
  { id: "jp", initials: "JP", name: "Jean Paul", status: "online", role: "Ops lead" },
  { id: "ks", initials: "KS", name: "Ksenia", status: "online", role: "Support" },
  { id: "br", initials: "BR", name: "Boris", status: "offline", role: "Finance" },
  { id: "am", initials: "AM", name: "Amina", status: "online", role: "Growth" },
];

export const projectStats = {
  startedAt: "2026-02-18T09:00:00+03:00",
  connectedWallets: 12846,
  activeCycles: 3418,
  pool: 1845200,
  incomingToday: 76400,
  poolByDay: [
    { label: "Пн", value: 1420000 },
    { label: "Вт", value: 1518000 },
    { label: "Ср", value: 1604000 },
    { label: "Чт", value: 1672000 },
    { label: "Пт", value: 1763000 },
    { label: "Сб", value: 1819000 },
    { label: "Вс", value: 1845200 },
  ],
  poolByWeek: [
    { label: "W12", value: 980000 },
    { label: "W13", value: 1120000 },
    { label: "W14", value: 1286000 },
    { label: "W15", value: 1511000 },
    { label: "W16", value: 1697000 },
    { label: "W17", value: 1845200 },
  ],
};

export const incomingSummary = {
  today: 76400,
  yesterday: 58900,
  week: 318500,
};

export const outgoingSummary = {
  today: 41200,
  yesterday: 33600,
  lastHour: 7400,
};

export const incomingTransactions = [
  { wallet: "0x8F21...A91C", amount: 12400, time: "14:42", status: "confirmed" },
  { wallet: "0xC114...79B0", amount: 8900, time: "14:36", status: "confirmed" },
  { wallet: "0x11AF...D620", amount: 5100, time: "14:29", status: "pending" },
  { wallet: "0xE41D...0CC3", amount: 17600, time: "14:17", status: "confirmed" },
  { wallet: "0x52C0...F102", amount: 3200, time: "14:05", status: "failed" },
];

export const outgoingTransactions = [
  { wallet: "0xA712...91F1", amount: 7400, time: "14:50", status: "sent" },
  { wallet: "0xF18A...331A", amount: 11200, time: "14:31", status: "sent" },
  { wallet: "0x918C...A9B5", amount: 6400, time: "13:58", status: "pending" },
  { wallet: "0x21EE...40A7", amount: 9200, time: "13:24", status: "sent" },
];

export const ticketStats = [
  { label: "Новые", value: 18, tone: "hot" },
  { label: "В работе", value: 27, tone: "warning" },
  { label: "Обработанные", value: 146, tone: "good" },
];

export const libraryItems = [
  { title: "Smart contract payout rules", type: "Документ", updated: "сегодня" },
  { title: "Регламент подключения кошельков", type: "Инструкция", updated: "вчера" },
  { title: "FAQ для операторов поддержки", type: "Заметка", updated: "2 дня назад" },
];

export const initialTasks = {
  new: [
    { id: "t1", title: "Проверить цепочку welcome-писем", owner: "AM", priority: "high" },
    { id: "t2", title: "Сверить список pending выплат", owner: "BR", priority: "medium" },
  ],
  progress: [
    { id: "t3", title: "Подготовить скрипт ответа по KYC", owner: "KS", priority: "medium" },
    { id: "t4", title: "Обновить описание инвест-цикла", owner: "JP", priority: "low" },
  ],
  done: [{ id: "t5", title: "Закрыть отчет по пулу за неделю", owner: "BR", priority: "low" }],
};

export const chatMessages = [
  { author: "JP", time: "14:45", text: "Пул растет ровно, смотрим pending исходящие до 15:00." },
  { author: "KS", time: "14:47", text: "В тикетах 5 вопросов по циклу, беру шаблон ответа из библиотеки." },
  { author: "AM", time: "14:51", text: "Маркетинг-кампания дает +18% к подключенным кошелькам." },
];
