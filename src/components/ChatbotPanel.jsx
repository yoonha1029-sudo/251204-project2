import React from 'react'

export default function ChatbotPanel({
  messages,
  userInput,
  onInput,
  onSend,
  isLoading,
  apiKeyPresent,
}) {
  const visibleMessages = messages.filter((m) => m.role !== 'system')

  return (
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
            <p>생각 중... 🚀</p>
          </div>
        )}
      </div>
      {!apiKeyPresent && (
        <p className="warning">.env의 VITE_OPENAI_API_KEY가 설정되지 않아 예시 답변만 표시됩니다.</p>
      )}
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
    </div>
  )
}

