-- Comment out any budget/timeline related constraints and make these fields nullable if needed
-- Ensure the tables can handle submissions without budget_range and timeline

-- Update business_customizations table to make budget_range and timeline nullable
ALTER TABLE business_customizations ALTER COLUMN budget_range DROP NOT NULL;
ALTER TABLE business_customizations ALTER COLUMN timeline DROP NOT NULL;

-- Update contact_requests table to ensure it can handle null values
-- (already nullable based on schema)

-- Update messages table budget field to be nullable if needed
-- (already nullable based on schema)

-- Add comments for future reference
COMMENT ON COLUMN business_customizations.budget_range IS 'Temporarily disabled - remove when budget fields are re-enabled';
COMMENT ON COLUMN business_customizations.timeline IS 'Temporarily disabled - remove when timeline fields are re-enabled';