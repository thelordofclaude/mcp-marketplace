'use client'

import SearchBar from '../components/SearchBar'
import FeaturedBar from '../components/FeaturedBar'
import HeroCarousel from '../components/HeroCarousel'
import NewsGrid from '../components/NewsGrid'

export default function HomePage() {
  return (
    <div>
      <SearchBar />
      <FeaturedBar />
      <HeroCarousel />
      <NewsGrid />
    </div>
  )
}
