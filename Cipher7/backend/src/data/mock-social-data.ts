/**
 * Large-Scale Mock Social Media Data
 * Comprehensive datasets for Google Trends, Reddit, Twitter simulations
 */

export const healthKeywords = [
  "fever", "cough", "headache", "cold", "flu", "dengue", "malaria",
  "covid", "coronavirus", "fever symptoms", "cough symptoms", "body pain",
  "vomiting", "diarrhea", "nausea", "rash", "joint pain", "muscle pain",
  "sore throat", "runny nose", "fatigue", "typhoid", "chikungunya",
];

export const indianStatesShort = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Kerala",
  "Gujarat", "Rajasthan", "West Bengal", "Uttar Pradesh", "Bihar",
  "Madhya Pradesh", "Punjab", "Odisha", "Assam", "Haryana",
];

export function generateGoogleTrendsData(keywords: string[], timeframe: string = "today 3-m") {
  return keywords.map((keyword) => {
    const baseInterest = Math.floor(Math.random() * 60) + 20;
    const trendDirection = Math.random() > 0.5 ? "rising" : Math.random() > 0.7 ? "falling" : "stable";
    const trendValue = trendDirection === "rising" 
      ? Math.floor(Math.random() * 30) + 10
      : trendDirection === "falling"
      ? Math.floor(Math.random() * 20) + 5
      : Math.floor(Math.random() * 10);
    
    return {
      keyword,
      interest: baseInterest,
      trend: trendDirection,
      trendValue,
      relatedQueries: [
        `${keyword} symptoms`,
        `${keyword} treatment`,
        `${keyword} in india`,
      ],
      geographicData: indianStatesShort.map((state) => ({
        state,
        interest: Math.floor(Math.random() * 100),
      })),
    };
  });
}

export function generateRedditPosts(keywords: string[], limit: number = 20) {
  const posts = [];
  const subreddits = [
    "r/india", "r/Health", "r/medical", "r/AskDocs", "r/COVID19",
    "r/indiahealth", "r/publichealth",
  ];
  
  const sampleTitles = [
    "High fever for 3 days, should I be worried?",
    "Anyone else experiencing severe cough?",
    "Dengue cases rising in my area",
    "Is it normal to have body pain after fever?",
    "Malaria symptoms - need advice",
    "Cold and flu going around",
    "COVID symptoms still lingering",
    "Should I get tested for typhoid?",
    "Chikungunya joint pain help",
    "Fever with rash - what could it be?",
  ];
  
  for (let i = 0; i < Math.min(limit, 50); i++) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    const subreddit = subreddits[Math.floor(Math.random() * subreddits.length)];
    
    const hoursAgo = Math.floor(Math.random() * 72);
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    
    posts.push({
      id: `reddit_${Date.now()}_${i}`,
      title,
      subreddit,
      author: `user_${Math.floor(Math.random() * 1000)}`,
      url: `https://reddit.com/${subreddit}/posts/${Math.floor(Math.random() * 100000)}`,
      score: Math.floor(Math.random() * 500) + 1,
      numComments: Math.floor(Math.random() * 100),
      createdAt: createdAt.toISOString(),
      content: generateRedditContent(keyword),
      keywords: [keyword, ...healthKeywords.filter(() => Math.random() > 0.7).slice(0, 2)],
      location: indianStatesShort[Math.floor(Math.random() * indianStatesShort.length)],
    });
  }
  
  return posts;
}

function generateRedditContent(keyword: string): string {
  const templates = [
    `I've been experiencing ${keyword} for the past few days. Anyone else facing similar issues?`,
    `Looking for advice on ${keyword} symptoms. Doctor suggested rest but not getting better.`,
    `Is there an outbreak of ${keyword} in your area too? My whole family is affected.`,
    `${keyword} cases seem to be rising. Anyone know what's causing this?`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export function generateTwitterPosts(keywords: string[], limit: number = 20) {
  const tweets = [];
  const sampleTexts = [
    "High fever and headache since yesterday 😷 #StaySafe",
    "Dengue cases are increasing in my neighborhood. Please take precautions!",
    "Anyone else dealing with severe cough and cold?",
    "Malaria symptoms are no joke. Take care everyone!",
    "COVID is still around. Don't let your guard down!",
    "Feeling unwell with body pain and fever",
    "Cold and flu season is here. Stay hydrated!",
    "Typhoid symptoms - when should I see a doctor?",
    "Chikungunya joint pain is unbearable",
    "Fever with rash spreading. Should I be concerned?",
  ];
  
  for (let i = 0; i < Math.min(limit, 50); i++) {
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    
    const hoursAgo = Math.floor(Math.random() * 48);
    const createdAt = new Date();
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    
    tweets.push({
      id: `tweet_${Date.now()}_${i}`,
      text,
      author: `@user${Math.floor(Math.random() * 10000)}`,
      username: `user${Math.floor(Math.random() * 10000)}`,
      retweetCount: Math.floor(Math.random() * 100),
      likeCount: Math.floor(Math.random() * 500),
      replyCount: Math.floor(Math.random() * 50),
      createdAt: createdAt.toISOString(),
      keywords: [keyword, ...healthKeywords.filter(() => Math.random() > 0.7).slice(0, 2)],
      location: indianStatesShort[Math.floor(Math.random() * indianStatesShort.length)],
      hashtags: ["#Health", "#StaySafe", "#PublicHealth"].filter(() => Math.random() > 0.5),
    });
  }
  
  return tweets;
}

export function generateTimeSeriesData(days: number = 30, baseCount: number = 10) {
  const data = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some trend and noise
    const trend = i < days / 2 ? 0 : 2; // Slight upward trend in latter half
    const noise = (Math.random() - 0.5) * 5;
    const weeklyPattern = Math.sin((i / 7) * 2 * Math.PI) * 3;
    
    const count = Math.max(0, Math.floor(baseCount + trend + noise + weeklyPattern));
    
    data.push({
      date: date.toISOString().split("T")[0],
      count,
      timestamp: date.toISOString(),
    });
  }
  
  return data;
}

