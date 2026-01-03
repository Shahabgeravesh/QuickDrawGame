export const DRAWING_PROMPTS: { category: string; words: string[] }[] = [
  {
    category: 'Animals',
    words: [
      'Cat', 'Dog', 'Elephant', 'Lion', 'Tiger', 'Bear', 'Monkey', 'Penguin',
      'Dolphin', 'Shark', 'Butterfly', 'Bee', 'Rabbit', 'Horse', 'Cow', 'Pig',
      'Chicken', 'Duck', 'Owl', 'Eagle', 'Snake', 'Turtle', 'Fish', 'Whale'
    ]
  },
  {
    category: 'Food',
    words: [
      'Pizza', 'Burger', 'Ice Cream', 'Cake', 'Apple', 'Banana', 'Sandwich',
      'Taco', 'Sushi', 'Pasta', 'Cookie', 'Donut', 'Hot Dog', 'French Fries',
      'Chocolate', 'Popcorn', 'Pancake', 'Waffle', 'Coffee', 'Milkshake'
    ]
  },
  {
    category: 'Objects',
    words: [
      'Phone', 'Computer', 'Car', 'Bicycle', 'Book', 'Camera', 'Umbrella',
      'Clock', 'Lamp', 'Chair', 'Table', 'Bed', 'Door', 'Window', 'Key',
      'Sword', 'Shield', 'Crown', 'Ring', 'Guitar', 'Piano', 'Drum'
    ]
  },
  {
    category: 'Nature',
    words: [
      'Tree', 'Flower', 'Sun', 'Moon', 'Star', 'Cloud', 'Rainbow', 'Mountain',
      'Ocean', 'River', 'Forest', 'Desert', 'Island', 'Volcano', 'Snowflake',
      'Leaf', 'Rock', 'Cactus', 'Wave', 'Sunset', 'Aurora'
    ]
  },
  {
    category: 'People & Actions',
    words: [
      'Dancing', 'Singing', 'Running', 'Jumping', 'Swimming', 'Flying',
      'Cooking', 'Reading', 'Sleeping', 'Laughing', 'Crying', 'Waving',
      'Clapping', 'Hugging', 'Kicking', 'Throwing', 'Catching', 'Falling'
    ]
  },
  {
    category: 'Places',
    words: [
      'School', 'Hospital', 'Library', 'Beach', 'Park', 'Zoo', 'Museum',
      'Restaurant', 'Airport', 'Train Station', 'Castle', 'Bridge', 'Tower',
      'Temple', 'Stadium', 'Theater', 'Store', 'House', 'Apartment'
    ]
  },
  {
    category: 'Fantasy',
    words: [
      'Dragon', 'Unicorn', 'Wizard', 'Fairy', 'Knight', 'Princess', 'Castle',
      'Magic Wand', 'Crystal Ball', 'Phoenix', 'Mermaid', 'Robot', 'Alien',
      'Ghost', 'Vampire', 'Werewolf', 'Elf', 'Dwarf', 'Giant'
    ]
  },
  {
    category: 'Sports',
    words: [
      'Basketball', 'Football', 'Soccer', 'Tennis', 'Baseball', 'Golf',
      'Swimming', 'Running', 'Cycling', 'Skiing', 'Surfing', 'Skateboarding',
      'Volleyball', 'Hockey', 'Boxing', 'Wrestling'
    ]
  }
];

export function getRandomPrompt(): { word: string; category: string } {
  const category = DRAWING_PROMPTS[Math.floor(Math.random() * DRAWING_PROMPTS.length)];
  const word = category.words[Math.floor(Math.random() * category.words.length)];
  return { word, category: category.category };
}

