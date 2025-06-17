// app/components/FeatureCard.tsx
interface FeatureCardProps {
  number: string
  title: string
  description: string
  delay?: number
}

export default function FeatureCard({ number, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <div 
      className="bg-gray-900/80 border border-gray-800 rounded-xl p-6 flex gap-4 items-start shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/30 animate-float"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white font-bold text-lg flex-shrink-0">
        {number}
      </span>
      <div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}