import { ChatbotContent } from './components/chatbot-content'
import { Suspense } from 'react'
import Loading from './loading'

export default function ChatbotPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ChatbotContent />
    </Suspense>
  )
}
