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
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch marketplace context
    const [nftsResult, collectionsResult, statsResult] = await Promise.all([
      supabase
        .from('nfts')
        .select('name, price, blockchain, is_listed, views_count, likes_count, is_auction, current_bid')
        .eq('is_listed', true)
        .order('views_count', { ascending: false })
        .limit(10),
      supabase
        .from('collections')
        .select('name, floor_price, total_volume, total_supply, unique_owners, is_verified')
        .order('total_volume', { ascending: false })
        .limit(10),
      supabase
        .from('nfts')
        .select('blockchain, price')
        .eq('is_listed', true)
    ]);

    // Calculate marketplace stats
    const allNFTs = statsResult.data || [];
    const blockchainStats: Record<string, { count: number; avgPrice: number }> = {};
    
    allNFTs.forEach(nft => {
      if (!blockchainStats[nft.blockchain]) {
        blockchainStats[nft.blockchain] = { count: 0, avgPrice: 0 };
      }
      blockchainStats[nft.blockchain].count++;
      if (nft.price) {
        blockchainStats[nft.blockchain].avgPrice += nft.price;
      }
    });

    Object.keys(blockchainStats).forEach(chain => {
      if (blockchainStats[chain].count > 0) {
        blockchainStats[chain].avgPrice /= blockchainStats[chain].count;
      }
    });

    const marketContext = `
MARKETPLACE CONTEXT (use this to provide accurate information):

Trending NFTs:
${(nftsResult.data || []).map(nft => 
  `- "${nft.name}" on ${nft.blockchain}: ${nft.price ? `${nft.price} listed` : 'Not listed'} (${nft.views_count || 0} views)${nft.is_auction ? ` [AUCTION: Current bid ${nft.current_bid || 0}]` : ''}`
).join('\n')}

Top Collections:
${(collectionsResult.data || []).map(col => 
  `- "${col.name}": Floor ${col.floor_price || 0}, Volume ${col.total_volume || 0}, ${col.unique_owners || 0} owners${col.is_verified ? ' ✓' : ''}`
).join('\n')}

Blockchain Stats:
${Object.entries(blockchainStats).map(([chain, stats]) => 
  `- ${chain}: ${stats.count} listings, avg price ${stats.avgPrice.toFixed(4)}`
).join('\n')}
`;

    const systemPrompt = `You are ByteBucks AI Assistant, a helpful and knowledgeable guide for the ByteBucks NFT Marketplace. You help users:

1. Discover NFTs and collections
2. Understand how to buy, sell, and mint NFTs
3. Navigate the marketplace features
4. Get pricing insights and market trends
5. Answer questions about blockchain and NFT concepts

${marketContext}

Guidelines:
- Be friendly, concise, and helpful
- Use the marketplace context to provide accurate, up-to-date information
- If asked about specific NFTs or collections, reference the data provided
- For pricing questions, mention that prices vary and suggest using the AI Price Suggestion feature when minting
- Explain NFT concepts in simple terms for beginners
- If you don't have specific information, be honest and suggest where to find it
- Keep responses under 200 words unless more detail is needed`;

    console.log('Calling Lovable AI for chat response...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true,
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

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });

  } catch (error: unknown) {
    console.error('Error in nft-assistant:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
