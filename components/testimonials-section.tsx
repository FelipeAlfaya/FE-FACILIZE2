"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    content:
      "A Facilize transformou completamente a gestão do meu consultório. Economizo horas por semana com a emissão automática de notas fiscais e o sistema de agendamentos.",
    author: "Dra. Carla Mendes",
    role: "Psicóloga",
    avatar: "/images/testimonial-1.jpg",
  },
  {
    id: 2,
    content:
      "Como contador, recomendo a Facilize para todos os meus clientes. A plataforma é intuitiva e mantém tudo em conformidade com a legislação fiscal, facilitando muito o meu trabalho.",
    author: "Ricardo Oliveira",
    role: "Contador",
    avatar: "/images/testimonial-2.jpg",
  },
  {
    id: 3,
    content:
      "O chatbot integrado ao WhatsApp melhorou muito a comunicação com meus clientes. As confirmações automáticas reduziram as faltas em mais de 70%!",
    author: "Fernanda Costa",
    role: "Fisioterapeuta",
    avatar: "/images/testimonial-3.jpg",
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  const next = () => {
    setCurrent((current) => (current === testimonials.length - 1 ? 0 : current + 1))
  }

  const prev = () => {
    setCurrent((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  }

  useEffect(() => {
    if (!autoplay) return

    const interval = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(interval)
  }, [autoplay])

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold"
          >
            O que nossos <span className="text-blue-600">clientes</span> dizem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600 mt-4 max-w-2xl mx-auto"
          >
            Milhares de profissionais e pequenas empresas já transformaram seus negócios com a Facilize
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div
            className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <button
              onClick={prev}
              className="bg-white rounded-full p-2 shadow-lg text-gray-800 hover:text-blue-600 transition-colors duration-300 pointer-events-auto"
              aria-label="Anterior"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="bg-white rounded-full p-2 shadow-lg text-gray-800 hover:text-blue-600 transition-colors duration-300 pointer-events-auto"
              aria-label="Próximo"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="overflow-hidden relative h-[300px] md:h-[250px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="bg-white rounded-xl p-8 shadow-lg h-full flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/3 flex-shrink-0 flex justify-center">
                    <div className="relative w-24 h-24 md:w-32 md:h-32">
                      <Image
                        src={testimonials[current].avatar || "/placeholder.svg"}
                        alt={testimonials[current].author}
                        fill
                        className="rounded-full object-cover border-4 border-white shadow-md"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                      <div className="absolute -top-2 -left-2 bg-blue-500 rounded-full p-2">
                        <Quote size={16} className="text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <p className="text-gray-700 italic mb-4">{testimonials[current].content}</p>
                    <div>
                      <h4 className="font-bold text-lg">{testimonials[current].author}</h4>
                      <p className="text-gray-500">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-blue-600 w-6" : "bg-gray-300"
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
