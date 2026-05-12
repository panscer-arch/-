export interface CopyBannerKpi {
  label: string;
  value: string;
  helper: string;
  delta: string;
  tone: "good" | "neutral" | "alert";
}

export interface CopyBannerQueueItem {
  id: string;
  title: string;
  detail: string;
  status: string;
  lane: string;
}

export interface CopyBannerFocusItem {
  id: string;
  title: string;
  owner: string;
  eta: string;
  lane: string;
}

export interface CopyBannerMarketingNote {
  id: string;
  title: string;
  detail: string;
  signal: string;
}

export interface CopyBannerSnapshot {
  projectName: string;
  stage: string;
  health: string;
  summary: string;
  lastUpdate: string;
  priority: string;
  kpis: CopyBannerKpi[];
  intake: CopyBannerQueueItem[];
  focus: CopyBannerFocusItem[];
  marketing: CopyBannerMarketingNote[];
}

export async function getDashboardSnapshot(): Promise<CopyBannerSnapshot> {
  return {
    projectName: "CopyBanner",
    stage: "Живой проект",
    health: "Стабильный рост",
    summary:
      "Первый прототип панели владельца для живого проекта: держим перед глазами спрос, supply со стороны нарезчиков и входящий поток заявок.",
    lastUpdate: "Сегодня, 12:40",
    priority: "Держать в фокусе живые метрики проекта, затем очередь задач, потом маркетинг.",
    kpis: [
      {
        label: "Рекламодатели",
        value: "24",
        helper: "Активные партнёры в текущем контуре",
        delta: "+3 за неделю",
        tone: "good"
      },
      {
        label: "Нарезчики",
        value: "146",
        helper: "Исполнители, у которых есть движение в системе",
        delta: "+12 за 7 дней",
        tone: "good"
      },
      {
        label: "Новые заявки",
        value: "8",
        helper: "Требуют проверки или следующего действия",
        delta: "4 горячие",
        tone: "alert"
      },
      {
        label: "Онлайн на сайте",
        value: "37",
        helper: "Текущие посетители на сайте и в кабинете",
        delta: "Пик в 14:00",
        tone: "neutral"
      }
    ],
    intake: [
      {
        id: "app-1",
        title: "Заявка от нового рекламодателя",
        detail: "Ниша iGaming, хочет быстрый тестовый запуск на 3 оффера.",
        status: "Требует связи",
        lane: "Рекламодатель"
      },
      {
        id: "app-2",
        title: "Новый нарезчик на модерации",
        detail: "Есть 2 канала, просит ускоренную верификацию профиля.",
        status: "Нужно проверить",
        lane: "Нарезчик"
      },
      {
        id: "app-3",
        title: "Повторная заявка рекламодателя",
        detail: "Возвращается после первой паузы, нужен новый пакет размещения.",
        status: "Нужно решение",
        lane: "Возврат"
      }
    ],
    focus: [
      {
        id: "focus-1",
        title: "Уточнить, почему часть трафика не доходит до активации в кабинете",
        owner: "Ты",
        eta: "Сегодня",
        lane: "Аналитика"
      },
      {
        id: "focus-2",
        title: "Разобрать очередь новых заявок и понять, что стопорит конверсию",
        owner: "Ты",
        eta: "Сегодня",
        lane: "Операционка"
      },
      {
        id: "focus-3",
        title: "Подготовить следующий блок для dashboard: задачи и доработки",
        owner: "Мы",
        eta: "Следующий шаг",
        lane: "Продукт"
      }
    ],
    marketing: [
      {
        id: "m-1",
        title: "Маркетинг пока отдельным блоком",
        detail: "Сюда потом добавим нужные тебе каналы, кампании, гипотезы и результаты.",
        signal: "Нужен состав блока"
      },
      {
        id: "m-2",
        title: "Что можно вывести следующим",
        detail: "Источники трафика, стоимость лида, активные кампании, заявки по каналам.",
        signal: "Следующий этап"
      }
    ]
  };
}
