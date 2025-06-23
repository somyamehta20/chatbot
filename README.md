# Personal Voice Bot

A voice-enabled chatbot that responds to personal questions using ChatGPT's API. The bot is designed to respond authentically as if it were the person being asked, providing genuine insights and personal experiences.

## Features

- 🤖 **AI-Powered Responses**: Uses GPT-4 to generate authentic, personality-driven responses
- 🎤 **Voice Input**: Record audio messages (voice-to-text functionality ready for integration)
- 🔊 **Text-to-Speech**: Converts bot responses to natural-sounding speech
- 💬 **Real-time Chat**: Interactive chat interface with conversation history
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful, intuitive interface with smooth animations

## Example Questions

The bot is designed to respond to personal questions such as:

- "What should we know about your life story in a few sentences?"
- "What's your #1 superpower?"
- "What are the top 3 areas you'd like to grow in?"
- "What misconception do your coworkers have about you?"
- "How do you push your boundaries and limits?"

## Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key (already configured)

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd Chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Text Chat
1. Type your question in the input field
2. Press Enter or click the send button
3. The bot will respond with an authentic, personality-driven answer

### Voice Features
1. **Voice Recording**: Hold the "Hold to Speak" button to record audio
2. **Text-to-Speech**: Click "Play Response" to hear the bot's response spoken aloud

### Example Questions
Click any of the example questions in the sidebar to quickly test the bot's responses.

## Technical Details

### Architecture
- **Backend**: Node.js with Express.js
- **Frontend**: Vanilla JavaScript with modern CSS
- **AI**: OpenAI GPT-4 API
- **Voice**: OpenAI Text-to-Speech API
- **Styling**: Custom CSS with responsive design

### API Endpoints
- `POST /api/chat` - Send messages and get AI responses
- `POST /api/speak` - Convert text to speech
- `GET /api/health` - Health check endpoint

### File Structure
```
Chatbot/
├── server.js          # Main server file
├── config.js          # Configuration and API keys
├── package.json       # Dependencies and scripts
├── README.md          # This file
└── public/            # Frontend files
    ├── index.html     # Main HTML page
    ├── styles.css     # Styling
    └── script.js      # Frontend JavaScript
```

## Customization

### Personality Configuration
Edit the `PERSONALITY_PROMPT` in `config.js` to customize the bot's personality and response style.

### Voice Settings
Modify the voice settings in the `/api/speak` endpoint in `server.js`:
- Change voice model: `tts-1` or `tts-1-hd`
- Change voice: `alloy`, `echo`, `fable`, `onyx`, `nova`, or `shimmer`

## Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production Deployment
1. Set environment variables for production
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx)
4. Configure SSL certificates

### Cloud Deployment Options
- **Heroku**: Easy deployment with Git integration
- **Vercel**: Serverless deployment
- **Railway**: Simple Node.js hosting
- **DigitalOcean**: VPS deployment

## Security Notes

- The API key is currently stored in `config.js` for demo purposes
- For production, use environment variables
- Consider rate limiting and input validation
- Implement proper error handling

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in config.js or kill existing process
   lsof -ti:3000 | xargs kill -9
   ```

2. **API key errors**
   - Verify the API key is correct in `config.js`
   - Check OpenAI account status and billing

3. **Voice recording not working**
   - Ensure microphone permissions are granted
   - Check browser compatibility (Chrome recommended)

4. **Audio playback issues**
   - Check browser audio settings
   - Verify network connectivity for API calls

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for your own purposes.

## Support

For questions or issues, please check the troubleshooting section above or create an issue in the project repository. 