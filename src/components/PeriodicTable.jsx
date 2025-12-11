import React from 'react'
import elements from '../data/elements'

const groups = Array.from({ length: 18 }, (_, i) => i + 1)
const periods = Array.from({ length: 7 }, (_, i) => i + 1)

const categoryColors = {
  metal: '#e0ecff',
  nonmetal: '#e8f7e6',
  noble: '#f1f5ff',
  metalloid: '#fdf2e9',
  default: '#f8fafc',
}

const shadeByValue = (value, min, max, base = '#e5e7eb') => {
  if (value === null || value === undefined) return base
  const clamped = Math.max(min, Math.min(max, value))
  const ratio = (clamped - min) / (max - min || 1)
  const light = 240 - Math.round(ratio * 70)
  return `hsl(220, 25%, ${light}%)`
}

export default function PeriodicTable({
  selectedId,
  onSelect,
  showMore,
  colorOn,
  visualizeBy,
}) {
  const visibleElements = elements.filter((el) => showMore || el.atomicNumber <= 20)

  const getCellStyle = (el) => {
    const style = { gridColumn: el.group + 1, gridRow: el.period + 1 }

    if (visualizeBy === 'radius') {
      style.background = shadeByValue(el.radius, 50, 250)
    } else if (visualizeBy === 'electronegativity') {
      style.background = shadeByValue(el.electronegativity ?? 1, 0.7, 4)
    } else if (visualizeBy === 'type') {
      style.background = categoryColors[el.category] || categoryColors.default
    } else if (colorOn) {
      style.background = categoryColors[el.category] || categoryColors.default
    }

    if (el.atomicNumber > 20) {
      style.borderStyle = 'dashed'
      style.opacity = 0.92
    }
    return style
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">주기율표 탐구하기</p>
          <h2>주기율표</h2>
        </div>
        <span className="hint">클릭해서 원소를 선택하세요</span>
      </div>

      <div className="controls-row">
        <div className="control-chip">
          <label className="switch">
            <input type="checkbox" checked={colorOn} onChange={(e) => onSelect('toggle-color', e.target.checked)} />
            <span className="slider" />
          </label>
          <span>색상 코딩</span>
        </div>
        <div className="control-chip">
          <label htmlFor="visualize-select">Visualize by</label>
          <select
            id="visualize-select"
            value={visualizeBy}
            onChange={(e) => onSelect('visualize', e.target.value)}
          >
            <option value="">없음</option>
            <option value="radius">Atomic Radius</option>
            <option value="electronegativity">Electronegativity</option>
            <option value="type">Element Type</option>
          </select>
        </div>
        <button className="ghost small" onClick={() => onSelect('toggle-more')}>
          더 많은 원소 보기 / 왜 이런 모양일까?
        </button>
      </div>

      <div className="table-wrapper">
        {groups.map((g) => (
          <div key={`g-${g}`} className="group-label" style={{ gridColumn: g + 1, gridRow: 1 }}>
            {g}
          </div>
        ))}
        {periods.map((p) => (
          <div key={`p-${p}`} className="period-label" style={{ gridColumn: 1, gridRow: p + 1 }}>
            {p}
          </div>
        ))}

        {visibleElements.map((el) => (
          <button
            key={el.atomicNumber}
            className={`cell ${selectedId === el.atomicNumber ? 'active' : ''} ${el.atomicNumber > 20 ? 'extra' : ''}`}
            style={getCellStyle(el)}
            onClick={() => onSelect(el.atomicNumber)}
            aria-label={`${el.koreanName} 선택`}
          >
            <span className="number">{el.atomicNumber}</span>
            <span className="symbol">{el.symbol}</span>
            <span className="name">{el.koreanName}</span>
          </button>
        ))}
      </div>

      <p className="helper-text">
        원소 기호는 원소 이름의 첫 글자를 대문자로 적습니다. 예: Hydrogen → H, Carbon → C.
      </p>
    </div>
  )
}

