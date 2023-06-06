import { useState } from 'react'

function Step2() {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([])
  const [inputText, setInputText] = useState<string>('')
  const [isPressed, setIsPressed] = useState(false)
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

  const handlePressStart = () => {
    setIsPressed(true)
  }

  const handlePressEnd = () => {
    setIsPressed(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className='p-4 mb-4 overflow-y-scroll h-[80vh] bg-white'>
        {/* {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
            {message.content}
          </div>
        ))} */}

      </div>
      {isPressed && (<span className="absolute left-[50%] top-[50%] flex items-center justify-center">
        <div className="animate-ping rounded-full bg-green-500 w-12 h-12 absolute -left-6 -top-6"></div>
        <div className="rounded-full bg-green-400 w-12 h-12 absolute -left-6 -top-6"></div>
      </span>)}
      <div className="flex items-center justify-center">
        <div
          className="w-16 h-16 flex items-center justify-center bg-green-400 rounded-full cursor-pointer"
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
        >
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28496" width="3rem" height="3rem"><path d="M841.142857 402.285714v73.142857c0 169.142857-128 308.553143-292.571428 326.838858V877.714286h146.285714c20.004571 0 36.571429 16.566857 36.571428 36.571428s-16.566857 36.571429-36.571428 36.571429H329.142857c-20.004571 0-36.571429-16.566857-36.571428-36.571429s16.566857-36.571429 36.571428-36.571428h146.285714v-75.446857c-164.571429-18.285714-292.571429-157.696-292.571428-326.838858v-73.142857c0-20.004571 16.566857-36.571429 36.571428-36.571428s36.571429 16.566857 36.571429 36.571428v73.142857c0 141.129143 114.870857 256 256 256s256-114.870857 256-256v-73.142857c0-20.004571 16.566857-36.571429 36.571429-36.571428s36.571429 16.566857 36.571428 36.571428z m-146.285714-219.428571v292.571428c0 100.571429-82.285714 182.857143-182.857143 182.857143s-182.857143-82.285714-182.857143-182.857143V182.857143c0-100.571429 82.285714-182.857143 182.857143-182.857143s182.857143 82.285714 182.857143 182.857143z" fill="#ffffff" p-id="28497"></path></svg>
        </div>
      </div>
    </div>
  )
}

export default Step2
