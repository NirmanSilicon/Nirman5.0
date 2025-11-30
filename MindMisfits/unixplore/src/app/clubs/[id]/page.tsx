'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Mail,
  ExternalLink,
  Calendar,
  Loader2,
  Globe,
  Instagram,
  Phone,
  Building2,
} from 'lucide-react';
import { getCategoryColor, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

import { recommendClubs, RecommendedClub } from '@/utils/recommendClubs';
import { clubs as allClubs } from '@/data/clubs';

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface Registration {
  id: number;
  title: string;
  description: string;
  registration_link: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface Club {
  id: number;
  name: string;
  email: string;
  description: string;
  about: string;
  contact_info: any;
  category_name: string;
  category_slug: string;
  college_id: number;
  college_name: string;
  college_code: string;
  announcements: Announcement[];
  registrations: Registration[];
}

export default function ClubPage() {
  const params = useParams();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  // Recommended clubs (ML)
  const [recommendedClubs, setRecommendedClubs] = useState<RecommendedClub[]>([]);

  useEffect(() => {
    const fetchClub = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/clubs/${params.id}`);
        const data = await response.json();

        if (data.success) {
          const clubData: Club = data.data;
          setClub(clubData);

          // ✔ Build interest text for ML
          const interestText = `${clubData.name ?? ''} ${clubData.description ?? ''}`;

          // ✔ Recommend similar clubs (excluding itself)
          const recs = recommendClubs(
            interestText,
            allClubs,
            clubData.category_name
          ).filter((c) => c.name !== clubData.name);

          setRecommendedClubs(recs);
        }
      } catch (error) {
        console.error('Error fetching club:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-white">Club not found</h1>
          <Link href="/colleges">
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
              Back to Colleges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40" />
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] opacity-40" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container-custom relative z-10 py-12">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <Link
            href={`/colleges/${club.college_id}`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {club.college_name}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{club.name}</h1>
                <Badge className={`${getCategoryColor(club.category_slug)} px-3 py-1 text-sm border-0`}>
                  {club.category_name}
                </Badge>
              </div>
              <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">{club.description}</p>
            </div>

            <Link
              href={`/colleges/${club.college_id}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <Building2 className="h-4 w-4" />
              <div>
                <p className="font-medium text-white">{club.college_name}</p>
                <p className="text-xs">{club.college_code}</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded-full" />
                About Us
              </h2>

              <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="prose prose-invert max-w-none text-gray-300">
                    {club.about ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{club.about}</p>
                    ) : (
                      <p className="text-gray-500 italic">No additional information available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.section>

            {/* Registrations */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-green-500 rounded-full" />
                Active Registrations
              </h2>

              {club.registrations?.length ? (
                <div className="space-y-4">
                  {club.registrations.map((reg) => (
                    <Card key={reg.id} className="bg-white/5 border-white/10 hover:border-primary/40 transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl text-white">{reg.title}</h3>
                              <Badge variant={reg.status === 'open' ? 'default' : 'secondary'}>
                                {reg.status}
                              </Badge>
                            </div>

                            {reg.description && <p className="text-gray-400 text-sm">{reg.description}</p>}

                            {(reg.start_date || reg.end_date) && (
                              <p className="text-gray-500 text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {reg.start_date && `From ${formatDate(reg.start_date)}`}
                                {reg.end_date && ` to ${formatDate(reg.end_date)}`}
                              </p>
                            )}
                          </div>

                          {reg.registration_link && (
                            <a href={reg.registration_link} target="_blank" rel="noopener noreferrer">
                              <Button className="bg-white text-black hover:bg-gray-200">
                                Register Now
                                <ExternalLink className="ml-2 w-4 h-4" />
                              </Button>
                            </a>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/5 border-white/10 border-dashed">
                  <CardContent className="py-12 text-center text-gray-500">
                    No active registrations.
                  </CardContent>
                </Card>
              )}
            </motion.section>

            {/* Announcements */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-500 rounded-full" />
                Announcements
              </h2>

              {club.announcements?.length ? (
                <div className="space-y-4">
                  {club.announcements.map((a) => (
                    <Card key={a.id} className="bg-white/5 border-white/10">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="text-white">{a.title}</CardTitle>
                          <span className="text-xs text-gray-500 bg-white/10 px-2 py-1 rounded">
                            {formatDate(a.created_at)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className="prose prose-invert text-gray-300"
                          dangerouslySetInnerHTML={{ __html: a.content }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white/5 border-white/10 border-dashed">
                  <CardContent className="py-12 text-center text-gray-500">
                    No announcements yet.
                  </CardContent>
                </Card>
              )}
            </motion.section>
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Contact */}
            <Card className="bg-white/5 border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <a
                    href={`mailto:${club.email}`}
                    className="text-white hover:text-primary text-sm truncate"
                  >
                    {club.email}
                  </a>
                </div>

                {/* Phone */}
                {club.contact_info?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-white text-sm">{club.contact_info.phone}</p>
                  </div>
                )}

                {/* Website */}
                {club.contact_info?.website && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-500" />
                    </div>
                    <a
                      href={club.contact_info.website}
                      target="_blank"
                      className="text-white hover:text-blue-500 text-sm truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Instagram */}
                {club.contact_info?.instagram && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Instagram className="h-5 w-5 text-pink-500" />
                    </div>
                    <a
                      href={`https://instagram.com/${club.contact_info.instagram.replace('@', '')}`}
                      target="_blank"
                      className="text-white hover:text-pink-500 text-sm"
                    >
                      {club.contact_info.instagram}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recommended Clubs */}
            {recommendedClubs.length > 0 && (
              <Card className="bg-white/5 border-white/10 sticky top-[420px]">
                <CardHeader>
                  <CardTitle className="text-white text-base">
                    Similar Clubs You May Like
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendedClubs.map((rec) => (
                    <div key={rec.id} className="rounded-lg border border-white/10 bg-black/40 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-white font-semibold">{rec.name}</p>
                        {rec.category && (
                          <Badge variant="outline" className="text-[10px] border-white/20 text-gray-200">
                            {rec.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3">{rec.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
