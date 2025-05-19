# Wedding Registry Application

A comprehensive web platform designed to manage all aspects of a wedding celebration. This application serves couples planning their wedding and their guests by providing a centralized system for guest registration, event scheduling, accommodation management, and various interactive features.

![Wedding Registry](https://example.com/wedding-registry-screenshot.png)

## Features

### Guest Management
- **Guest Registration**: Collect guest information including name, email, phone, association, and connection
- **Photo Upload**: Option for guests to upload photos with normal or Ghibli-style processing
- **Voice Notes**: Record voice messages for the couple
- **Guest List Viewing**: Browse registered guests filtered by family connections

### Event Information
- **Schedule Viewer**: Detailed timeline of all wedding events across multiple days
- **Event Details**: Time, location, dress code, and descriptions for each event
- **Accommodation Information**: Hotel details with contact information

### Multilingual Support
- Complete translations in English, Tamil, and Hindi
- Language detection and switching capabilities

### AI-Powered Features
- **Ask Me Anything**: AI-powered Q&A about the wedding
- **Food Analysis**: Image recognition system for analyzing food dishes

### Content Pages
- **Meet the Couple**: Information about the bride and groom
- **Family Information**: Details about both families
- **Memories Gallery**: Interactive photo gallery
- **Food Gallery**: Showcase of wedding menu items

## Technology Stack

- **Frontend**: Next.js 15.3.1 with React 19
- **Styling**: Tailwind CSS 4 with custom theming
- **UI Components**: Radix UI primitives
- **AI Integration**: 
  - Google Generative AI
  - OpenAI
  - Perplexity AI
- **Database**: PostgreSQL with pgvector for vector search
- **Internationalization**: i18next with browser language detection
- **Animation**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KLM-Solutions/wedding-registry-003.git
   cd wedding-registry-003
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_postgres_database_url
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_API_KEY=your_google_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

### Running the Application

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
/app                      # Next.js app directory
  /api                    # API endpoints
    /admin                # Room assignment management API
    /ask-me-anything      # AI chat API
    /calculator           # Food analysis API
    /wedding-registry     # Guest registration API
  /admin-panel            # Admin interface
  /calculator             # Food analysis page
  /events                 # Event schedule page
  /wedding-registry       # Main wedding registry page
    /ask-me-anything      # AI chat interface
    /family               # Family information page
    /food                 # Food gallery page
    /memories             # Memories gallery page
  /meet-the-couple        # Page about the couple
  /accommodation          # Accommodation information page
  /globals.css            # Global styles
  /i18n.ts                # Internationalization config
  /layout.tsx             # Root layout component
  /page.tsx               # Root page

/components               # Reusable React components
  /ui                     # UI component library
  /LanguageSwitcher.tsx   # Language selection component

/lib                      # Utility functions
  /utils.ts               # General utilities
```

## Usage Examples

### Guest Registration

Guests can register by filling out the form on the main page:

1. Navigate to the "Register" tab
2. Fill in personal details (name, email, phone, etc.)
3. Select association (bride or groom) and connection
4. Optionally upload a photo or record a voice message
5. Submit the form to be added to the guest list

### Viewing Event Schedule

To view the wedding event schedule:

1. Navigate to the "Schedule" tab
2. Browse through the three-day event timeline
3. Click on any event to see detailed information including time, location, and dress code

### Accommodation Verification

Guests can verify their room assignments:

1. Find your name in the guest list
2. Click on your entry to view details
3. Enter your date of birth for verification
4. View your assigned hotel and room number

### Using the AI Features

#### Ask Me Anything:

1. Navigate to the "Ask Me Anything" page
2. Type your question about the wedding in the input field
3. Receive AI-generated answers based on wedding information

#### Food Analysis:

1. Navigate to the "Food" page
2. Upload a photo of a food dish
3. Receive AI-generated analysis of the dish

## Deployment

The application can be deployed on Vercel:

```bash
npm run build
# or
yarn build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
