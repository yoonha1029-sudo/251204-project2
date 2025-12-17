import React from 'react'
import elements from '../data/elements'

const groups = Array.from({ length: 18 }, (_, i) => i + 1)
const periods = Array.from({ length: 4 }, (_, i) => i + 1)

const categoryColors = {
  metal: '#e0ecff',
  nonmetal: '#e8f7e6',
  noble: '#f1f5ff',
  metalloid: '#fdf2e9',
  default: '#f8fafc',
}


export default function PeriodicTable({
  selectedId,
  onSelect,
  colorOn,
}) {
  const visibleElements = elements.filter((el) => el.atomicNumber <= 20)

  const getCellStyle = (el) => {
    const style = { gridColumn: el.group + 1, gridRow: el.period + 1 }

    if (colorOn) {
      style.background = categoryColors[el.category] || categoryColors.default
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
          <span>족/분류 보기</span>
        </div>
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
            className={`cell ${selectedId === el.atomicNumber ? 'active' : ''}`}
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

