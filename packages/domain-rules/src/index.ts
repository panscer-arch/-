import type { Rule } from "@lifecoding/shared-types";

export interface RulesContract {
  listRules(): Promise<Rule[]>;
  getRuleBySlug(slug: string): Promise<Rule | null>;
}

export const mockRules: Rule[] = [
  {
    id: "rule_fear",
    slug: "fear-is-a-signal",
    title: "Страх как сигнал, а не приговор",
    summary: "Помогает отличать реальную угрозу от автоматической тревоги.",
    contentType: "video",
    durationMinutes: 12,
    difficulty: "easy",
    tags: ["страх", "состояние", "внимание"],
    categories: ["страх", "состояние"],
    contentBody:
      "Страх часто сообщает о нехватке ясности. Вместо борьбы с ним система предлагает разложить ситуацию на наблюдаемые элементы.",
    thesis: [
      "Страх усиливается в неопределенности.",
      "Наблюдение снижает автоматизм реакции.",
      "Действие должно идти после прояснения сигнала."
    ],
    lifeManifestations: [
      "Откладывание решений",
      "Избыточный контроль",
      "Скачки внимания между сценариями"
    ],
    selfChecks: [
      "Что конкретно мне сейчас угрожает?",
      "Какие факты у меня уже есть?",
      "Какое следующее небольшое действие доступно?"
    ],
    learnedByUsers: 248
  },
  {
    id: "rule_expectation",
    slug: "expectation-bends-attention",
    title: "Ожидание и искажение внимания",
    summary: "Показывает, как ожидания подменяют контакт с реальностью.",
    contentType: "text",
    durationMinutes: 8,
    difficulty: "medium",
    tags: ["ожидание", "внимание", "оценочность"],
    categories: ["ожидание", "внимание"],
    contentBody:
      "Ожидание создаёт скрытый шаблон, через который мы читаем ситуацию. Чем жёстче шаблон, тем сложнее заметить реальный контекст.",
    thesis: [
      "Ожидание сужает поле наблюдения.",
      "Разочарование часто связано не с фактом, а с шаблоном.",
      "Фиксация ожидания возвращает выбор."
    ],
    lifeManifestations: [
      "Разочарование в людях",
      "Обида без проверки фактов",
      "Игнорирование альтернатив"
    ],
    selfChecks: [
      "Что я ожидал увидеть?",
      "Что реально произошло?",
      "Что я не замечал из-за ожидания?"
    ],
    learnedByUsers: 173
  },
  {
    id: "rule_choice",
    slug: "choice-restores-vector",
    title: "Выбор возвращает вектор",
    summary: "Помогает выйти из зависания и вернуть движение через явный выбор.",
    contentType: "audio",
    durationMinutes: 6,
    difficulty: "easy",
    tags: ["выбор", "вектор жизни", "порядок"],
    categories: ["выбор", "вектор жизни"],
    contentBody:
      "Когда всё кажется одинаково тяжёлым, полезно уменьшить масштаб и выбрать не идеальный путь, а следующий подходящий шаг.",
    thesis: [
      "Выбор всегда локален.",
      "Без критерия выбор превращается в метание.",
      "Небольшая определённость запускает движение."
    ],
    lifeManifestations: [
      "Зависание между вариантами",
      "Сбор бесконечной информации",
      "Усталость от нерешённости"
    ],
    selfChecks: [
      "Какой критерий сейчас главный?",
      "Какой шаг обратим?",
      "Что я делаю, если перестаю ждать идеальный момент?"
    ],
    learnedByUsers: 211
  }
];

export const rulesService: RulesContract = {
  async listRules() {
    return mockRules;
  },
  async getRuleBySlug(slug) {
    return mockRules.find((rule) => rule.slug === slug) ?? null;
  }
};
