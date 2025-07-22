export const zodiacSigns = [
  { name: 'Aries', symbol: '♈', dateRange: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', dateRange: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', dateRange: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', dateRange: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', dateRange: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', dateRange: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', dateRange: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', dateRange: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', dateRange: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', dateRange: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', dateRange: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', dateRange: 'Feb 19 - Mar 20' },
] as const;

export type ZodiacSignName = (typeof zodiacSigns)[number]['name'];

export const horoscopes: Record<ZodiacSignName, { title: string; prediction: string; emoji: string }> = {
  Aries: {
    title: "Bold Moves",
    prediction: "Today is a day for action, Aries. Your pioneering spirit is at its peak. Seize new opportunities, but be mindful of impulsive decisions. A fiery energy surrounds your career sector.",
    emoji: "🔥"
  },
  Taurus: {
    title: "Grounding Energy",
    prediction: "Focus on stability and comfort. It's a great day for financial planning or simply enjoying the fruits of your labor. Patience will be your greatest asset in relationships.",
    emoji: "🌿"
  },
  Gemini: {
    title: "Communication is Key",
    prediction: "Your words have extra weight today. Express your ideas, connect with others, and satisfy your curiosity. A conversation could lead to an unexpected breakthrough.",
    emoji: "💬"
  },
  Cancer: {
    title: "Nurture Your Roots",
    prediction: "Home and family are in focus. Spend time with loved ones or create a more comforting personal space. Your intuition is strong; trust your gut feelings.",
    emoji: "🏡"
  },
  Leo: {
    title: "Spotlight on You",
    prediction: "Your natural charisma shines brightly. It's a perfect day for creative projects and self-expression. Don't be afraid to take center stage and share your talents.",
    emoji: "🌟"
  },
  Virgo: {
    title: "Details Matter",
    prediction: "Your analytical skills are sharp. Tackle complex tasks, organize your life, and focus on wellness. Small, practical steps will lead to big achievements.",
    emoji: "📊"
  },
  Libra: {
    title: "Seek Harmony",
    prediction: "Balance is your theme for the day. Focus on partnerships, both personal and professional. Diplomacy will help you resolve any conflicts that arise. Seek beauty in your surroundings.",
    emoji: "⚖️"
  },
  Scorpio: {
    title: "Deep Transformations",
    prediction: "A powerful day for introspection and getting to the heart of a matter. Your intensity can uncover hidden truths. Focus on personal growth and release what no longer serves you.",
    emoji: "🦋"
  },
  Sagittarius: {
    title: "Expand Your Horizons",
    prediction: "Adventure calls! Whether through travel, learning, or philosophy, it's a day to broaden your perspective. Your optimism is contagious and will open new doors.",
    emoji: "🌍"
  },
  Capricorn: {
    title: "Climb to Success",
    prediction: "Your ambition is fueled today. Focus on your long-term goals and responsibilities. Discipline and hard work will pay off, bringing you closer to your aspirations.",
    emoji: "🏆"
  },
  Aquarius: {
    title: "Innovate and Connect",
    prediction: "Your unique ideas can make a difference. Collaborate with your community or work on a humanitarian project. Your forward-thinking approach is needed.",
    emoji: "💡"
  },
  Pisces: {
    title: "Dream and Create",
    prediction: "Your imagination and compassion are heightened. It's an ideal day for artistic pursuits, spiritual practices, or acts of kindness. Listen to your dreams.",
    emoji: "🎨"
  },
};

export const blogPosts = [
    {
        slug: 'understanding-your-life-path-number',
        title: 'Understanding Your Life Path Number',
        excerpt: 'Numerology offers a unique window into our personalities and life journeys. One of the most significant numbers in your chart is the Life Path number...',
        content: `
<p>Numerology offers a unique window into our personalities and life journeys. One of the most significant numbers in your chart is the <strong>Life Path number</strong>. It reveals your most fulfilling direction and the major lessons you are here to learn. It's calculated from your date of birth, representing the native traits that will stay with you for life.</p>
<h3 class="font-headline text-xl mt-4 mb-2">How to Calculate It</h3>
<p>To calculate your Life Path number, you simply reduce your birth date (day, month, and year) down to a single digit. For example, if someone was born on December 22, 1995 (12-22-1995), you would do the following:</p>
<ul class="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Month:</strong> 1 + 2 = 3</li>
    <li><strong>Day:</strong> 2 + 2 = 4</li>
    <li><strong>Year:</strong> 1 + 9 + 9 + 5 = 24. Then, 2 + 4 = 6.</li>
    <li><strong>Total:</strong> 3 + 4 + 6 = 13. Finally, 1 + 3 = 4.</li>
</ul>
<p class="mt-2">This person's Life Path number is 4. Each number from 1 to 9 has its own unique meaning, as do the "Master Numbers" 11, 22, and 33.</p>
`,
        author: 'Cosmic Insights Team',
        date: '2024-05-15',
        tags: ['Numerology', 'Beginner', 'Life Path'],
        imageUrl: 'https://placehold.co/800x400',
        dataAiHint: 'galaxy stars',
    },
    {
        slug: 'the-four-major-lines-in-palmistry',
        title: 'The Four Major Lines in Palmistry',
        excerpt: 'Palmistry, or chiromancy, is the art of characterization and foretelling the future through the study of the palm. The four major lines are the foundation of any reading...',
        content: `
<p>Palmistry, or chiromancy, is the art of characterization and foretelling the future through the study of the palm. While a full reading is complex, understanding the four major lines is a great starting point.</p>
<h3 class="font-headline text-xl mt-4 mb-2">The Heart Line</h3>
<p>Located at the top of the palm, the Heart Line represents all matters of the heart: love, emotions, and relationships. A deep, clear line suggests emotional stability, while a faint line can indicate a more guarded nature.</p>
<h3 class="font-headline text-xl mt-4 mb-2">The Head Line</h3>
<p>Running below the Heart Line, the Head Line governs your intellect, communication style, and thirst for knowledge. A long line often signifies a methodical thinker, while a short line might point to a more instinctive approach.</p>
<h3 class="font-headline text-xl mt-4 mb-2">The Life Line</h3>
<p>Starting near the thumb and arcing towards the wrist, the Life Line reflects your vitality, physical health, and major life changes. Contrary to popular belief, its length doesn't determine lifespan, but rather the quality and vibrancy of your life.</p>
<h3 class="font-headline text-xl mt-4 mb-2">The Fate Line (or Line of Destiny)</h3>
<p>Not everyone has a Fate Line, but for those who do, it indicates the degree to which your life is affected by external circumstances beyond your control. A strong Fate Line suggests a clear path and purpose.</p>
`,
        author: 'Cosmic Insights Team',
        date: '2024-05-10',
        tags: ['Palmistry', 'Beginner', 'Lines'],
        imageUrl: 'https://placehold.co/800x400',
        dataAiHint: 'palm hand',
    },
    {
        slug: 'aries-season-harnessing-the-pioneering-spirit',
        title: 'Aries Season: Harnessing the Pioneering Spirit',
        excerpt: 'When the sun moves into Aries, it marks the astrological new year and a burst of fresh energy. This is a time for new beginnings, bold action, and embracing your inner leader...',
        content: `
<p>When the sun moves into Aries, typically from March 21st to April 19th, it marks the astrological new year. This shift brings a palpable burst of fresh, fiery energy, encouraging us all to embrace new beginnings and take bold action.</p>
<h3 class="font-headline text-xl mt-4 mb-2">What is Aries Energy?</h3>
<p>Aries is the first sign of the zodiac, a cardinal fire sign ruled by Mars. Its energy is characterized by:</p>
<ul class="list-disc pl-5 mt-2 space-y-1">
    <li><strong>Initiative:</strong> Aries is a natural-born leader, unafraid to be the first to try something new.</li>
    <li><strong>Courage:</strong> This energy is brave, direct, and faces challenges head-on.</li>
    <li><strong>Independence:</strong> A strong sense of self and a desire for autonomy are key traits.</li>
    <li><strong>Impulsiveness:</strong> The downside can be a tendency to act before thinking things through.</li>
</ul>
<h3 class="font-headline text-xl mt-4 mb-2">How to Make the Most of Aries Season</h3>
<p>During this time, you might feel more motivated to start new projects, tackle your to-do list, and advocate for yourself. It's the perfect time to set intentions for the year ahead. Be mindful of potential conflicts, as the direct nature of Aries can sometimes come across as aggressive. Channel this powerful energy into productive outlets like exercise, starting a new business, or finally having that courageous conversation.</p>
`,
        author: 'Cosmic Insights Team',
        date: '2024-03-21',
        tags: ['Zodiac', 'Aries', 'Seasons'],
        imageUrl: 'https://placehold.co/800x400',
        dataAiHint: 'ram constellation',
    },
];


export type TarotCard = {
  name: string;
  imageUrl: string;
  dataAiHint: string;
};

export const tarotCards: TarotCard[] = [
  { name: "The Fool", imageUrl: "https://placehold.co/200x350", dataAiHint: "jester cliff" },
  { name: "The Magician", imageUrl: "https://placehold.co/200x350", dataAiHint: "wizard alchemy" },
  { name: "The High Priestess", imageUrl: "https://placehold.co/200x350", dataAiHint: "mystic moon" },
  { name: "The Empress", imageUrl: "https://placehold.co/200x350", dataAiHint: "queen nature" },
  { name: "The Emperor", imageUrl: "https://placehold.co/200x350", dataAiHint: "king throne" },
  { name: "The Hierophant", imageUrl: "https://placehold.co/200x350", dataAiHint: "priest tradition" },
  { name: "The Lovers", imageUrl: "https://placehold.co/200x350", dataAiHint: "couple harmony" },
  { name: "The Chariot", imageUrl: "https://placehold.co/200x350", dataAiHint: "warrior victory" },
  { name: "Strength", imageUrl: "https://placehold.co/200x350", dataAiHint: "woman lion" },
  { name: "The Hermit", imageUrl: "https://placehold.co/200x350", dataAiHint: "hermit lantern" },
  { name: "Wheel of Fortune", imageUrl: "https://placehold.co/200x350", dataAiHint: "spinning wheel" },
  { name: "Justice", imageUrl: "https://placehold.co/200x350", dataAiHint: "scales sword" },
  { name: "The Hanged Man", imageUrl: "https://placehold.co/200x350", dataAiHint: "man hanging" },
  { name: "Death", imageUrl: "https://placehold.co/200x350", dataAiHint: "skeleton horse" },
  { name: "Temperance", imageUrl: "https://placehold.co/200x350", dataAiHint: "angel water" },
  { name: "The Devil", imageUrl: "https://placehold.co/200x350", dataAiHint: "demon chains" },
  { name: "The Tower", imageUrl: "https://placehold.co/200x350", dataAiHint: "tower lightning" },
  { name: "The Star", imageUrl: "https://placehold.co/200x350", dataAiHint: "woman star" },
  { name: "The Moon", imageUrl: "https://placehold.co/200x350", dataAiHint: "moon illusion" },
  { name: "The Sun", imageUrl: "https://placehold.co/200x350", dataAiHint: "sun child" },
  { name: "Judgement", imageUrl: "https://placehold.co/200x350", dataAiHint: "angel trumpet" },
  { name: "The World", imageUrl: "https://placehold.co/200x350", dataAiHint: "dancer wreath" },
];
