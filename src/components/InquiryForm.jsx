import React from 'react'

export default function InquiryForm({ element, values, onChange, onSubmit, submitting }) {
  const isTransition = element.group >= 3 && element.group <= 12
  const guidanceText = isTransition
    ? 'Focus on simple visible properties such as common uses, appearance, or general stability. Deep atomic theory is NOT required.'
    : ''

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
      {guidanceText && <p className="info">{guidanceText}</p>}
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
            placeholder={
              isTransition
                ? '예) 구리는 전기가 잘 통해 전선에 쓰여요.'
                : '예) 산소는 불의 연소와 생명체의 호흡에 꼭 필요한 기체이다.'
            }
          />
        </label>
        <label>
          같은 족 원소들의 공통 성질 (한 문장)
          <textarea
            value={values.sameGroupTrait}
            onChange={(e) => onChange({ ...values, sameGroupTrait: e.target.value })}
            placeholder={
              isTransition
                ? '예) 전이금속은 단단하고 광택이 나며 합금과 촉매로 자주 쓰여요.'
                : '예) 1족은 반응성, 18족은 안정성, 나머지 족은 금속/비금속 여부, 상온 상태, 공통 활용 분야를 떠올려 보세요.'
            }
          />
        </label>
        <label>
          다음 시간 원소 카드에서 강조하고 싶은 특징
          <textarea
            value={values.cardFocus}
            onChange={(e) => onChange({ ...values, cardFocus: e.target.value })}
            placeholder={
              isTransition
                ? '예) 니켈의 녹 방지 성질을 카드에 표현하고 싶어요.'
                : '예) 산소는 생명체에 꼭 필요한 기체이다.'
            }
          />
        </label>
        <button type="submit" className="primary full" disabled={submitting}>
          {submitting ? '제출 중...' : 'Google Form 제출하기'}
        </button>
      </form>
    </div>
  )
}

