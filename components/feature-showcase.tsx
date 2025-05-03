"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeatureShowcaseProps {
  title: string
  description: string
  image: string
  imageAlt: string
  features: string[]
  ctaText: string
  ctaLink: string
  reversed?: boolean
  icon?: ReactNode
}

export default function FeatureShowcase({
  title,
  description,
  image,
  imageAlt,
  features,
  ctaText,
  ctaLink,
  reversed = false,
  icon,
}: FeatureShowcaseProps) {
  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className={`grid md:grid-cols-2 gap-12 items-center ${reversed ? "md:grid-flow-dense" : ""}`}>
        <motion.div
          initial={{ opacity: 0, x: reversed ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-4">
            {icon && <div className="text-blue-600 dark:text-blue-400">{icon}</div>}
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          <p className="text-muted-foreground mb-8">{description}</p>

          <ul className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <svg
                  className="mr-3 h-6 w-6 flex-shrink-0 text-green-500 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>{feature}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href={ctaLink}>
              <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                {ctaText}
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="rounded-lg overflow-hidden shadow-lg border border-border"
          initial={{ opacity: 0, x: reversed ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={imageAlt}
            width={600}
            height={400}
            className="w-full h-auto object-cover"
          />
        </motion.div>
      </div>
    </div>
  )
}
