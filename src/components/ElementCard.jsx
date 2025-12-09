import React from 'react'

export default function ElementCard({ element, onChoose }) {
  const wikiUrl = `https://ko.wikipedia.org/wiki/${encodeURIComponent(element.koreanName)}`

  return (
    <div className="panel detail selected-card">
      <div className="panel-header">
        <div>
          <p className="eyebrow">원소 정보</p>
          <h2>
            {element.koreanName} ({element.symbol})
          </h2>
        </div>
        <span className="tag">족 {element.group} · 주기 {element.period}</span>
      </div>
      <p className="summary">{element.summary}</p>
      <div className="detail-grid">
        <div>
          <p className="label">기호</p>
          <p className="value">{element.symbol}</p>
        </div>
        <div>
          <p className="label">원자 번호(양성자 수)</p>
          <p className="value">{element.atomicNumber}</p>
        </div>
        <div>
          <p className="label">족 / 주기</p>
          <p className="value">
            {element.group}족 · {element.period}주기
          </p>
        </div>
        <div>
          <p className="label">분류</p>
          <p className="value">{element.family}</p>
        </div>
      </div>
      <div className="detail-actions">
        <a className="ghost" href={wikiUrl} target="_blank" rel="noreferrer">
          더 알아보기 (위키)
        </a>
        <button className="primary" onClick={onChoose}>
          이 원소로 탐구하기
        </button>
      </div>
    </div>
  )
}

