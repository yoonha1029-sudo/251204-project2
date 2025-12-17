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

export default function MiniPeriodicTable({ selectedId, onSelect, colorOn = false }) {
  // 1-2족과 13-18족만 표시 (3-12족 제외)
  const visibleGroups = [1, 2, 13, 14, 15, 16, 17, 18]
  const visibleElements = elements.filter(
    (el) => el.atomicNumber <= 20 && visibleGroups.includes(el.group)
  )

  // 그리드 컬럼 매핑: 1족=1, 2족=2, 13족=3, 14족=4, 15족=5, 16족=6, 17족=7, 18족=8
  const getGroupColumn = (group) => {
    if (group <= 2) return group
    if (group >= 13) return group - 10 // 13→3, 14→4, ...
    return null
  }

  const getCellStyle = (el) => {
    const col = getGroupColumn(el.group)
    if (!col) return { display: 'none' }
    
    const style = { gridColumn: col + 1, gridRow: el.period + 1 }

    if (colorOn) {
      style.background = categoryColors[el.category] || categoryColors.default
    }

    return style
  }

  return (
    <div className="mini-table-wrapper">
      <div className="mini-table-grid-compact">
        {visibleGroups.map((g) => {
          const col = getGroupColumn(g)
          return (
            <div
              key={`g-${g}`}
              className="mini-group-label"
              style={{ gridColumn: col + 1, gridRow: 1 }}
            >
              {g}
            </div>
          )
        })}
        {periods.map((p) => (
          <div key={`p-${p}`} className="mini-period-label" style={{ gridColumn: 1, gridRow: p + 1 }}>
            {p}
          </div>
        ))}

        {visibleElements.map((el) => (
          <button
            key={el.atomicNumber}
            className={`mini-cell ${selectedId === el.atomicNumber ? 'active' : ''}`}
            style={getCellStyle(el)}
            onClick={() => onSelect(el.atomicNumber)}
            aria-label={`${el.koreanName} 선택`}
          >
            <span className="mini-number">{el.atomicNumber}</span>
            <span className="mini-symbol">{el.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

