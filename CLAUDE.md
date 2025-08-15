# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start development server on http://localhost:3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Architecture Overview

This is a Next.js 14 marketing website using the App Router pattern. The site is built for Amarillo Automation, a marketing consultancy specializing in automation and AI services for local businesses.

### Key Architectural Decisions

1. **Next.js App Router**: All pages and components use the new App Router structure in `/app`
2. **Server Components by Default**: Components are server-side rendered unless marked with `'use client'`
3. **API Routes**: Backend functionality is handled through Next.js API routes in `/app/api`
4. **External Integrations**:
   - Airtable for CRM (with graceful error handling)
   - n8n webhooks for email automation (API key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)
   - OpenAI and Anthropic SDKs for AI functionality
   - Google Tag Manager and Facebook SDK for analytics
   - Zapier webhooks for additional automation

### Project Structure

- `/app` - All application code
  - `/api` - Backend API routes (contact forms, demo requests, chat functionality)
  - `/components` - Reusable React components (chatbots, UI elements, tracking)
  - Page routes - Contact, demo, solutions, legal pages
- `/lib` - Shared utilities (Airtable integration, email handling)
- `/public` - Static assets

### Important Implementation Notes

1. **Environment Variables**: The app relies on several environment variables:
   - `OPENAI_API_KEY` - For AI chat functionality
   - `ANTHROPIC_API_KEY` - For Claude integration
   - `N8N_API_KEY` - For n8n API authentication
   - `N8N_WEBHOOK_URL`, `N8N_WEBHOOK_TEST`, `N8N_WEBHOOK_PROD` - For email automation
   - `AIRTABLE_PERSONAL_ACCESS_TOKEN`, `AIRTABLE_BASE_ID` - For CRM
   - `ZAPIER_WEBHOOK_URL`, `ZAPIER_DEMO_WEBHOOK` - For Zapier integrations

2. **Styling**: Uses Tailwind CSS with custom animations defined in `tailwind.config.js`

3. **TypeScript**: Strict mode is enabled. All new code should be properly typed.

4. **Image Optimization**: Disabled in `next.config.js` for Cloudflare Pages compatibility

5. **SEO and AI Optimization**: The site is heavily optimized for both traditional SEO and AI search platforms with extensive structured data in `app/layout.tsx`

6. **No Testing Framework**: Currently no test setup. Consider adding tests when implementing new features.

### Common Development Tasks

When working on API routes:
- Check `/lib/airtable.ts` for CRM integration patterns
- Use `/lib/email.ts` for email sending via n8n webhooks
- API routes should handle errors gracefully and return appropriate status codes

When working on components:
- Follow existing patterns in `/app/components`
- Use `'use client'` directive only when necessary (for interactivity, hooks, browser APIs)
- Maintain consistent styling with Tailwind classes

When modifying the chatbot functionality:
- Main chatbot components are in `/app/components/EnhancedAIChatbot.tsx` and `SimpleChatbot.tsx`
- Chat API routes are in `/app/api/chat`, `/app/api/openai-chat`, and `/app/api/llm-chat`

### Business Intelligence Hub Update Instructions

The Business Intelligence Hub is a critical component that discovers businesses, enriches their data, and saves them to Airtable. When updating business categories, you must modify THREE locations:

#### 1. Frontend Component (`/app/business-discovery/page.tsx`)
Update the industry categories displayed to users:
- **Lines 92-101**: `availableIndustries` array - Main categories shown as green buttons
- **Lines 104-117**: `industrySearchTerms` array - Additional categories shown as gray buttons

#### 2. API Route Mapping (`/app/api/business-discovery/route.ts`)
Update the `mapToValidIndustry` function (lines 276-377):
- This function maps user search terms to valid Airtable industry options
- Add new mappings for any new categories
- Ensure mapped values EXACTLY match your Airtable field options
- Default fallback is "General Services" if no match found

Current mapped categories:
- HVAC, Plumbing, Roofing, Electrical, Landscaping, Cleaning Services
- Pest Control, Painting, Flooring, Handyman Services, Locksmith
- Tree Services, Solar, Pool Services, Concrete & Paving, Fencing
- Gutter Services, Home Improvement, Remodeling, Moving Services
- Storage, Church, Restaurant, Insurance Agency, Law Firm
- Accounting, Dentist, Auto Repair, Real Estate, Home Builder, Remodeler
- Insulation Contractor

#### 3. Airtable Configuration
Ensure your Airtable base has:
- Table name: "Business Intelligence"
- Field name: "Industry" (Single Select field)
- All category options from the mapping function must exist as valid choices
- Case-sensitive matching is important

#### Important Notes:
- The API saves to the "Business Intelligence" table in Airtable
- Industry field in Airtable must be a Single Select with matching options
- Any mismatch between mapped values and Airtable options will cause save failures
- Check API logs for specific Airtable errors when debugging