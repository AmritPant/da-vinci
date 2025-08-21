# ⚡ DaVinci - Multi-Model AI Chat Platform

A powerful React-based chat application that allows you to interact with multiple AI models simultaneously. Built with modern web technologies and designed for seamless multi-model conversations.

## 🚀 Features

- **Multi-Model Chat**: Chat with ChatGPT 5, Claude Sonnet 4, Claude Opus 4.1, Deepseek R1, Gemini 2.5 Pro, and Grok 4 simultaneously
- **Image Upload & Analysis**: Upload images and get insights from vision-capable models
- **LaTeX Rendering**: Beautiful mathematical formula rendering with KaTeX
- **Chat History**: Persistent conversation history with Supabase integration
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Live responses from multiple AI models
- **Modern UI**: Claude-inspired design with orange accent colors and dark theme

## 🛠️ Tech Stack

- **Frontend**: React 19, CSS3, JavaScript ES6+
- **AI Integration**: OpenRouter API for multi-model access
- **Database**: Supabase for chat history and user management
- **Math Rendering**: KaTeX for LaTeX formula display
- **Icons**: React Icons (Feather Icons)
- **Deployment**: Vercel with GitHub integration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/da-vinci.git
   cd da-vinci
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_OPENROUTER_API_KEY=your_openrouter_api_key
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   Run the SQL commands from `supabase-schema.sql` in your Supabase SQL editor.

5. **Start the development server**
   ```bash
   npm start
   ```

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on every push

### Environment Variables for Production

Set these in your Vercel dashboard:
- `REACT_APP_OPENROUTER_API_KEY`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

## 🎯 Usage

1. **Enable Models**: Toggle the models you want to chat with
2. **Start Chatting**: Type your message or upload an image
3. **View Responses**: See responses from all enabled models simultaneously
4. **Access History**: Click the clock icon to view past conversations
5. **Math Support**: Use LaTeX syntax for mathematical expressions

## 🔧 Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Built with ❤️ by Amrit Pant, in Kathmandu**

---

*DaVinci - Empowering conversations with multiple AI models*

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
