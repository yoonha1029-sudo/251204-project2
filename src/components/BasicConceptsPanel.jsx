import React from 'react'

export default function BasicConceptsPanel({ open, onClose }) {
  if (!open) return null
  return (
    <div className="panel concepts">
      <div className="panel-header">
        <div>
          <p className="eyebrow">필수 내용 복습</p>
          <h2>기본 개념 정리</h2>
        </div>
        <button className="ghost small" onClick={onClose}>닫기</button>
      </div>
      <ul className="concept-list">
        <li><strong>원소</strong>: 물질을 이루는 기본 구성 요소</li>
        <li><strong>원자</strong>: 원소의 기본 입자</li>
        <li><strong>분자</strong>: 두 개 이상의 원자로 이루어진 입자</li>
        <li><strong>원소 기호 작성법</strong>: 원소 이름의 첫 글자를 알파벳 대문자로 나타낸다</li>
      </ul>
    </div>
  )
}

