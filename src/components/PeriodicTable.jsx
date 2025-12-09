import React from 'react'
import elements from '../data/elements'

export default function PeriodicTable({ selectedId, onSelect }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">주기율표 탐구하기</p>
          <h2>주기율표</h2>
        </div>
        <span className="hint">클릭해서 원소를 선택하세요</span>
      </div>
      <div className="table-grid">
        {elements.map((el) => (
          <button
            key={el.atomicNumber}
            className={`cell ${selectedId === el.atomicNumber ? 'active' : ''}`}
            style={{ gridColumn: el.group, gridRow: el.period }}
            onClick={() => onSelect(el.atomicNumber)}
            aria-label={`${el.koreanName} 선택`}
          >
            <span className="number">{el.atomicNumber}</span>
            <span className="symbol">{el.symbol}</span>
            <span className="name">{el.koreanName}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

