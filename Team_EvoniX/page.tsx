import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import RoadmapCard from '@/components/dashboard/RoadmapCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Award, Star, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) {
    redirect('/survey')
  }

  // Fetch survey results
  const { data: survey } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Fetch points
  const { data: points } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Fetch badges
  const { data: badges } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id)

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profile.full_name}!</h1>
        <p className="text-muted-foreground">Here's your AI adoption progress</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Points Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{points?.points || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Level {points?.level || 1}
            </p>
            <Progress value={((points?.points || 0) % 100)} className="mt-3" />
            <p className="text-xs text-muted-foreground mt-2">
              {100 - ((points?.points || 0) % 100)} points to next level
            </p>
          </CardContent>
        </Card>

        {/* AI Readiness Score */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Readiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{survey?.ai_readiness_score}/100</div>
            <Progress value={survey?.ai_readiness_score} className="mt-3" />
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{badges?.length || 0}</div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {badges?.slice(0, 3).map((ub) => (
                <Badge key={ub.id} variant="secondary">
                  {ub.badges.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roadmap */}
      {survey?.roadmap && (
        <RoadmapCard
          steps={survey.roadmap}
          score={survey.ai_readiness_score}
        />
      )}
    </div>
  )
}
