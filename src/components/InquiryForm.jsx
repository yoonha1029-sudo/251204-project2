import React from 'react'

export default function InquiryForm({ element, values, onChange, onSubmit, submitting }) {
  return (
    <div className="panel form">
      <div className="panel-header">
        <div>
          <p className="eyebrow">탐구 카드</p>
          <h2>원소 탐구 카드 제출</h2>
        </div>
        <span className="tag light">
          선택 원소: {element.koreanName} ({element.symbol})
        </span>
      </div>
      <form onSubmit={onSubmit} className="card-form">
        <label>
          학번
          <input
            type="text"
            value={values.studentId}
            onChange={(e) => onChange({ ...values, studentId: e.target.value })}
            placeholder="예) 20123"
          />
        </label>
        <label>
          이름
          <input
            type="text"
            value={values.studentName}
            onChange={(e) => onChange({ ...values, studentName: e.target.value })}
            placeholder="예) 홍길동"
          />
        </label>
        <label>
          내가 탐구한 원소 이름
          <input
            type="text"
            value={values.elementName || `${element.koreanName} (${element.symbol})`}
            onChange={(e) => onChange({ ...values, elementName: e.target.value })}
            placeholder="예) 산소 (O)"
          />
        </label>
        <label>
          이 원소를 가장 잘 나타내는 특징 (한 문장)
          <textarea
            value={values.elementOneLine}
            onChange={(e) => onChange({ ...values, elementOneLine: e.target.value })}
            placeholder="예) 산소는 불의 연소와 생명체의 호흡에 꼭 필요한 기체이다."
          />
        </label>
        <label>
          같은 족 원소들의 공통 성질 (한 문장)
          <textarea
            value={values.sameGroupTrait}
            onChange={(e) => onChange({ ...values, sameGroupTrait: e.target.value })}
            placeholder="예) 1족은 반응성, 18족은 안정성, 나머지 족은 금속/비금속 여부, 상온에서의 상태(기체/액체/고체), 공통 활용 분야 생각해 보기"
          />
        </label>
        <label>
          다음 시간 원소 카드에서 강조하고 싶은 특징
          <textarea
            value={values.cardFocus}
            onChange={(e) => onChange({ ...values, cardFocus: e.target.value })}
            placeholder="예) 산소는 생명체에 꼭 필요한 기체이다."
          />
        </label>
        <button type="submit" className="primary full" disabled={submitting}>
          {submitting ? '제출 중...' : 'Google Form 제출하기'}
        </button>
      </form>
    </div>
  )
}

