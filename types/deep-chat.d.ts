declare module 'deep-chat-react' {
  import { CSSProperties, ReactNode } from 'react'

  export interface DeepChatProps {
    style?: CSSProperties
    initialMessages?: Array<{
      role: 'user' | 'ai' | 'system'
      text: string
    }>
    textInput?: {
      placeholder?: {
        text?: string
        style?: CSSProperties
      }
    }
    messageStyles?: any
    connect?: {
      url: string
      method?: string
      headers?: Record<string, string>
    }
    request?: {
      handler?: (body: any, signals: any) => any
    }
    response?: {
      handler?: (response: any) => any
    }
    requestBodyLimits?: {
      maxMessages?: number
    }
    requestInterceptor?: (requestDetails: any) => any
    responseInterceptor?: (response: any) => any
    errorMessages?: {
      displayServiceErrorMessages?: boolean
      overrides?: Record<string, string>
    }
    demo?: boolean
    displayLoadingBubble?: boolean
    displayLoadingMessage?: boolean
    submitButtonStyles?: any
    onMessage?: (message: any) => void
  }

  export const DeepChat: React.FC<DeepChatProps>
}