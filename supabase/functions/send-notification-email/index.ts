import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  type: 'quote_request' | 'custom_plan' | 'schedule_call' | 'growth_audit';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  business_name?: string;
  business_type?: string;
  description?: string;
  budget_range?: string;
  timeline?: string;
  website_instagram?: string;
  desired_results?: string;
  biggest_challenge?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: NotificationEmailRequest = await req.json();
    console.log("Received notification request:", requestData);

    let subject = "";
    let adminEmailContent = "";
    let customerEmailContent = "";

    switch (requestData.type) {
      case 'quote_request':
        subject = `New Quote Request from ${requestData.name}`;
        adminEmailContent = `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</p>
          <p><strong>Business Name:</strong> ${requestData.business_name || 'Not provided'}</p>
          <p><strong>Business Type:</strong> ${requestData.business_type || 'Not provided'}</p>
          <p><strong>Description:</strong> ${requestData.description || 'Not provided'}</p>
          <p><strong>Budget Range:</strong> ${requestData.budget_range || 'Not provided'}</p>
          <p><strong>Timeline:</strong> ${requestData.timeline || 'Not provided'}</p>
        `;
        customerEmailContent = `
          <h2>Thank you for your quote request!</h2>
          <p>Hi ${requestData.name},</p>
          <p>We have received your quote request and will get back to you within 24 hours.</p>
          <p>Our team will review your requirements and provide you with a detailed proposal.</p>
          <p>Best regards,<br>The LEVRA Team</p>
        `;
        break;

      case 'custom_plan':
        subject = `New Custom Plan Request from ${requestData.name}`;
        adminEmailContent = `
          <h2>New Custom Plan Request</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${requestData.message || 'Not provided'}</p>
        `;
        customerEmailContent = `
          <h2>Thank you for your interest in our custom solutions!</h2>
          <p>Hi ${requestData.name},</p>
          <p>We're excited to help you build a tailored growth solution for your business.</p>
          <p>Our team will contact you within 24 hours to discuss your specific needs and create a custom plan just for you.</p>
          <p>Best regards,<br>The LEVRA Team</p>
        `;
        break;

      case 'schedule_call':
        subject = `New Call Request from ${requestData.name}`;
        adminEmailContent = `
          <h2>New Call Scheduling Request</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${requestData.message || 'Not provided'}</p>
        `;
        customerEmailContent = `
          <h2>Thank you for booking a free call!</h2>
          <p>Hi ${requestData.name},</p>
          <p>We're excited to speak with you about how we can help grow your business.</p>
          <p>Our team will contact you within 24 hours to schedule your free consultation call.</p>
          <p>Best regards,<br>The LEVRA Team</p>
        `;
        break;

      case 'growth_audit':
        subject = `New Growth Audit Request from ${requestData.name}`;
        adminEmailContent = `
          <h2>New Growth Audit Request</h2>
          <p><strong>Name:</strong> ${requestData.name}</p>
          <p><strong>Email:</strong> ${requestData.email}</p>
          <p><strong>Phone:</strong> ${requestData.phone || 'Not provided'}</p>
          <p><strong>Website/Instagram:</strong> ${requestData.website_instagram || 'Not provided'}</p>
          <p><strong>Desired Results:</strong> ${requestData.desired_results || 'Not provided'}</p>
          <p><strong>Biggest Challenge:</strong> ${requestData.biggest_challenge || 'Not provided'}</p>
        `;
        customerEmailContent = `
          <h2>Thank you for requesting a free growth audit!</h2>
          <p>Hi ${requestData.name},</p>
          <p>We're excited to help analyze your business and provide actionable growth recommendations.</p>
          <p>Our team will conduct your audit and send you a detailed report within 48 hours.</p>
          <p>Best regards,<br>The LEVRA Team</p>
        `;
        break;
    }

    // Send email to admin (using verified email in test mode)
    const adminEmailResponse = await resend.emails.send({
      from: "LEVRA Notifications <notifications@kanhayadav1610@gmail.com>",
      to: ["kanhayadav1610@gmail.com"],
      subject: subject,
      html: adminEmailContent,
    });

    console.log("Admin email sent successfully:", adminEmailResponse);

    // Send confirmation email to customer (test mode - only to verified email)
    const customerEmailResponse = await resend.emails.send({
      from: "LEVRA <hello@kanhayadav1610@gmail.com>",
      to: ["kanhayadav1610@gmail.com"], // In production, change to [requestData.email]
      subject: "Thank you for contacting LEVRA!",
      html: customerEmailContent,
    });

    console.log("Customer email sent successfully:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmailId: adminEmailResponse.data?.id,
        customerEmailId: customerEmailResponse.data?.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);