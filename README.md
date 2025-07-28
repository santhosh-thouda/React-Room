# React Room - AI-Powered Component Generator

A stateful, AI-driven micro-frontend playground where authenticated users can iteratively generate, preview, tweak, and export React components with all chat history and code edits preserved across logins.

## 🚀 Features

### Core Features (Mandatory)
- ✅ **Authentication & Persistence**: Signup/Login with email+password or OAuth
- ✅ **Session Management**: Load previous sessions with full chat transcript and generated code
- ✅ **Conversational UI**: Side-panel chat with text + image inputs
- ✅ **Live Preview**: Render generated components in real-time
- ✅ **Code Inspection**: Syntax-highlighted JSX/TSX and CSS tabs
- ✅ **Export Functionality**: Copy and download generated code

### Bonus Features (Optional)
- 🎨 **Interactive Property Editor**: Click elements to modify properties
- 🔄 **Iterative Refinement**: Further prompts patch existing components
- 💾 **Auto-save**: Automatic saving after every chat turn
- 📱 **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React + Next.js (SSR and routing)
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (Email/Password + Google OAuth)
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI/Anthropic/OpenRouter (configurable)
- **Caching**: Redis (optional)
- **Deployment**: Vercel/Render ready

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB database
- AI API key (OpenAI, Anthropic, or OpenRouter)
- Google OAuth credentials (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd react-room
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/react-room

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# AI Service (Choose one)
OPENAI_API_KEY=your-openai-api-key
# OR
ANTHROPIC_API_KEY=your-anthropic-api-key
# OR
OPENROUTER_API_KEY=your-openrouter-api-key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
react-room/
├── components/
│   ├── layout/
│   │   ├── Layout.js          # Main layout wrapper
│   │   ├── Navbar.js          # Navigation bar
│   │   └── Sidebar.js         # Session sidebar
│   ├── chat/
│   │   └── ChatPanel.js       # AI chat interface
│   └── preview/
│       └── ComponentPreview.js # Component preview area
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth].js # NextAuth configuration
│   │   │   └── signup.js        # User registration
│   │   ├── sessions/
│   │   │   ├── index.js         # Session CRUD
│   │   │   └── [id].js          # Individual session
│   │   └── chat/
│   │       └── index.js         # AI chat endpoint
│   ├── auth/
│   │   ├── signin.js           # Sign in page
│   │   └── signup.js           # Sign up page
│   ├── session/
│   │   └── [id].js             # Main session workspace
│   ├── _app.js                 # App wrapper
│   └── index.js                # Landing page
├── models/
│   ├── User.js                 # User model
│   └── Session.js              # Session model
├── lib/
│   └── mongodb.js              # Database connection
└── styles/
    └── globals.css             # Global styles
```

## 🔧 Configuration

### AI Integration

The application supports multiple AI providers. Configure your preferred one in `.env.local`:

#### OpenAI
```env
OPENAI_API_KEY=your-openai-api-key
```

#### Anthropic
```env
ANTHROPIC_API_KEY=your-anthropic-api-key
```

#### OpenRouter (Multiple Models)
```env
OPENROUTER_API_KEY=your-openrouter-api-key
```

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Configure in `.env.local`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Render

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy!

## 📝 Usage

1. **Sign Up/In**: Create an account or sign in with Google
2. **Create Session**: Click "New" to start a new component session
3. **Chat with AI**: Describe the component you want to create
4. **Preview**: See your component rendered in real-time
5. **Refine**: Continue chatting to modify the component
6. **Export**: Copy or download the generated code

## 🔮 Future Enhancements

- [ ] Real-time collaboration
- [ ] Component library/templates
- [ ] Advanced CSS frameworks support
- [ ] Component testing integration
- [ ] Version control for components
- [ ] Team workspaces
- [ ] Advanced AI models integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error logs

---

Built with ❤️ using Next.js, React, and AI
