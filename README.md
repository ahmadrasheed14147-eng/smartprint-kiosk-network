# SmartPrint Kiosk Network

# Build SmartPrint — A Self-Service Printing Platform

Act as a senior product designer, SaaS architect and full-stack developer.

Build a polished, production-quality MVP website for **SmartPrint**, a self-service document printing platform initially targeting universities, colleges, libraries and public spaces in Pakistan.

This is not a traditional printing shop website. It is a software platform that allows customers to upload documents, configure printing preferences, pay digitally and collect printed documents from automated printing kiosks.

The goal of this MVP is to demonstrate the complete software experience to potential investors, startup incubators, universities and hardware partners.

## 1. Brand Identity & Design System

Brand name: SmartPrint

Tagline: Print smarter. Anywhere.

Brand personality:
- Professional
- Trustworthy
- Modern
- Minimal
- Technology-driven
- Accessible

Visual direction:
Create a premium startup identity inspired by modern fintech and enterprise SaaS products.

Use this color palette:
- Primary forest green: #24764E
- Deep charcoal: #172A23
- Off-white background: #F5F6F0
- Light green surface: #E8F0E8
- Lime accent: #C6E879
- White: #FFFFFF
- Neutral text: #626B65

Typography:
Use Inter or Manrope.

IMPORTANT DESIGN REQUIREMENTS:
- Absolutely NO purple gradients.
- Avoid generic AI-generated website aesthetics.
- Avoid excessive gradients, glassmorphism and unnecessary animations.
- Use generous whitespace and consistent spacing.
- Use clean cards, subtle borders and soft shadows.
- Use professional icons from Lucide.
- Create strong visual hierarchy.
- Make the interface feel like an established technology company.
- Ensure excellent mobile responsiveness.
- Use polished hover states and subtle transitions.
- Do not overcrowd the interface.

Create a simple professional SmartPrint wordmark with a minimal printer/document icon.

## 2. Main Website — Landing Page

Create a professional marketing homepage.

### Navigation
- SmartPrint logo
- How It Works
- Features
- Locations
- About
- Sign In
- Start Printing (primary CTA)

### Hero Section

Headline:

"Your Documents. Your Way. Instantly."

Supporting text:

"Upload your documents, choose your printing preferences and collect your prints from a nearby self-service kiosk. No queues. No complicated process."

Primary button: Start Printing

Secondary button: See How It Works

On the right side, create an attractive product mockup showing a smartphone with a document upload screen alongside a modern self-service printing kiosk.

### How It Works

Show four visually attractive steps:

1. Scan the QR Code — Connect to a nearby SmartPrint kiosk.
2. Upload Your Documents — Upload PDFs, images and supported documents.
3. Configure & Pay — Select copies, paper size, colour and printing preferences.
4. Collect Your Prints — Verify your session and collect your documents.

### Features Section

Include:
- QR-based printing sessions
- Secure document uploads
- Multiple printing options
- Digital payment support
- OTP-based collection verification
- Automated print-job processing
- Multiple kiosk locations
- Centralized machine monitoring

### Where SmartPrint Can Be Used

Create attractive cards for:
- Universities and colleges
- Libraries
- Hospitals
- Government offices
- Courts
- Shopping malls
- Corporate offices

### Closing CTA

"Printing should be simple. We're making it smarter."

Button: Try SmartPrint Demo

### Footer

Include logo, short description, navigation links, contact section, privacy policy and terms of service.

## 3. Customer Printing Application

This is the most important part of the MVP.

Create a functional multi-step customer experience.

Route: /print

### Step 1 — Connect to a Kiosk

Create a clean screen showing:
- SmartPrint logo
- Welcome message
- Kiosk ID
- Location name
- Connection status
- Start Printing button

For demonstration, provide a sample kiosk:

Kiosk ID: SP-ISB-001
Location: Islamabad University
Status: Online

Allow users to start a demo session.

### Step 2 — Upload Documents

Build an attractive drag-and-drop file upload interface.

Support:
- PDF
- JPG
- JPEG
- PNG

Include:
- Browse files button
- Drag-and-drop support
- Upload progress
- File name
- File size
- Remove file option
- File validation

Display uploaded files in clean file cards.

Allow multiple files.

For this MVP, focus on PDF and image printing. Do not pretend unsupported document formats are fully processed.

### Step 3 — Printing Preferences

Create a professional configuration interface.

Options:
- Paper size: A4, A3
- Colour: Black & White / Colour
- Sides: Single-sided / Double-sided
- Copies: 1–20
- Page range: All pages / Custom pages

Display:
- Selected document
- Total pages
- Number of copies
- Estimated printing cost

Use illustrative demo prices in PKR and clearly label them as sample prices.

Make the price update dynamically whenever the user changes their printing preferences.

### Step 4 — Order Summary & Payment

Show:
- Document details
- Printing preferences
- Estimated total
- Kiosk information

Payment methods displayed:
- JazzCash
- Easypaisa
- Bank card

For now, implement a clearly labelled DEMO PAYMENT flow.

Add a button: Confirm Demo Payment.

Do not integrate real payment gateways yet.

After clicking, simulate successful payment and generate a demo transaction ID.

### Step 5 — OTP Verification

Generate a six-digit demo OTP.

Show:
- Order ID
- Transaction status
- OTP
- Kiosk information
- Instructions for collecting documents

Implement OTP verification with an input field.

For demonstration, display the generated OTP on screen rather than pretending an SMS has been sent.

### Step 6 — Print Job Status

Show a live-looking job progress interface with these states:

- Order Received
- Payment Confirmed
- Queued for Printing
- Printing
- Completed

Use a simulated status progression.

Display the final success screen:

"Your prints are ready!"

Include order ID, kiosk location and collection instructions.

Add a Start New Session button.

## 4. Admin Dashboard

Route: /admin

Build a premium SaaS-style admin dashboard.

Sidebar navigation:
- Overview
- Print Jobs
- Kiosks
- Transactions
- Customers
- Analytics
- Settings

### Overview

Show KPI cards:
- Total Print Jobs
- Total Revenue
- Active Kiosks
- Pending Jobs
- Completed Jobs

Use realistic sample data, clearly identified as demo data.

Add charts:
- Daily print jobs
- Revenue over time
- Printing volume by location

### Print Jobs

Create a searchable and filterable table with:
- Order ID
- Customer
- Kiosk
- Document
- Pages
- Amount
- Status
- Date

Use status badges with appropriate colours.

Clicking a job should open its detailed view.

### Kiosk Management

Display kiosk cards with:
- Kiosk ID
- Location
- Online / Offline status
- Current print job
- Paper status
- Toner status
- Last active time

Create an Add Kiosk button that opens a functional form.

Include sample kiosks:
- SP-ISB-001 — Islamabad University
- SP-ISB-002 — Islamabad Library
- SP-RWP-001 — Rawalpindi Campus

Machine status should be simulated in this MVP.

### Transactions

Show demo payment records with:
- Transaction ID
- Order ID
- Payment method
- Amount in PKR
- Payment status
- Date

### Analytics

Include:
- Printing volume
- Revenue
- Popular printing options
- Most active kiosks
- Peak usage times

## 5. Important Technical Requirements

Build a real interactive website, not just static screenshots.

Use:
- React
- TypeScript
- Tailwind CSS
- Lucide icons
- Reusable components
- Clean folder structure

If Supabase is connected, prepare the application for Supabase integration using proper database tables and storage. If it is not connected, use local demo data and browser state for the initial working prototype.

Suggested database entities for future integration:
- users
- kiosks
- print_jobs
- documents
- transactions
- otp_sessions
- machine_logs

Keep the architecture modular and ready for a real backend.

Important:
- Do not store sensitive documents unnecessarily.
- Do not expose secrets or payment credentials.
- Do not claim that real payments, SMS, printers or physical kiosks are integrated.
- Keep all demo functionality clearly labelled.
- Ensure uploaded documents can be removed from the session.
- Make the customer flow work end to end.
- Make dashboard tables, navigation, filters and forms interactive.
- Add proper empty states, loading states and error messages.
- Ensure the website works on mobile, tablet and desktop.

## 6. Final Product Quality

The final result should look like a serious Pakistani technology startup preparing for an investor presentation.

Prioritize these three experiences:

1. A beautiful and trustworthy landing page that explains the business.
2. A complete customer printing journey that can be demonstrated live.
3. An impressive admin dashboard showing how the entire printing network will be managed.

Do not build unnecessary features or an overly complicated application.

Build the landing page, customer application and admin dashboard as one cohesive SmartPrint product.

The customer printing flow is the highest priority. Make sure it works before adding decorative elements.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3cef9ff2-c413-4646-86f8-9bc29ab08588).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
