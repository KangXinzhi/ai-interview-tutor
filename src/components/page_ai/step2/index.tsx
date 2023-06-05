import { useState } from 'react'

function Step2() {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([])
  const [inputText, setInputText] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value)
  }

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const newMessage = { sender: 'user', content: inputText }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInputText('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-4 mb-4 overflow-y-scroll max-h-64">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow rounded-l-md p-2"
          value={inputText}
          onChange={handleInputChange}
        />
        <button className="bg-blue-500 text-white p-2 rounded-r-md" onClick={handleSendMessage}>
          发送
        </button>
        {/* 添加语音录制按钮的代码 */}
      </div>
    </div>
  )
}

export default Step2
