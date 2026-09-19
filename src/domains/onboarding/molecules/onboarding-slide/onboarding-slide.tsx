import type { ReactNode } from 'react'
import './onboarding-slide.scss'

type OnboardingSlideProps = {
  eyebrow: string
  title: ReactNode
  text: string
  children: ReactNode
}

// Cadre commun des étapes : un titre qui monte en douceur, puis le visuel animé de l'étape.
export const OnboardingSlide = ({ eyebrow, title, text, children }: OnboardingSlideProps) => (
  <section className="onboarding-slide">
    <header className="onboarding-slide__head">
      <p className="onboarding-slide__eyebrow">{eyebrow}</p>
      <h1 className="onboarding-slide__title">{title}</h1>
      <p className="onboarding-slide__text">{text}</p>
    </header>
    <div className="onboarding-slide__visual">{children}</div>
  </section>
)
