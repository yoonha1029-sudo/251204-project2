import React, { useState } from 'react'
import MiniPeriodicTable from './MiniPeriodicTable'
import elements from '../data/elements'

export default function ChatbotPanel({
  messages,
  userInput,
  onInput,
  onSend,
  isLoading,
  apiKeyPresent,
  selectedElementId,
  onElementSelect,
  onNextStep,
}) {
  const visibleMessages = messages.filter((m) => m.role !== 'system')
  const [colorOn, setColorOn] = useState(false)
  const selectedElement = elements.find((el) => el.atomicNumber === selectedElementId) || elements[0]

  const exampleQuestions = [
    '우리 주변에서 이 원소가 사용되는 대표적인 사례는 무엇인가요?',
    '이 원소와 성질이 비슷한 같은 족 원소들은 어떤 특징을 공유하나요?',
    '이 원소의 이름은 어떤 의미나 유래를 담고 있나요?',
    '이 원소가 우리 몸이나 자연에서 어떤 역할을 하나요?',
  ]

  const handleExampleClick = (question) => {
    onInput(question)
  }

  return (
    <div className="chatbot-layout">
      <div className="chatbot-left">
        <div className="panel mini-table-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">원소 선택</p>
              <h2>주기율표</h2>
            </div>
          </div>
          <div className="mini-table-controls">
            <label className="switch">
              <input type="checkbox" checked={colorOn} onChange={(e) => setColorOn(e.target.checked)} />
              <span className="slider" />
            </label>
            <span>족/분류 보기</span>
          </div>
          <MiniPeriodicTable selectedId={selectedElementId} onSelect={onElementSelect} colorOn={colorOn} />
          {selectedElement && (
            <div className="selected-element-chip">
              선택: <strong>{selectedElement.koreanName}</strong> ({selectedElement.symbol})<br />
              원자번호 {selectedElement.atomicNumber} · {selectedElement.group}족 · {selectedElement.period}주기
            </div>
          )}
        </div>
      </div>

      <div className="chatbot-right">
        <div className="panel chatbot">
          <div className="panel-header">
            <div>
              <p className="eyebrow">AI 챗봇 활용하기</p>
              <h2>원소 탐구 챗봇</h2>
            </div>
            <span className="hint">궁금한 원소에 대해 질문하세요</span>
          </div>

          <div className="chat-window">
            {visibleMessages.map((m, idx) => (
              <div key={idx} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                <p>{m.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="bubble assistant">
                <p>생각 중... </p>
              </div>
            )}
          </div>
          {!apiKeyPresent && (
            <p className="warning">.env의 VITE_OPENAI_API_KEY가 설정되지 않아 예시 답변만 표시됩니다.</p>
          )}
          
          <div className="example-questions">
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                className="example-chip"
                onClick={() => handleExampleClick(q)}
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              value={userInput}
              onChange={(e) => onInput(e.target.value)}
              placeholder="예) 산소와 질소는 어떻게 다른가요?"
              onKeyDown={(e) => e.key === 'Enter' && onSend()}
            />
            <button className="primary" onClick={onSend} disabled={isLoading}>
              보내기
            </button>
          </div>

          {onNextStep && (
            <div className="chat-actions">
              <button className="primary" onClick={onNextStep}>
                탐구 카드 작성하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

