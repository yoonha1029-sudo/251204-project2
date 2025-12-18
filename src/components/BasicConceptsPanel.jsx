import React from 'react'

export default function BasicConceptsPanel({ open, onClose }) {
  if (!open) return null
  return (
    <div className="panel concepts">
      <div className="panel-header">
        <div>
          <p className="eyebrow">물질의 구성</p>
          <h2>기본 개념 정리</h2>
        </div>
        <button className="ghost small" onClick={onClose}>닫기</button>
      </div>
      <ul className="concept-list">
        <li><strong>원소</strong>: 한 종류의 원자로 이루어진 물질</li>
        <li><strong>원자</strong>: 물질을 이루는 기본 입자</li>
        <li><strong>분자</strong>: 두 종류 이상의 입자가 모여 만들어진 물질</li>
        <li><strong>원소 기호 작성법</strong>: 원소 이름의 첫 글자를 알파벳 대문자로 나타내고, 첫 글자가 같을 때에는 중간 글자를 택하여 첫 글자 다음에 소문자로 나타낸다.</li>
      </ul>
    </div>
  )
}

