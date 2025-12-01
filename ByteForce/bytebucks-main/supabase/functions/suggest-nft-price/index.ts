import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, description, blockchain, traits } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client to fetch similar NFTs
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch similar NFTs from the same blockchain with prices
    const { data: similarNFTs, error } = await supabase
      .from('nfts')
      .select('name, price, price_usd, blockchain, traits, is_listed, views_count, likes_count')
      .eq('blockchain', blockchain)
      .eq('is_listed', true)
      .not('price', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching similar NFTs:', error);
    }

    // Prepare market context for AI
    const marketContext = similarNFTs && similarNFTs.length > 0
      ? `Here are recent ${blockchain} NFT listings for context:\n${similarNFTs.map(nft => 
          `- "${nft.name}": ${nft.price} (${nft.views_count || 0} views, ${nft.likes_count || 0} likes)`
        ).join('\n')}`
      : `No recent ${blockchain} NFT listings found for comparison.`;

    // Calculate basic stats
    const prices = similarNFTs?.filter(n => n.price).map(n => n.price) || [];
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    const prompt = `You are an expert NFT pricing analyst for a marketplace. Analyze the following NFT and suggest an optimal listing price.

NFT Details:
- Name: ${name || 'Unnamed'}
- Description: ${description || 'No description'}
- Blockchain: ${blockchain}
- Traits: ${traits ? JSON.stringify(traits) : 'None specified'}

Market Data for ${blockchain} NFTs:
${marketContext}

Statistics:
- Average listing price: ${avgPrice ? avgPrice.toFixed(4) : 'N/A'}
- Price range: ${minPrice ? minPrice.toFixed(4) : 'N/A'} - ${maxPrice ? maxPrice.toFixed(4) : 'N/A'}

Based on this analysis, provide:
1. A suggested price (single number)
2. A price range (min-max)
3. Brief reasoning (2-3 sentences)

Respond in JSON format:
{
  "suggestedPrice": <number>,
  "minPrice": <number>,
  "maxPrice": <number>,
  "reasoning": "<string>",
  "confidence": "<low|medium|high>"
}`;

    console.log('Calling Lovable AI for price suggestion...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert NFT pricing analyst. Always respond with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI response:', content);

    // Parse JSON from response
    let suggestion;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      suggestion = JSON.parse(jsonMatch[1].trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to basic suggestion based on market data
      suggestion = {
        suggestedPrice: avgPrice || 0.1,
        minPrice: minPrice || 0.05,
        maxPrice: maxPrice || 0.5,
        reasoning: 'Based on current market averages for similar NFTs on this blockchain.',
        confidence: 'medium'
      };
    }

    return new Response(JSON.stringify(suggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in suggest-nft-price:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
