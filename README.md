# Quick Draw 🎨

A fun, social drawing and guessing game perfect for playing with friends while waiting in line or hanging out at school!

## 🎮 Game Overview

Quick Draw is a local multiplayer game where players take turns drawing prompts while others guess what's being drawn. It's designed to be:
- **Quick to play** - Perfect for short waiting periods
- **Social** - Pass-and-play format encourages interaction
- **Fun** - Engaging gameplay with scoring and competition
- **Easy to learn** - Simple rules, instant fun

## ✨ Features

- 🎨 **Drawing Canvas** - Smooth touch-based drawing with multiple colors and stroke sizes
- 🎯 **Word Prompts** - Hundreds of words across 8 categories (Animals, Food, Objects, Nature, People & Actions, Places, Fantasy, Sports)
- ⏱️ **Timed Rounds** - 60-second drawing rounds with countdown timer
- 🏆 **Scoring System** - Points for correct guesses with time bonuses
- 👥 **Multiplayer** - Support for 2+ players with pass-and-play
- 📊 **Results Screen** - See scores and rankings after each round
- 🎨 **Beautiful UI** - Modern, colorful interface with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- Expo CLI
- iOS Simulator or physical iOS device

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on iOS:
```bash
npm run ios
```

## 📱 How to Play

1. **Start a Game**: Enter your name and tap "Start Game"
2. **Add Players**: Add friends' names in the lobby (minimum 2 players)
3. **Draw**: When it's your turn, you'll get a word to draw. Use your finger to draw on the canvas!
4. **Guess**: Other players take turns guessing what's being drawn
5. **Score Points**: Correct guesses earn points. The faster you guess, the more points you get!
6. **Win**: After all rounds, the player with the most points wins!

## 🎯 Game Rules

- Each player gets a turn to draw
- Drawers have 60 seconds to complete their drawing
- Other players take turns guessing
- First correct guess ends the round
- Points are awarded:
  - Guesser: 10 points + time bonus (faster = more points)
  - Drawer: 5 points when someone guesses correctly
- Game consists of multiple rounds (default: 3 rounds)

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **TypeScript** - Type-safe development
- **React Navigation** - Screen navigation
- **React Native SVG** - Drawing canvas implementation
- **Expo Haptics** - Tactile feedback

## 📦 Project Structure

```
QuickDrawGame/
├── components/       # Reusable components
│   └── DrawingCanvas.tsx
├── context/          # React context for game state
│   └── GameContext.tsx
├── data/             # Game data (prompts, etc.)
│   └── prompts.ts
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── LobbyScreen.tsx
│   ├── DrawingScreen.tsx
│   ├── GuessingScreen.tsx
│   └── ResultsScreen.tsx
├── types/            # TypeScript type definitions
│   └── game.ts
└── App.tsx           # Main app component
```

## 🎨 Customization

### Adding More Prompts

Edit `data/prompts.ts` to add new categories and words:

```typescript
{
  category: 'Your Category',
  words: ['Word1', 'Word2', 'Word3']
}
```

### Adjusting Game Settings

Modify game settings in `context/GameContext.tsx`:

```typescript
settings: {
  roundDuration: 60,    // Drawing time in seconds
  roundsPerGame: 3,     // Number of rounds per game
}
```

## 🚢 Building for Production

### iOS

1. Configure your app in `app.config.js`
2. Build with EAS:
```bash
eas build --platform ios
```

3. Submit to App Store:
```bash
eas submit --platform ios
```

## 🎯 Apple Arcade Considerations

To prepare for Apple Arcade submission:

1. **No IAP/Ads**: This project ships with no ads or in-app purchases.
2. **Premium Quality**: Focus on polish, animations, and user experience
3. **Unique Features**: Consider adding:
   - Online multiplayer support
   - Custom word lists
   - Drawing replay feature
   - Achievement system
   - More game modes

4. **Performance**: Optimize for smooth 60fps gameplay
5. **Accessibility**: Add VoiceOver support and accessibility labels
6. **Localization**: Support multiple languages

## 📝 License

This project is created for educational and commercial purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Made with ❤️ for fun times with friends!**

