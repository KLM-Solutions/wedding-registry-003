"use client"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { useChat } from "@ai-sdk/react"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"

// Romantic couple quotes for the background
const coupleQuotes = [
  "Love is not about how many days, months, or years you have been together. It's about how much you love each other every day.",
  "The best thing to hold onto in life is each other.",
  "A successful marriage requires falling in love many times, always with the same person.",
  "To love and be loved is to feel the sun from both sides.",
  "The greatest happiness of life is the conviction that we are loved.",
  "In all the world, there is no heart for me like yours.",
  "I love you not only for what you are, but for what I am when I am with you.",
  "Forever is a long time, but I wouldn't mind spending it by your side.",
  "Whatever our souls are made of, yours and mine are the same.",
  "Real love stories never have endings.",
]

const defaultQuestions = [
  "Where is the wedding?",
  "When is the wedding?",
  "What type of food will be served?",
]

const BackgroundQuotes = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % coupleQuotes.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="text-[#D4AF37] text-4xl font-serif text-center max-w-2xl italic px-8">
            {coupleQuotes[currentQuoteIndex]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function AskMeAnything() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/ask-me-anything",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-t-2xl shadow-xl p-4 sm:p-8 flex flex-col min-h-screen">
      {/* Back to Registry Link */}
      <div className="w-full px-2 sm:px-6 pt-4 sm:pt-6 mb-4 z-10">
        <Link
          href="/wedding-registry"
          className="inline-flex items-center text-gray-600 hover:text-[#D4AF37] transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-serif tracking-widest">Back to registry</span>
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] mb-6 sm:mb-8 text-center relative">
        <span className="inline-block relative">
          Ask Me Anything
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-0.5 bg-[#D4AF37]/30"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </span>
      </h1>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 sm:mb-6 pr-1 sm:pr-2 custom-scrollbar">
        {messages.length === 0 && (
          <div className="space-y-6">
            <div className="text-center text-gray-500 italic font-serif my-6">
              Ask anything about the wedding, registry, or the couple...
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 px-2 sm:px-4">
              {defaultQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleInputChange({ target: { value: question } } as any)}
                  className="group relative text-left p-6 rounded-xl bg-white/80 hover:bg-white transition-all duration-300 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:shadow-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center group-hover:bg-[#D4AF37]/20 transition-colors">
                      {question.includes("Where") ? (
                        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ) : question.includes("When") ? (
                        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )}
                    </div>
                    <p className="font-serif text-gray-700 group-hover:text-[#D4AF37] transition-colors">{question}</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            key={msg.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-3 max-w-[90%] sm:max-w-[80%] text-base font-serif shadow-sm break-words ${
                msg.role === "user" ? "bg-[#D4AF37]/90 text-white self-end" : "bg-gray-100 text-gray-800 self-start"
              }`}
            >
              {msg.role === "user" ? (
                msg.content
              ) : (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      a: ({ href, children }) => (
                        <a href={href} className="text-[#D4AF37] hover:text-[#C09B2A] underline" target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-auto relative w-full">
        <input
          name="prompt"
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 sm:px-6 py-3 font-serif text-base focus:border-[#D4AF37] focus:ring-[#D4AF37]/20 focus:outline-none bg-white/90 backdrop-blur-sm transition-all w-full"
          placeholder="Type your question..."
          value={input}
          onChange={handleInputChange}
          autoFocus
        />
        <button
          type="submit"
          className="bg-[#D4AF37] hover:bg-[#C09B2A] text-white font-serif px-6 py-3 rounded-full transition-colors shadow-md flex items-center justify-center w-full sm:w-auto"
        >
          <span>Send</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  )
}
