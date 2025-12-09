import React, { useMemo, useState } from 'react'
import elements from './data/elements'

const SYSTEM_PROMPT =
  '너는 중학교 2학년을 도와주는 과학 튜터야. 원소의 특징을 쉽고 짧게 설명하고, 필요한 경우 같은 족/비슷한 특징의 원소도 함께 제안해. 2~4문장 이내로 답하고, 비교 질문이면 표면적인 특징 차이를 또렷하게 알려줘.'

const googleFormFieldIds = {
  element: import.meta.env.VITE_GOOGLE_FORM_FIELD_ELEMENT || 'entry.element',
  common: import.meta.env.VITE_GOOGLE_FORM_FIELD_COMMON || 'entry.common',
  difference: import.meta.env.VITE_GOOGLE_FORM_FIELD_DIFFERENCE || 'entry.difference',
  realLife: import.meta.env.VITE_GOOGLE_FORM_FIELD_REALLIFE || 'entry.realLife',
  curiosity: import.meta.env.VITE_GOOGLE_FORM_FIELD_CURIOSITY || 'entry.curiosity',
}

function PeriodicTable({ selectedId, onSelect }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">주기율표 탐색</p>
          <h2>1~20번 원소 Grid</h2>
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

function ElementDetail({ element, onChoose }) {
  const wikiUrl = `https://ko.wikipedia.org/wiki/${encodeURIComponent(element.koreanName)}`

  return (
    <div className="panel detail">
      <div className="panel-header">
        <div>
          <p className="eyebrow">원소 정보</p>
          <h2>{element.koreanName} ({element.symbol})</h2>
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
          <p className="label">원자번호</p>
          <p className="value">{element.atomicNumber}</p>
        </div>
        <div>
          <p className="label">족 / 주기</p>
          <p className="value">{element.group}족 · {element.period}주기</p>
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

function Chatbot({ messages, userInput, onInput, onSend, isLoading, apiKeyPresent }) {
  return (
    <div className="panel chatbot">
      <div className="panel-header">
        <div>
          <p className="eyebrow">원소 탐구 챗봇</p>
          <h2>Element Inquiry Chatbot</h2>
        </div>
        <span className="hint">중학생 눈높이에 맞춘 설명</span>
      </div>
      <div className="chat-window">
        {messages.map((m, idx) => (
          <div key={idx} className={`bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
            <p>{m.content}</p>
          </div>
        ))}
        {isLoading && <div className="bubble assistant"><p>생각 중... 🚀</p></div>}
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

function InquiryForm({
  element,
  values,
  onChange,
  onSubmit,
  canSubmit,
}) {
  return (
    <div className="panel form">
      <div className="panel-header">
        <div>
          <p className="eyebrow">탐구 카드</p>
          <h2>Inquiry Card Submission</h2>
        </div>
        <span className="tag light">선택 원소: {element.koreanName} ({element.symbol})</span>
      </div>
      {!canSubmit && (
        <p className="warning">Google Form URL이 설정되지 않았습니다. 제출 시 카드 내용이 클립보드에 복사됩니다.</p>
      )}
      <form onSubmit={onSubmit} className="card-form">
        <label>
          공통점
          <textarea
            value={values.common}
            onChange={(e) => onChange({ ...values, common: e.target.value })}
            placeholder="선택한 원소와 다른 원소의 공통점을 적어보세요."
          />
        </label>
        <label>
          차이
          <textarea
            value={values.difference}
            onChange={(e) => onChange({ ...values, difference: e.target.value })}
            placeholder="성질이나 활용 면에서의 차이를 정리해보세요."
          />
        </label>
        <label>
          실생활 활용
          <textarea
            value={values.realLife}
            onChange={(e) => onChange({ ...values, realLife: e.target.value })}
            placeholder="이 원소가 쓰이는 예를 적어보세요."
          />
        </label>
        <label>
          궁금한 점
          <textarea
            value={values.curiosity}
            onChange={(e) => onChange({ ...values, curiosity: e.target.value })}
            placeholder="추가로 더 알고 싶은 내용을 적어보세요."
          />
        </label>
        <button type="submit" className="primary full">
          Google Form 제출하기
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''
  const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL || ''

  const [selectedElementId, setSelectedElementId] = useState(elements[0].atomicNumber)
  const selectedElement = useMemo(
    () => elements.find((el) => el.atomicNumber === selectedElementId) || elements[0],
    [selectedElementId]
  )

  const [inquiryElementId, setInquiryElementId] = useState(elements[0].atomicNumber)
  const inquiryElement = useMemo(
    () => elements.find((el) => el.atomicNumber === inquiryElementId) || elements[0],
    [inquiryElementId]
  )

  const [messages, setMessages] = useState([
    { role: 'assistant', content: '안녕하세요! 궁금한 원소를 선택하고 질문해보세요. 비교나 활용 사례도 도와줄게요.' },
  ])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cardValues, setCardValues] = useState({
    common: '',
    difference: '',
    realLife: '',
    curiosity: '',
  })
  const [lastApiState, setLastApiState] = useState(apiKey ? '감지됨' : '미설정')

  const handleSend = async () => {
    if (!userInput.trim()) return
    const nextMessages = [...messages, { role: 'user', content: userInput.trim() }]
    setMessages(nextMessages)
    setUserInput('')

    if (!apiKey) {
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: 'API Key가 설정되지 않아 예시 답변을 보여줄게요. .env에 VITE_OPENAI_API_KEY를 넣어 주세요.' },
      ])
      setLastApiState('미설정')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...nextMessages,
          ],
          max_tokens: 400,
          temperature: 0.6,
        }),
      })

      const data = await response.json()
      const text = data?.choices?.[0]?.message?.content?.trim()
      setMessages([...nextMessages, { role: 'assistant', content: text || '답변을 불러오지 못했어요.' }])
      setLastApiState('정상 작동')
    } catch (error) {
      console.error(error)
      setMessages([
        ...nextMessages,
        { role: 'assistant', content: '죄송해요, 응답 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.' },
      ])
      setLastApiState('오류 발생')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitCard = (event) => {
    event.preventDefault()
    const summary = [
      `선택 원소: ${inquiryElement.koreanName} (${inquiryElement.symbol})`,
      `공통점: ${cardValues.common || '-'}`,
      `차이: ${cardValues.difference || '-'}`,
      `실생활 활용: ${cardValues.realLife || '-'}`,
      `궁금한 점: ${cardValues.curiosity || '-'}`,
    ].join('\n')

    if (googleFormUrl) {
      const params = new URLSearchParams()
      params.set(googleFormFieldIds.element, `${inquiryElement.koreanName} (${inquiryElement.symbol})`)
      params.set(googleFormFieldIds.common, cardValues.common)
      params.set(googleFormFieldIds.difference, cardValues.difference)
      params.set(googleFormFieldIds.realLife, cardValues.realLife)
      params.set(googleFormFieldIds.curiosity, cardValues.curiosity)
      const url = `${googleFormUrl}?${params.toString()}`
      window.open(url, '_blank')
    } else {
      navigator.clipboard?.writeText(summary).catch(() => {})
      alert('Google Form URL이 없어 카드 내용을 복사해 두었어요. 붙여넣어 제출해 주세요.')
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">주기율표 탐구 웹앱</p>
          <h1>Periodic Table Explorer</h1>
        </div>
        <div className="status">
          <span className={`status-dot ${apiKey ? 'ok' : 'warn'}`} />
          <span>API Key {apiKey ? '감지됨' : '미설정'}{lastApiState ? ` · ${lastApiState}` : ''}</span>
        </div>
      </header>

      <main className="layout">
        <div className="left">
          <PeriodicTable selectedId={selectedElementId} onSelect={setSelectedElementId} />
          <ElementDetail element={selectedElement} onChoose={() => setInquiryElementId(selectedElement.atomicNumber)} />
        </div>
        <div className="right">
          <Chatbot
            messages={messages}
            userInput={userInput}
            onInput={setUserInput}
            onSend={handleSend}
            isLoading={isLoading}
            apiKeyPresent={Boolean(apiKey)}
          />
          <InquiryForm
            element={inquiryElement}
            values={cardValues}
            onChange={setCardValues}
            onSubmit={handleSubmitCard}
            canSubmit={Boolean(googleFormUrl)}
          />
        </div>
      </main>
    </div>
  )
}

