import { useEffect, useState } from "react";
import {
  chatMessages,
  crmManagers,
  incomingSummary,
  incomingTransactions,
  initialTasks,
  libraryItems,
  outgoingSummary,
  outgoingTransactions,
  projectStats,
  ticketStats,
} from "./mockData";
import "./web3-dashboard.css";

const navItems = ["Пользователи", "Маркетинг", "Аналитика", "Налить"];
const taskColumns = [
  { id: "new", title: "Новые" },
  { id: "progress", title: "В работе" },
  { id: "done", title: "Завершено" },
];

function formatCurrency(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function getProjectDays(startedAt) {
  const start = new Date(startedAt).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - start) / 86400000) + 1);
}

function StatCard({ label, value, hint, tone = "default" }) {
  return (
    <article className={`wd-card wd-stat wd-stat-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </article>
  );
}

function TransactionFeed({ title, summary, items, direction }) {
  const summaryItems =
    direction === "incoming"
      ? [
          ["Сегодня", summary.today],
          ["Вчера", summary.yesterday],
          ["Неделя", summary.week],
        ]
      : [
          ["Сегодня", summary.today],
          ["Вчера", summary.yesterday],
          ["Последний час", summary.lastHour],
        ];

  return (
    <section className="wd-card wd-feed">
      <div className="wd-section-head">
        <div>
          <h2>{title}</h2>
          <p>Live-лента по кошелькам и статусам смарт-контракта.</p>
        </div>
        <span className={`wd-live wd-live-${direction}`}>live</span>
      </div>

      <div className="wd-mini-grid">
        {summaryItems.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{formatCurrency(value)}</strong>
          </div>
        ))}
      </div>

      <div className="wd-transaction-list">
        {items.map((item) => (
          <div className="wd-transaction" key={`${item.wallet}-${item.time}`}>
            <div>
              <strong>{item.wallet}</strong>
              <span>{item.time}</span>
            </div>
            <div>
              <strong>{formatCurrency(item.amount)}</strong>
              <span className={`wd-status wd-status-${item.status}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TasksBoard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [taskTitle, setTaskTitle] = useState("");
  const [owner, setOwner] = useState("JP");

  function addTask(event) {
    event.preventDefault();
    const title = taskTitle.trim();
    if (!title) return;

    setTasks((current) => ({
      ...current,
      new: [{ id: `t-${Date.now()}`, title, owner, priority: "medium" }, ...current.new],
    }));
    setTaskTitle("");
  }

  function moveTask(task, fromColumn, toColumn) {
    if (fromColumn === toColumn) return;

    setTasks((current) => ({
      ...current,
      [fromColumn]: current[fromColumn].filter((item) => item.id !== task.id),
      [toColumn]: [task, ...current[toColumn]],
    }));
  }

  return (
    <section className="wd-card wd-tasks">
      <div className="wd-section-head">
        <div>
          <h2>Trello-задачи</h2>
          <p>Внутренняя доска для JP, KS, BR и AM.</p>
        </div>
      </div>

      <form className="wd-task-form" onSubmit={addTask}>
        <input
          aria-label="Название задачи"
          placeholder="Новая задача"
          value={taskTitle}
          onChange={(event) => setTaskTitle(event.target.value)}
        />
        <select aria-label="Исполнитель" value={owner} onChange={(event) => setOwner(event.target.value)}>
          {crmManagers.map((manager) => (
            <option key={manager.id}>{manager.initials}</option>
          ))}
        </select>
        <button type="submit">Создать</button>
      </form>

      <div className="wd-task-columns">
        {taskColumns.map((column) => (
          <div className="wd-task-column" key={column.id}>
            <h3>{column.title}</h3>
            {tasks[column.id].map((task) => (
              <article className="wd-task" key={task.id}>
                <strong>{task.title}</strong>
                <div>
                  <span>{task.owner}</span>
                  <span>{task.priority}</span>
                </div>
                <select
                  aria-label={`Перенести задачу ${task.title}`}
                  value={column.id}
                  onChange={(event) => moveTask(task, column.id, event.target.value)}
                >
                  {taskColumns.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function LibraryPanel() {
  const [query, setQuery] = useState("");
  const filteredItems = libraryItems.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="wd-card wd-library">
      <div className="wd-section-head">
        <div>
          <h2>Библиотека проекта</h2>
          <p>Документы, инструкции, заметки и важные данные.</p>
        </div>
      </div>
      <input
        aria-label="Поиск по библиотеке"
        placeholder="Поиск по библиотеке"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div className="wd-library-list">
        {filteredItems.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <span>
              {item.type} · обновлено {item.updated}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

function Web3Dashboard() {
  const [poolPeriod, setPoolPeriod] = useState("day");
  const [activeNav, setActiveNav] = useState("Аналитика");
  const [activeHub, setActiveHub] = useState("tickets");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const poolData = poolPeriod === "day" ? projectStats.poolByDay : projectStats.poolByWeek;
  const maxPoolValue = Math.max(...poolData.map((item) => item.value));
  const currentDate = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const currentTime = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const onlineManagers = crmManagers.filter((manager) => manager.status === "online").length;
  const hubBlocks = [
    {
      id: "tickets",
      title: "Тикеты",
      code: "TIK",
      value: ticketStats.reduce((sum, item) => sum + item.value, 0),
      text: "новые, в работе, обработанные",
    },
    {
      id: "library",
      title: "Библиотека",
      code: "БИБЛ",
      value: libraryItems.length,
      text: "доки, инструкции, заметки",
    },
    {
      id: "tasks",
      title: "Trello",
      code: "TR",
      value: Object.values(initialTasks).flat().length,
      text: "новые, в работе, завершено",
    },
    {
      id: "chat",
      title: "Чат",
      code: "ЧАТ",
      value: chatMessages.length,
      text: "групповой канал управляющих",
    },
  ];
  const activeHubBlock = hubBlocks.find((block) => block.id === activeHub) ?? hubBlocks[0];
  const activeHubPreview = {
    tickets: ticketStats.map((ticket) => `${ticket.label}: ${ticket.value}`),
    library: libraryItems.map((item) => item.title),
    tasks: Object.values(initialTasks)
      .flat()
      .slice(0, 3)
      .map((task) => `${task.owner}: ${task.title}`),
    chat: chatMessages.map((message) => `${message.author}: ${message.text}`),
  }[activeHub];

  return (
    <main className="web3-dashboard">
      <aside className="wd-sidebar">
        <div className="wd-brand">
          <span>LC</span>
          <div>
            <strong>Lifecoding CRM</strong>
            <small>Web3 command center</small>
          </div>
        </div>
        <nav aria-label="Разделы CRM">
          {navItems.map((item) => (
            <button
              className={activeNav === item ? "active" : ""}
              type="button"
              key={item}
              onClick={() => setActiveNav(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <section className="wd-main">
        <section className="wd-command-frame">
          <header className="wd-system-row">
            <button className="wd-menu-mark" type="button" aria-label="Открыть меню">
              <span />
              <span />
              <span />
            </button>
            <div className="wd-system-date">
              <strong>{currentDate}</strong>
              <span>{getProjectDays(projectStats.startedAt)} дней системы</span>
            </div>
            <div className="wd-system-time">{currentTime}</div>
            <div className="wd-system-managers" aria-label="Управляющие CRM">
              {crmManagers.map((manager) => (
                <span className={manager.status} key={manager.id}>
                  {manager.initials}
                </span>
              ))}
            </div>
          </header>

          <section className="wd-command-metrics" aria-label="Главные показатели проекта">
            <div>
              <span>Всего подключено</span>
              <strong>{formatNumber(projectStats.connectedWallets)}</strong>
            </div>
            <div>
              <span>Цикл / инвестиция</span>
              <strong>{formatNumber(projectStats.activeCycles)}</strong>
            </div>
            <div>
              <span>В пуле</span>
              <strong>{formatCurrency(projectStats.pool)}</strong>
            </div>
          </section>

          <section className="wd-money-row" aria-label="Входящие и исходящие деньги">
            <article className="wd-money-card wd-money-in">
              <span>Вх</span>
              <strong>{formatCurrency(incomingSummary.today)}</strong>
              <small>сегодня</small>
            </article>
            <article className="wd-money-card wd-money-out">
              <span>Ис</span>
              <strong>{formatCurrency(outgoingSummary.today)}</strong>
              <small>сегодня</small>
            </article>
          </section>

          <section className="wd-command-workspace">
            <div className="wd-hub-blocks" aria-label="Рабочие блоки CRM">
              {hubBlocks.map((block) => (
                <button
                  className={`wd-hub-block ${activeHub === block.id ? "active" : ""}`}
                  type="button"
                  key={block.title}
                  onClick={() => setActiveHub(block.id)}
                >
                  <span>{block.code}</span>
                  <strong>{block.title}</strong>
                  <em>{block.value}</em>
                  <small>{block.text}</small>
                </button>
              ))}
            </div>

            <aside className="wd-hub-preview">
              <div>
                <span>Открыт блок</span>
                <strong>{activeHubBlock.title}</strong>
                <small>{activeHubBlock.text}</small>
              </div>
              <ul>
                {activeHubPreview.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </section>
        </section>

        <header className="wd-topbar wd-card">
          <div>
            <h1>Операционная детализация</h1>
            <p>
              {activeNav}: онлайн {onlineManagers}/4, транзакции, тикеты, задачи и чат.
            </p>
          </div>
          <div className="wd-clock">
            <span>{currentDate}</span>
            <strong>{currentTime}</strong>
            <small>{getProjectDays(projectStats.startedAt)} дней в работе</small>
          </div>
        </header>

        <section className="wd-managers" aria-label="Управляющие CRM">
          {crmManagers.map((manager) => (
            <article className="wd-card wd-manager" key={manager.id}>
              <span className={`wd-avatar wd-avatar-${manager.status}`}>{manager.initials}</span>
              <div>
                <strong>{manager.name}</strong>
                <small>{manager.role}</small>
              </div>
              <em>{manager.status === "online" ? "онлайн" : "офлайн"}</em>
            </article>
          ))}
        </section>

        <section className="wd-stats-grid">
          <StatCard label="Подключено кошельков" value={formatNumber(projectStats.connectedWallets)} hint="+428 за неделю" />
          <StatCard label="Создали цикл / инвестицию" value={formatNumber(projectStats.activeCycles)} hint="26,6% от кошельков" tone="accent" />
          <StatCard label="Деньги в пуле" value={formatCurrency(projectStats.pool)} hint="текущий smart-contract pool" tone="good" />
          <StatCard label="Пришло сегодня" value={formatCurrency(projectStats.incomingToday)} hint="обновляется live" tone="hot" />
        </section>

        <section className="wd-card wd-pool">
          <div className="wd-section-head">
            <div>
              <h2>Пул проекта</h2>
              <p>Переключение по дням и неделям заложено под будущий API.</p>
            </div>
            <div className="wd-segmented" role="group" aria-label="Период пула">
              <button className={poolPeriod === "day" ? "active" : ""} type="button" onClick={() => setPoolPeriod("day")}>
                Дни
              </button>
              <button className={poolPeriod === "week" ? "active" : ""} type="button" onClick={() => setPoolPeriod("week")}>
                Недели
              </button>
            </div>
          </div>
          <div className="wd-chart" aria-label="Динамика пула">
            {poolData.map((item) => (
              <div className="wd-chart-bar" key={item.label}>
                <span style={{ height: `${Math.max(12, (item.value / maxPoolValue) * 100)}%` }} />
                <small>{item.label}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="wd-two-columns">
          <TransactionFeed title="Входящие транзакции" summary={incomingSummary} items={incomingTransactions} direction="incoming" />
          <TransactionFeed title="Исходящие транзакции" summary={outgoingSummary} items={outgoingTransactions} direction="outgoing" />
        </section>

        <section className="wd-ops-grid">
          <section className="wd-card wd-tickets">
            <div className="wd-section-head">
              <div>
                <h2>Тикеты</h2>
                <p>Участники пишут из личного кабинета, оператор отвечает, управляющие подключаются.</p>
              </div>
              <button type="button">Открыть тикеты</button>
            </div>
            <div className="wd-ticket-grid">
              {ticketStats.map((ticket) => (
                <div className={`wd-ticket wd-ticket-${ticket.tone}`} key={ticket.label}>
                  <span>{ticket.label}</span>
                  <strong>{ticket.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <LibraryPanel />
        </section>

        <section className="wd-bottom-grid">
          <TasksBoard />
          <section className="wd-card wd-chat">
            <div className="wd-section-head">
              <div>
                <h2>Внутренний чат</h2>
                <p>Групповой канал JP, KS, BR, AM.</p>
              </div>
              <span className="wd-live wd-live-incoming">real-time</span>
            </div>
            <div className="wd-chat-list">
              {chatMessages.map((message) => (
                <article key={`${message.author}-${message.time}`}>
                  <span>{message.author}</span>
                  <div>
                    <strong>{message.time}</strong>
                    <p>{message.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <form className="wd-chat-form">
              <input aria-label="Сообщение в чат" placeholder="Сообщение команде" />
              <button type="button">Отправить</button>
            </form>
          </section>
        </section>
      </section>
    </main>
  );
}

export default Web3Dashboard;
