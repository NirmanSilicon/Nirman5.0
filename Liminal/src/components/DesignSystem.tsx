import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { XPBar } from "./XPBar";
import { RiskMeter } from "./RiskMeter";
import { SparklineChart } from "./SparklineChart";
import { Wallet, TrendingUp, Zap, Award, Target, Shield } from "lucide-react";

export function DesignSystem() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1>Fin-Forge Design System</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A comprehensive component library and design token reference for the Fin-Forge gamified finance learning platform
            </p>
          </div>

          {/* Color Palette */}
          <section className="space-y-6">
            <div>
              <h2>Color Palette</h2>
              <p className="text-muted-foreground">Brand colors and semantic tokens</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <h3 className="mb-4">Primary Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--navy)] border" />
                    <div>
                      <p>Navy</p>
                      <code className="text-muted-foreground">#0B2545</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--teal)] border" />
                    <div>
                      <p>Teal</p>
                      <code className="text-muted-foreground">#17A2B8</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--gold)] border" />
                    <div>
                      <p>Gold</p>
                      <code className="text-muted-foreground">#FFC857</code>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Semantic Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--success)] border" />
                    <div>
                      <p>Success</p>
                      <code className="text-muted-foreground">#10b981</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-[var(--risk)] border" />
                    <div>
                      <p>Risk</p>
                      <code className="text-muted-foreground">#f97316</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-destructive border" />
                    <div>
                      <p>Destructive</p>
                      <code className="text-muted-foreground">#ef4444</code>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Neutral Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-background border" />
                    <div>
                      <p>Background</p>
                      <code className="text-muted-foreground">#F7FAFC</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-card border" />
                    <div>
                      <p>Card</p>
                      <code className="text-muted-foreground">#ffffff</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted border" />
                    <div>
                      <p>Muted</p>
                      <code className="text-muted-foreground">#e2e8f0</code>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* Typography */}
          <section className="space-y-6">
            <div>
              <h2>Typography</h2>
              <p className="text-muted-foreground">Font family: Inter or Poppins, with semantic heading and body styles</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h1>Heading 1 - 36-48px</h1>
                  <code className="text-muted-foreground">{"<h1>"} - Medium weight</code>
                </div>
                <div>
                  <h2>Heading 2 - 28px</h2>
                  <code className="text-muted-foreground">{"<h2>"} - Medium weight</code>
                </div>
                <div>
                  <h3>Heading 3 - 20px</h3>
                  <code className="text-muted-foreground">{"<h3>"} - Medium weight</code>
                </div>
                <div>
                  <h4>Heading 4 - 16px</h4>
                  <code className="text-muted-foreground">{"<h4>"} - Medium weight</code>
                </div>
                <div>
                  <p>Body Text - 16px</p>
                  <code className="text-muted-foreground">{"<p>"} - Regular weight</code>
                </div>
                <div>
                  <p className="text-muted-foreground">Muted Text - 16px</p>
                  <code className="text-muted-foreground">text-muted-foreground</code>
                </div>
              </div>
            </Card>
          </section>

          {/* Buttons */}
          <section className="space-y-6">
            <div>
              <h2>Buttons</h2>
              <p className="text-muted-foreground">Three button variants with hover and active states</p>
            </div>

            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Button</Button>
                <Button disabled>Disabled Button</Button>
              </div>
            </Card>
          </section>

          {/* Badges */}
          <section className="space-y-6">
            <div>
              <h2>Badges</h2>
              <p className="text-muted-foreground">Status indicators and tags</p>
            </div>

            <Card className="p-6">
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-[var(--success)] text-white">Success</Badge>
                <Badge className="bg-accent/10 text-accent-foreground border-accent/20">XP Reward</Badge>
              </div>
            </Card>
          </section>

          {/* Custom Components */}
          <section className="space-y-6">
            <div>
              <h2>Custom Components</h2>
              <p className="text-muted-foreground">Fin-Forge specific UI components</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="mb-4">XP Bar</h3>
                <XPBar currentXP={2450} maxXP={3000} level={5} />
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Risk Meter</h3>
                <RiskMeter riskLevel={65} />
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Progress Bar</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>75% Complete</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>50% Complete</span>
                    </div>
                    <Progress value={50} />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="mb-4">Sparkline Chart</h3>
                <SparklineChart data={[100, 150, 120, 180, 200, 190, 250, 280]} height={60} />
              </Card>
            </div>
          </section>

          {/* Icons */}
          <section className="space-y-6">
            <div>
              <h2>Icons</h2>
              <p className="text-muted-foreground">Lucide icons used throughout the application</p>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Wallet className="w-8 h-8 text-primary" />
                  <span className="text-muted-foreground">Wallet</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TrendingUp className="w-8 h-8 text-[var(--success)]" />
                  <span className="text-muted-foreground">Trending</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Zap className="w-8 h-8 text-accent-foreground" />
                  <span className="text-muted-foreground">Zap</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Award className="w-8 h-8 text-primary" />
                  <span className="text-muted-foreground">Award</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Target className="w-8 h-8 text-[var(--success)]" />
                  <span className="text-muted-foreground">Target</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Shield className="w-8 h-8 text-secondary-foreground" />
                  <span className="text-muted-foreground">Shield</span>
                </div>
              </div>
            </Card>
          </section>

          {/* Spacing */}
          <section className="space-y-6">
            <div>
              <h2>Spacing & Layout</h2>
              <p className="text-muted-foreground">8px grid system with 4px baseline</p>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-4 bg-primary rounded" />
                  <code>4px</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-8 bg-primary rounded" />
                  <code>8px</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 bg-primary rounded" />
                  <code>12px</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded" />
                  <code>16px</code>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-24 bg-primary rounded" />
                  <code>24px</code>
                </div>
              </div>
            </Card>
          </section>

          {/* Border Radius */}
          <section className="space-y-6">
            <div>
              <h2>Border Radius</h2>
              <p className="text-muted-foreground">Consistent rounding for cards and components</p>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className="w-full h-24 bg-primary rounded" />
                  <code>8px - sm</code>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-primary rounded-lg" />
                  <code>12px - lg</code>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-primary rounded-xl" />
                  <code>16px - xl</code>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-24 bg-primary rounded-full" />
                  <code>999px - full</code>
                </div>
              </div>
            </Card>
          </section>

          {/* Developer Notes */}
          <section className="space-y-6">
            <div>
              <h2>Developer Integration Notes</h2>
              <p className="text-muted-foreground">Implementation guidance for charts and interactive components</p>
            </div>

            <Card className="p-6 space-y-4">
              <div>
                <h3 className="mb-2">Chart Integration (Recharts)</h3>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>All charts use Recharts library for consistency</li>
                  <li>Color scheme follows CSS variables for theme support</li>
                  <li>Data format: Array of objects with numeric values</li>
                  <li>Responsive container ensures proper sizing across breakpoints</li>
                  <li>Tooltips styled to match card backgrounds</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2">Component Props</h3>
                <div className="space-y-2">
                  <code className="block p-2 bg-muted rounded">
                    XPBar: currentXP: number, maxXP: number, level: number
                  </code>
                  <code className="block p-2 bg-muted rounded">
                    RiskMeter: riskLevel: number (0-100), label?: string
                  </code>
                  <code className="block p-2 bg-muted rounded">
                    CompoundInterestVisualizer: Interactive with Slider controls
                  </code>
                </div>
              </div>

              <div>
                <h3 className="mb-2">Animation Guidelines</h3>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                  <li>Use Motion (motion/react) for page transitions and interactions</li>
                  <li>Card hover: translate Y -8px with scale 1.02</li>
                  <li>Progress bars: 0.6-0.8s ease-out animation</li>
                  <li>Chart data: 800ms draw animation on mount</li>
                </ul>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
