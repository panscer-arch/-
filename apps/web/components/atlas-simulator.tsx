"use client";

import { useState } from "react";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";
import {
  buildSimulatorState,
  formatMoney,
  formatPct,
  referralLevelPercents,
  type SimulatorInputs
} from "../lib/atlas-simulator";

const defaultInputs: SimulatorInputs = {
  activeUsers: 2400,
  dailyNewUsers: 42,
  monthlyGrowthRate: 18,
  avgDeposit: 320,
  avgDepositGrowthRate: 9,
  reinvestShare: 42,
  partnerShareFromProfit: 24,
  longTariffShare: 38
};

function RangeControl({
  label,
  helper,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange
}: {
  label: string;
  helper: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="lc-range-control">
      <div className="lc-range-head">
        <div>
          <strong>{label}</strong>
          <span>{helper}</span>
        </div>
        <b>
          {value}
          {suffix}
        </b>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function AtlasSimulator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const state = buildSimulatorState(inputs);

  const referralTotal = referralLevelPercents.reduce((sum, value) => sum + value, 0);
  const riskItems = [
    {
      label: "Перегрузка выплат",
      value: formatPct(state.summary.payoutLoadPct),
      tone: state.summary.payoutLoadPct > 60 ? "danger" : state.summary.payoutLoadPct > 55 ? "warn" : "safe",
      helper: "safe до 55%"
    },
    {
      label: "Концентрация у топов",
      value: formatPct(state.summary.topConcentrationPct),
      tone:
        state.summary.topConcentrationPct > 30
          ? "danger"
          : state.summary.topConcentrationPct > 22
            ? "warn"
            : "safe",
      helper: "доля Atlas Partner"
    },
    {
      label: "Давление длинных циклов",
      value: formatPct(state.summary.longPressurePct),
      tone:
        state.summary.longPressurePct > 42 ? "danger" : state.summary.longPressurePct > 34 ? "warn" : "safe",
      helper: "объём в 200+ дней"
    }
  ];

  return (
    <div className="lc-grid">
      <Surface className="lc-atlas-hero">
        <div className="lc-atlas-hero-copy">
          <p className="lc-kicker">Atlas System</p>
          <h2>Симулятор MLM / referral economy для анализа устойчивости</h2>
          <p className="lc-muted">
            Живая карта показывает, как вход денег проходит через тарифы, превращается в прибыль,
            дробится на партнерку, реинвест и вывод, а затем накапливает обязательства и риски.
          </p>
          <div className="lc-actions">
            <Pill>Users Flow</Pill>
            <Pill>Cash Flow</Pill>
            <Pill>Risk Pressure</Pill>
          </div>
        </div>
        <div className="lc-atlas-hero-metrics">
          <article>
            <span>Вход денег</span>
            <strong>{formatMoney(state.summary.inflow)}</strong>
          </article>
          <article>
            <span>Генерация прибыли</span>
            <strong>{formatMoney(state.summary.grossProfit)}</strong>
          </article>
          <article>
            <span>Накопленные обязательства</span>
            <strong>{formatMoney(state.summary.liabilities)}</strong>
          </article>
        </div>
      </Surface>

      <div className="lc-grid two">
        <Surface>
          <SectionHeader
            title="Параметры симуляции"
            description="Двигай ключевые ручки и смотри, где структура теряет устойчивость."
          />
          <div className="lc-range-stack">
            <RangeControl
              label="Активные пользователи"
              helper="Размер текущей базы"
              min={500}
              max={10000}
              step={100}
              value={inputs.activeUsers}
              onChange={(value) => setInputs((current) => ({ ...current, activeUsers: value }))}
            />
            <RangeControl
              label="Новые users / day"
              helper="Свежий приток"
              min={5}
              max={200}
              step={1}
              value={inputs.dailyNewUsers}
              onChange={(value) => setInputs((current) => ({ ...current, dailyNewUsers: value }))}
            />
            <RangeControl
              label="Средний депозит"
              helper="Базовый чек"
              min={50}
              max={2000}
              step={10}
              value={inputs.avgDeposit}
              suffix=" $"
              onChange={(value) => setInputs((current) => ({ ...current, avgDeposit: value }))}
            />
            <RangeControl
              label="Рост пользователей / month"
              helper="Ускорение входящего потока"
              min={0}
              max={60}
              step={1}
              value={inputs.monthlyGrowthRate}
              suffix="%"
              onChange={(value) => setInputs((current) => ({ ...current, monthlyGrowthRate: value }))}
            />
            <RangeControl
              label="Реинвест из прибыли"
              helper="Возврат денег в систему"
              min={0}
              max={80}
              step={1}
              value={inputs.reinvestShare}
              suffix="%"
              onChange={(value) => setInputs((current) => ({ ...current, reinvestShare: value }))}
            />
            <RangeControl
              label="Партнерка из прибыли"
              helper="Важно: не из депозита"
              min={5}
              max={45}
              step={1}
              value={inputs.partnerShareFromProfit}
              suffix="%"
              onChange={(value) =>
                setInputs((current) => ({ ...current, partnerShareFromProfit: value }))
              }
            />
            <RangeControl
              label="Доля длинных тарифов"
              helper="200+ дней = давление"
              min={10}
              max={60}
              step={1}
              value={inputs.longTariffShare}
              suffix="%"
              onChange={(value) => setInputs((current) => ({ ...current, longTariffShare: value }))}
            />
          </div>
        </Surface>

        <div className="lc-grid">
          <div className="lc-grid three lc-atlas-kpis">
            <article className="lc-kpi-panel lc-kpi-green">
              <p className="lc-kicker">Вход депозитов</p>
              <h3>{formatMoney(state.summary.inflow)}</h3>
              <p className="lc-muted">{inputs.dailyNewUsers} новых пользователей в день</p>
            </article>
            <article className="lc-kpi-panel lc-kpi-blue">
              <p className="lc-kicker">Партнерские выплаты</p>
              <h3>{formatMoney(state.summary.partnerPayouts)}</h3>
              <p className="lc-muted">выплаты идут только из блока profit</p>
            </article>
            <article className="lc-kpi-panel lc-kpi-orange">
              <p className="lc-kicker">Реинвест + вывод</p>
              <h3>{formatMoney(state.summary.reinvest + state.summary.withdrawals)}</h3>
              <p className="lc-muted">
                reinvest {formatPct(inputs.reinvestShare)}, withdraw{" "}
                {formatPct(100 - inputs.reinvestShare - inputs.partnerShareFromProfit)}
              </p>
            </article>
          </div>

          <Surface>
            <SectionHeader
              title="User segments"
              description="Разделение базы по статусу, депозиту и доступной глубине линии."
            />
            <div className="lc-segment-stack">
              {state.segmentRows.map((segment) => (
                <article key={segment.id} className="lc-segment-card">
                  <div>
                    <p className="lc-kicker">{segment.status}</p>
                    <h3>{segment.label}</h3>
                  </div>
                  <div className="lc-segment-metrics">
                    <span>{segment.users} users</span>
                    <span>{formatMoney(segment.deposits)}</span>
                    <span>depth {segment.referralDepth}</span>
                  </div>
                </article>
              ))}
            </div>
          </Surface>
        </div>
      </div>

      <Surface>
        <SectionHeader
          title="Карта потоков"
          description="Минимум текста, максимум логики: users → deposits → tariffs → profit → split → loop."
        />
        <div className="lc-flow-board">
          <div className="lc-flow-column">
            <div className="lc-flow-block is-green">
              <span>Users Flow</span>
              <strong>{state.segmentRows.reduce((sum, segment) => sum + segment.users, 0)} users</strong>
            </div>
            <div className="lc-flow-arrow">↓</div>
            <div className="lc-flow-block is-green">
              <span>Вход депозитов</span>
              <strong>{formatMoney(state.summary.inflow)}</strong>
            </div>
          </div>

          <div className="lc-flow-column is-core">
            <div className="lc-flow-tariffs">
              {state.tariffRows.map((tariff) => (
                <article
                  key={tariff.id}
                  className={`lc-flow-block is-blue lc-tariff-card is-${tariff.pressure}`}
                >
                  <span>
                    {tariff.label} · {tariff.cycle}
                  </span>
                  <strong>{formatMoney(tariff.volume)}</strong>
                  <small>yield {formatPct(tariff.yieldPct * 100)}</small>
                </article>
              ))}
            </div>
            <div className="lc-flow-arrow">↓</div>
            <div className="lc-flow-block is-blue">
              <span>Генерация прибыли</span>
              <strong>{formatMoney(state.summary.grossProfit)}</strong>
              <small>Profit = Deposit × Yield%</small>
            </div>
          </div>

          <div className="lc-flow-column">
            <div className="lc-flow-split">
              <div className="lc-flow-arrow">↗</div>
              <article className="lc-flow-block is-orange">
                <span>Партнерские выплаты</span>
                <strong>{formatMoney(state.summary.partnerPayouts)}</strong>
                <small>только из profit</small>
              </article>
              <div className="lc-flow-arrow">→</div>
              <article className="lc-flow-block is-blue">
                <span>Вывод средств</span>
                <strong>{formatMoney(state.summary.withdrawals)}</strong>
              </article>
              <div className="lc-flow-arrow">↘</div>
              <article className="lc-flow-block is-blue">
                <span>Реинвест</span>
                <strong>{formatMoney(state.summary.reinvest)}</strong>
                <small>возврат в тарифы</small>
              </article>
            </div>
            <div className="lc-profit-note">
              <span className="lc-profit-line is-blocked">Deposit → Partner X</span>
              <span className="lc-profit-line is-active">Profit → Partner ✓</span>
            </div>
          </div>
        </div>
      </Surface>

      <div className="lc-grid two">
        <Surface>
          <SectionHeader
            title="Реферальная модель"
            description="Линейная структура до 20 уровней с убывающим процентом и глубиной по статусу."
          />
          <div className="lc-referral-header">
            <div>
              <p className="lc-kicker">Общий referral pool</p>
              <h3>{formatMoney(state.summary.partnerPayouts)}</h3>
            </div>
            <div>
              <p className="lc-kicker">Сумма уровней</p>
              <h3>{formatPct(referralTotal)}</h3>
            </div>
          </div>
          <div className="lc-referral-ladder">
            {referralLevelPercents.map((percent, index) => (
              <div key={percent + index} className="lc-referral-row">
                <span>Lvl {index + 1}</span>
                <div style={{ width: `${Math.max(10, percent * 8)}px` }} />
                <b>{percent}%</b>
              </div>
            ))}
          </div>
          <div className="lc-depth-grid">
            {state.segmentRows.map((segment) => (
              <article key={segment.id} className="lc-depth-card">
                <strong>{segment.status}</strong>
                <span>Глубина: {segment.referralDepth} уровней</span>
              </article>
            ))}
          </div>
        </Surface>

        <Surface>
          <SectionHeader
            title="Динамика роста и обязательств"
            description="Рост базы и среднего чека выглядит красиво, пока не начинает сжимать ликвидность."
          />
          <div className="lc-growth-grid">
            <div className="lc-chart-card">
              <p className="lc-kicker">Рост пользователей по времени</p>
              <div className="lc-chart-columns">
                {state.months.map((month) => (
                  <div key={month.label} className="lc-chart-column">
                    <div style={{ height: `${Math.min(160, month.users / 45)}px` }} />
                    <span>{month.label}</span>
                    <b>{month.users}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="lc-chart-card">
              <p className="lc-kicker">Рост среднего депозита</p>
              <div className="lc-chart-columns">
                {state.months.map((month) => (
                  <div key={month.label} className="lc-chart-column is-green">
                    <div style={{ height: `${Math.min(160, month.avgDeposit / 4)}px` }} />
                    <span>{month.label}</span>
                    <b>{formatMoney(month.avgDeposit)}</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="lc-chart-card">
              <p className="lc-kicker">Накопление обязательств</p>
              <div className="lc-chart-columns">
                {state.months.map((month) => (
                  <div key={month.label} className="lc-chart-column is-red">
                    <div style={{ height: `${Math.min(160, month.liabilities / 2200)}px` }} />
                    <span>{month.label}</span>
                    <b>{formatMoney(month.liabilities)}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Surface>
      </div>

      <Surface className="lc-risk-surface">
        <SectionHeader
          title="Pressure & Risk"
          description="Красным выделены зоны, которые чаще всего ломают устойчивость MLM-системы."
        />
        <div className="lc-risk-grid">
          <div className="lc-risk-meters">
            {riskItems.map((risk) => (
              <article key={risk.label} className={`lc-risk-card is-${risk.tone}`}>
                <span>{risk.label}</span>
                <strong>{risk.value}</strong>
                <small>{risk.helper}</small>
              </article>
            ))}
          </div>
          <div className="lc-risk-list">
            <article>
              <strong>Перегрузка выплат {">"}55%</strong>
              <p>Если reinvest падает, система быстрее уходит в режим покрытия обязательств за счет нового входа.</p>
            </article>
            <article>
              <strong>Концентрация денег у топов</strong>
              <p>Atlas Partner держат disproportionate share оборота и усиливают структурный риск ликвидности.</p>
            </article>
            <article>
              <strong>Эффект реинвеста</strong>
              <p>Реинвест ускоряет рост базы, но одновременно раздувает будущий payout stack и делает gap больнее.</p>
            </article>
            <article>
              <strong>Длинные тарифы = источник давления</strong>
              <p>200+ дней улучшают видимый объём сегодня, но формируют длинный хвост обязательств в будущих месяцах.</p>
            </article>
          </div>
        </div>
      </Surface>
    </div>
  );
}
