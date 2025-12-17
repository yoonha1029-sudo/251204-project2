import React, { useRef, useEffect, useState } from 'react'

function SketchCanvas() {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const getPoint = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e) => {
    e.preventDefault()
    const point = getPoint(e)
    if (!point) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    e.preventDefault()
    if (!isDrawing) return

    const point = getPoint(e)
    if (!point) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
  }

  const stopDrawing = (e) => {
    e.preventDefault()
    setIsDrawing(false)
  }

  return (
    <canvas
      id="sketch-canvas"
      ref={canvasRef}
      className="sketch-canvas"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      style={{ touchAction: 'none' }}
    />
  )
}

export default function InquiryForm({ element, values, onChange, onSubmit, submitting }) {
  const isTransition = element.group >= 3 && element.group <= 12
  const guidanceText = isTransition
    ? 'Focus on simple visible properties such as common uses, appearance, or general stability. Deep atomic theory is NOT required.'
    : ''

  const elementName = values.elementName || `${element.koreanName} (${element.symbol})`

  return (
    <div className="card-layout">
      <div className="card-form-section">
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
      </div>

      <div className="card-preview-section">
        <div className="panel preview-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">미리보기</p>
              <h2>내 카드 미리보기</h2>
            </div>
          </div>
          <div className="preview-card">
            <div className="preview-header">
              <h4>{elementName}</h4>
              <span className="preview-tag">{element.group}족 · {element.period}주기</span>
            </div>
            <div className="preview-content">
              <div className="preview-field">
                <strong>이 원소를 가장 잘 나타내는 특징:</strong>
                <p>{values.elementOneLine || '(입력 대기 중...)'}</p>
              </div>
              <div className="preview-field">
                <strong>같은 족 원소들의 공통 성질:</strong>
                <p>{values.sameGroupTrait || '(입력 대기 중...)'}</p>
              </div>
              <div className="preview-field">
                <strong>다음 시간 강조하고 싶은 특징:</strong>
                <p>{values.cardFocus || '(입력 대기 중...)'}</p>
              </div>
            </div>
            <div className="preview-sketch-area">
              <div className="sketch-header">
                <p className="sketch-label">그림/디자인 연습 영역</p>
                <button
                  type="button"
                  className="ghost small"
                  onClick={() => {
                    const canvas = document.getElementById('sketch-canvas')
                    if (canvas) {
                      const ctx = canvas.getContext('2d')
                      ctx.clearRect(0, 0, canvas.width, canvas.height)
                    }
                  }}
                >
                  지우기
                </button>
              </div>
              <SketchCanvas />
            </div>
            <div className="preview-footer">
              <span>작성자: {values.studentName || '(이름)'} ({values.studentId || '학번'})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

