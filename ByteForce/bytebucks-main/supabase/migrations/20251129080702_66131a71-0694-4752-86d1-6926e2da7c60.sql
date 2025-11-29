-- Create phone_verifications table for OTP storage
CREATE TABLE public.phone_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  otp TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- Allow the service role to manage all records (edge functions use service role)
CREATE POLICY "Service role can manage phone verifications"
ON public.phone_verifications
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for faster phone lookups
CREATE INDEX idx_phone_verifications_phone ON public.phone_verifications(phone);

-- Create trigger for updated_at
CREATE TRIGGER update_phone_verifications_updated_at
BEFORE UPDATE ON public.phone_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();