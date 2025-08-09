'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Promotion } from '@/types'

interface PromotionsCarouselProps {
  promotions: Promotion[]
}

export function PromotionsCarousel({ promotions }: PromotionsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)

  const activePromotions = promotions.filter(promo => promo.isActive)

  useEffect(() => {
    if (activePromotions.length === 0) return

    const interval = setInterval(() => {
      if (!isScrolling) {
        setCurrentIndex((prevIndex) => 
          prevIndex === activePromotions.length - 1 ? 0 : prevIndex + 1
        )
      }
    }, 5000) // Auto-scroll every 5 seconds

    return () => clearInterval(interval)
  }, [activePromotions.length, isScrolling])

  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.children[0]?.clientWidth || 0
      const gap = 16 // 1rem gap
      const scrollLeft = currentIndex * (cardWidth + gap)
      
      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  const handlePromotionClick = (promotion: Promotion) => {
    switch (promotion.buttonAction) {
      case 'referral':
        // Navigate to referral page (would be implemented)
        window.alert(`Referral Program: ${promotion.title}\n\n${promotion.description}`)
        break
      case 'plans':
        window.location.href = '/plans'
        break
      case 'top-up':
        window.location.href = '/top-up'
        break
      default:
        console.log('Unknown promotion action:', promotion.buttonAction)
    }
  }

  const handleScroll = () => {
    setIsScrolling(true)
    clearTimeout((window as any).scrollTimeout)
    ;(window as any).scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
    }, 1500)
  }

  if (activePromotions.length === 0) return null

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-esimphony-black flex items-center">
            <i className="fas fa-gift text-esimphony-red mr-2"></i>
            Promotions
          </h2>
          {activePromotions.length > 1 && (
            <div className="flex space-x-1">
              {activePromotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentIndex === index 
                      ? 'bg-esimphony-red' 
                      : 'bg-esimphony-gray opacity-50'
                  }`}
                  aria-label={`Go to promotion ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-4 px-4 pb-4"
        onScroll={handleScroll}
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {activePromotions.map((promotion) => (
          <div
            key={promotion.id}
            className="flex-shrink-0 w-72 bg-gradient-to-r from-esimphony-red to-red-600 text-esimphony-white rounded-lg p-4 cursor-pointer transition-transform hover:scale-105"
            onClick={() => handlePromotionClick(promotion)}
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">
                  {promotion.title}
                </h3>
                {promotion.subtitle && (
                  <p className="text-sm text-red-100 mb-2">
                    {promotion.subtitle}
                  </p>
                )}
                <p className="text-sm text-red-100 leading-relaxed">
                  {promotion.description}
                </p>
              </div>
              
              {promotion.type === 'referral' && (
                <div className="ml-3">
                  <i className="fas fa-users text-2xl text-red-200"></i>
                </div>
              )}
              
              {promotion.type === 'seasonal' && (
                <div className="ml-3">
                  <i className="fas fa-snowflake text-2xl text-red-200"></i>
                </div>
              )}
              
              {promotion.type === 'regional' && (
                <div className="ml-3">
                  <i className="fas fa-globe text-2xl text-red-200"></i>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-red-200">
                {promotion.validUntil && `Valid until ${promotion.validUntil}`}
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="bg-esimphony-white text-esimphony-red hover:bg-red-50 border-0 font-semibold"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePromotionClick(promotion)
                }}
              >
                {promotion.buttonText}
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Card>
  )
}