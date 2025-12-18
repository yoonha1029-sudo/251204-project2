import React, { useEffect, useMemo, useState } from 'react'
import elements from './data/elements'
import PeriodicTable from './components/PeriodicTable'
import ElementCard from './components/ElementCard'
import ChatbotPanel from './components/ChatbotPanel'
import InquiryForm from './components/InquiryForm'
import BasicConceptsPanel from './components/BasicConceptsPanel'

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
  const [step, setStep] = useState('explore') // 'explore' | 'chat' | 'card'
  const [colorOn, setColorOn] = useState(false)
  const [showConcepts, setShowConcepts] = useState(false)

  const [selectedElementId, setSelectedElementId] = useState(elements[0].atomicNumber)
  const selectedElement = useMemo(
    () => elements.find((el) => el.atomicNumber === selectedElementId) || elements[0],
    [selectedElementId]
  )

  // Step 2에서 사용할 선택된 원소 (챗봇 컨텍스트용)
  const [chatSelectedElementId, setChatSelectedElementId] = useState(elements[0].atomicNumber)
  const chatSelectedElement = useMemo(
    () => elements.find((el) => el.atomicNumber === chatSelectedElementId) || elements[0],
    [chatSelectedElementId]
  )

  const [inquiryElementId, setInquiryElementId] = useState(elements[0].atomicNumber)
  const inquiryElement = useMemo(
    () => elements.find((el) => el.atomicNumber === inquiryElementId) || elements[0],
    [inquiryElementId]
  )

  const initialChats = useMemo(() => {
    try {
      const saved = localStorage.getItem('chatHistory')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length) return parsed
      }
    } catch (e) {
      console.warn('chatHistory 복원 실패', e)
    }
    return [{ role: 'assistant', content: '안녕하세요, 여러분의 원소 탐구를 돕기 위해 기다리고 있었습니다. 주기율표에서 원하는 원소를 선택해 대화를 시작해 보세요. 원소들 사이의 숨겨진 관계나 흥미로운 쓰임새를 함께 찾아볼까요?' }]
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
      // chatSelectedElementId 사용 (Step 2에서 선택된 원소)
      const elementToUse = chatSelectedElement
      const elementContext = {
        role: 'system',
        content: `현재 선택된 원소 정보: ${elementToUse.koreanName} (${elementToUse.symbol}), 원자번호 ${elementToUse.atomicNumber}, 족 ${elementToUse.group}, 주기 ${elementToUse.period}. 관련된 설명이나 비교 시 참고해.`,
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

  const handleTableAction = (value, payload) => {
    if (value === 'toggle-color') {
      setColorOn(payload)
      return
    }
    if (typeof value === 'number') {
      setSelectedElementId(value)
    }
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

      <div className="stepper">
        <button
          className={`step-button ${step === 'explore' ? 'active' : ''}`}
          onClick={() => setStep('explore')}
        >
          1단계: 주기율표 탐색
        </button>
        <button
          className={`step-button ${step === 'chat' ? 'active' : ''}`}
          onClick={() => setStep('chat')}
        >
          2단계: 원소 챗봇
        </button>
        <button
          className={`step-button ${step === 'card' ? 'active' : ''}`}
          onClick={() => setStep('card')}
        >
          3단계: 탐구 카드
        </button>
      </div>

      <main className={step === 'explore' ? 'layout-explore' : 'layout-single'}>
        {step === 'explore' && (
          <div className="explore-layout">
            <div className="explore-left">
              <PeriodicTable
                selectedId={selectedElementId}
                onSelect={handleTableAction}
                colorOn={colorOn}
              />
              <div className="post-table">
                <button className="ghost small" onClick={() => setShowConcepts((p) => !p)}>
                  필수 내용 복습!
                </button>
              </div>
              <BasicConceptsPanel open={showConcepts} onClose={() => setShowConcepts(false)} />
            </div>
            <div className="explore-right">
              <ElementCard
                element={selectedElement}
                onChoose={() => {
                  setInquiryElementId(selectedElement.atomicNumber)
                  setSelectedElementId(selectedElement.atomicNumber)
                }}
                onNextStep={() => {
                  setChatSelectedElementId(selectedElement.atomicNumber)
                  setStep('chat')
                }}
              />
            </div>
          </div>
        )}

        {step === 'chat' && (
          <div className="step-content">
            <ChatbotPanel
              messages={chatHistory}
              userInput={userInput}
              onInput={setUserInput}
              onSend={handleSend}
              isLoading={isLoading}
              apiKeyPresent={Boolean(apiKey)}
              selectedElementId={chatSelectedElementId}
              onElementSelect={(id) => {
                setChatSelectedElementId(id)
                setSelectedElementId(id)
              }}
              onNextStep={() => {
                setInquiryElementId(chatSelectedElementId)
                setStep('card')
              }}
            />
          </div>
        )}

        {step === 'card' && (
          <div className="step-content">
            <InquiryForm
              element={inquiryElement}
              values={cardValues}
              onChange={setCardValues}
              onSubmit={handleSubmitCard}
              submitting={isSubmitting}
            />
          </div>
        )}
      </main>
      {toast.message && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

