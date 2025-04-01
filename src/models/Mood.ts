
export interface Mood {
  id: string;
  userId: string;
  mood: string;
  reason: string;
  timestamp: string;
}

export const moodTypes = [
  { value: "happy", label: "Happy", emoji: "😊", color: "bg-yellow-100" },
  { value: "sad", label: "Sad", emoji: "😢", color: "bg-blue-100" },
  { value: "angry", label: "Angry", emoji: "😠", color: "bg-red-100" },
  { value: "excited", label: "Excited", emoji: "🎉", color: "bg-purple-100" },
  { value: "tired", label: "Tired", emoji: "😴", color: "bg-gray-100" },
  { value: "loving", label: "Loving", emoji: "❤️", color: "bg-pink-100" }
];

export const saveMood = (userId: string, mood: string, reason: string): Mood => {
  const moods = JSON.parse(localStorage.getItem('moods') || '[]');
  
  const newMood = {
    id: Date.now().toString(),
    userId,
    mood,
    reason,
    timestamp: new Date().toISOString()
  };
  
  moods.push(newMood);
  localStorage.setItem('moods', JSON.stringify(moods));
  
  return newMood;
};

export const getUserMoods = (userId: string): Mood[] => {
  const moods = JSON.parse(localStorage.getItem('moods') || '[]');
  return moods
    .filter((mood: Mood) => mood.userId === userId)
    .sort((a: Mood, b: Mood) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const getPartnerMoods = (partnerId: string): Mood[] => {
  if (!partnerId) return [];
  
  const moods = JSON.parse(localStorage.getItem('moods') || '[]');
  return moods
    .filter((mood: Mood) => mood.userId === partnerId)
    .sort((a: Mood, b: Mood) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const deleteMood = (moodId: string): void => {
  const moods = JSON.parse(localStorage.getItem('moods') || '[]');
  const filteredMoods = moods.filter((mood: Mood) => mood.id !== moodId);
  localStorage.setItem('moods', JSON.stringify(filteredMoods));
};
