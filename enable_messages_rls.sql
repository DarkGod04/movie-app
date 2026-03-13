-- 1. Enable RLS on the messages table
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

-- 2. Allow PUBLIC (anyone) to insert new messages (for your Contact.jsx page)
-- This allows guests and logged-in users to submit the contact form.
DROP POLICY IF EXISTS "Allow public insert to messages" ON "public"."messages";
CREATE POLICY "Allow public insert to messages" 
ON "public"."messages" 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 3. Allow only specific Admin emails to view (SELECT) messages (for MessagesManager.jsx)
DROP POLICY IF EXISTS "Allow admins to select messages" ON "public"."messages";
CREATE POLICY "Allow admins to select messages" 
ON "public"."messages" 
FOR SELECT 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('nikhilkumarsingh004@gmail.com', 'admin@quickshow.com')
);

-- 4. Allow only specific Admin emails to update messages (for status changes)
DROP POLICY IF EXISTS "Allow admins to update messages" ON "public"."messages";
CREATE POLICY "Allow admins to update messages" 
ON "public"."messages" 
FOR UPDATE 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('nikhilkumarsingh004@gmail.com', 'admin@quickshow.com')
)
WITH CHECK (
  auth.jwt() ->> 'email' IN ('nikhilkumarsingh004@gmail.com', 'admin@quickshow.com')
);

-- 5. Allow only specific Admin emails to delete messages
DROP POLICY IF EXISTS "Allow admins to delete messages" ON "public"."messages";
CREATE POLICY "Allow admins to delete messages" 
ON "public"."messages" 
FOR DELETE 
TO authenticated 
USING (
  auth.jwt() ->> 'email' IN ('nikhilkumarsingh004@gmail.com', 'admin@quickshow.com')
);

-- 6. Allow public to read specific non-sensitive messages (e.g., FAQs or public testimonials)
-- Assumes you optionally add a boolean column `is_public` defaulting to false.
DROP POLICY IF EXISTS "Allow public read of public messages" ON "public"."messages";
CREATE POLICY "Allow public read of public messages" 
ON "public"."messages" 
FOR SELECT 
TO public 
USING (is_public IS TRUE);
