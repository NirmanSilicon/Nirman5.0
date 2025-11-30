import { Play } from "lucide-react"

export function VideoSection() {
  return (
    <section className="w-full py-16 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        <h2 className="text-4xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
          How it works – a video
        </h2>

        <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-primary/90 transition-colors">
                <Play className="w-10 h-10 text-primary-foreground ml-1" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-foreground">Video Space</p>
                <p className="text-muted-foreground">Discover the Ayurvedic Process</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
