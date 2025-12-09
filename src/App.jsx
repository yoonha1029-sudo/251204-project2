import React, { useEffect, useMemo, useState } from 'react'
import elements from './data/elements'
import PeriodicTable from './components/PeriodicTable'
import ElementCard from './components/ElementCard'
import ChatbotPanel from './components/ChatbotPanel'
import InquiryForm from './components/InquiryForm'

const SYSTEM_PROMPT =
  '너는 장윤하 선생님을 도와 대한민국 중학교 2학년 과학 수업을 지원하는 보조 교사야. 답변은 항상 2~4문장으로 간단하고 쉬운 표현만 사용해. 전자배치, 오비탈, 이온화에너지 같은 어려운 용어를 사용해 설명하지는 마. 과학과 관련 없는 질문이 오면 “이 챗봇은 과학 탐구만 도와줄 수 있어요.”라고 안내해.'

const googleFormUrl =
  import.meta.env.VITE_GOOGLE_FORM_URL ||
  'https://docs.google.com/forms/d/e/1FAIpQLSdnr2qVNp8nuVv3UD4rdqR_uQKnAfdkf4RhTgyARmIVyCvgkg/formResponse'

const googleFormFieldIds = {
  studentId: 'entry.142880903',
  studentName: 'entry.1094575034',
  elementName: 'entry.1632043343',
  elementOneLine: 'entry.1164930404',
  sameGroupTrait: 'entry.1444425224',
  cardFocus: 'entry.990917381',
}

export default function App() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || ''

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

  const initialChats = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('chatHistory')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch (e) {
      console.warn('chatHistory 복원 실패', e)
    }
    return [{ role: 'assistant', content: '안녕하세요! 궁금한 원소를 선택하고 질문해보세요. 비교나 활용 사례도 도와줄게요.' }]
  }, [])

  const [chatHistory, setChatHistory] = useState(initialChats)
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardValues, setCardValues] = useState({
    studentId: '',
    studentName: '',
    elementName: '',
    elementOneLine: '',
    sameGroupTrait: '',
    cardFocus: '',
  })
  const [lastApiState, setLastApiState] = useState(apiKey ? '감지됨' : '미설정')
  const [toast, setToast] = useState({ message: '', type: 'info' })

  useEffect(() => {
    try {
      localStorage.setItem('chatHistory', JSON.stringify(chatHistory))
    } catch (e) {
      console.warn('chatHistory 저장 실패', e)
    }
  }, [chatHistory])

  const showToast = (message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast({ message: '', type }), 2200)
  }

  const handleSend = async () => {
    if (!userInput.trim()) return
    const userMessage = { role: 'user', content: userInput.trim() }
    const nextMessages = [...chatHistory, userMessage]
    setChatHistory(nextMessages)
    setUserInput('')

    if (!apiKey) {
      setChatHistory([
        ...nextMessages,
        { role: 'assistant', content: 'API Key가 설정되지 않아 예시 답변을 보여줄게요. .env에 VITE_OPENAI_API_KEY를 넣어 주세요.' },
      ])
      setLastApiState('미설정')
      return
    }

    setIsLoading(true)
    try {
      const elementContext = {
        role: 'system',
        content: `현재 선택된 원소 정보: ${selectedElement.koreanName} (${selectedElement.symbol}), 원자번호 ${selectedElement.atomicNumber}, 족 ${selectedElement.group}, 주기 ${selectedElement.period}. 관련된 설명이나 비교 시 참고해.`,
      }
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
            elementContext,
            ...nextMessages,
          ],
          max_tokens: 400,
          temperature: 0.6,
        }),
      })

      const data = await response.json()
      const text = data?.choices?.[0]?.message?.content?.trim()
      setChatHistory([...nextMessages, { role: 'assistant', content: text || '답변을 불러오지 못했어요.' }])
      setLastApiState('정상 작동')
    } catch (error) {
      console.error(error)
      setChatHistory([
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
    const elementName = cardValues.elementName || `${inquiryElement.koreanName} (${inquiryElement.symbol})`
    const requiredFields = [
      cardValues.studentId,
      cardValues.studentName,
      elementName,
      cardValues.elementOneLine,
      cardValues.sameGroupTrait,
      cardValues.cardFocus,
    ]
    if (requiredFields.some((v) => !v || !String(v).trim())) {
      showToast('모든 항목을 입력해 주세요.', 'error')
      return
    }

    setIsSubmitting(true)
    const params = new URLSearchParams()
    params.set(googleFormFieldIds.studentId, cardValues.studentId)
    params.set(googleFormFieldIds.studentName, cardValues.studentName)
    params.set(googleFormFieldIds.elementName, elementName)
    params.set(googleFormFieldIds.elementOneLine, cardValues.elementOneLine)
    params.set(googleFormFieldIds.sameGroupTrait, cardValues.sameGroupTrait)
    params.set(googleFormFieldIds.cardFocus, cardValues.cardFocus)

    fetch(googleFormUrl, {
      method: 'POST',
      mode: 'no-cors',
      body: params,
    })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false)
        showToast('제출이 완료되었습니다.', 'success')
      })
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">주기율표 탐구 웹앱</p>
          <h1>주기율표 탐구하기</h1>
        </div>
        <div className="status">
          <span className={`status-dot ${apiKey ? 'ok' : 'warn'}`} />
          <span>API Key {apiKey ? '감지됨' : '미설정'}{lastApiState ? ` · ${lastApiState}` : ''}</span>
        </div>
      </header>

      <main className="layout">
        <div className="left">
          <PeriodicTable selectedId={selectedElementId} onSelect={setSelectedElementId} />
          <ElementCard element={selectedElement} onChoose={() => setInquiryElementId(selectedElement.atomicNumber)} />
        </div>
        <div className="right">
          <ChatbotPanel
            messages={chatHistory}
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
            submitting={isSubmitting}
          />
        </div>
      </main>
      {toast.message && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

