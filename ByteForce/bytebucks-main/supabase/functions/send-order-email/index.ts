import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-ORDER-EMAIL] ${step}${detailsStr}`);
};

interface OrderEmailRequest {
  email: string;
  orderId: string;
  items: Array<{
    name: string;
    price: number;
    blockchain: string;
    image_url?: string;
  }>;
  totalAmount: number;
  discountApplied: number;
  paymentMethod: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const { email, orderId, items, totalAmount, discountApplied, paymentMethod }: OrderEmailRequest = await req.json();
    logStep("Received request", { email, orderId, itemCount: items.length });

    // Generate items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;" />` : ''}
            <div>
              <strong>${item.name}</strong>
              <div style="color: #666; font-size: 12px; text-transform: capitalize;">${item.blockchain}</div>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.price.toFixed(4)} ETH
          <div style="color: #666; font-size: 12px;">~$${(item.price * 2000).toFixed(2)}</div>
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Thank you for your purchase on ByteBucks</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; color: #666; font-size: 14px;">Order ID</p>
              <p style="margin: 5px 0 0; font-family: monospace; font-size: 14px; color: #333;">${orderId}</p>
            </div>
            
            <h2 style="font-size: 18px; margin: 0 0 15px; color: #333;">Order Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: 600;">Item</th>
                  <th style="text-align: right; padding: 12px; border-bottom: 2px solid #eee; color: #666; font-weight: 600;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
              ${discountApplied > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #22c55e;">
                  <span>Reward Discount</span>
                  <span>-${discountApplied.toFixed(4)} ETH</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #666;">
                <span>Network Fee</span>
                <span>~0.001 ETH</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #333; margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea;">
                <span>Total</span>
                <span>${totalAmount.toFixed(4)} ETH</span>
              </div>
              <div style="text-align: right; color: #666; font-size: 14px;">
                ~$${(totalAmount * 2000).toFixed(2)} USD
              </div>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #666;">
                <strong>Payment Method:</strong> ${paymentMethod === 'card' ? 'Credit Card (Stripe)' : 'Crypto Wallet'}
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Your NFTs have been transferred to your account and are now available in your portfolio.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #999; font-size: 12px;">
            <p>© 2024 ByteBucks NFT Marketplace. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    logStep("Sending email via Resend API", { to: email });

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ByteBucks <onboarding@resend.dev>",
        to: [email],
        subject: `Order Confirmed - ${orderId.slice(0, 8)}`,
        html: emailHtml,
      }),
    });

    const emailResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(emailResponse.message || "Failed to send email");
    }

    logStep("Email sent successfully", { response: emailResponse });

    return new Response(JSON.stringify({ success: true, response: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
