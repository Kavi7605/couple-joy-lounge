
export interface LoveLetter {
  id: string;
  from: string;
  to: string;
  title: string;
  content: string;
  createdAt: string;
  backgroundColor?: string;
  fontStyle?: string;
  isPrivate?: boolean;
}

export const saveLoveLetter = (letter: Omit<LoveLetter, 'id' | 'createdAt'>) => {
  const letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  
  const newLetter: LoveLetter = {
    ...letter,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  letters.push(newLetter);
  localStorage.setItem('loveLetters', JSON.stringify(letters));
  
  return newLetter;
};

export const getUserLetters = (userId: string) => {
  const letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  return letters.filter((letter: LoveLetter) => 
    letter.from === userId || letter.to === userId
  );
};

export const getLetter = (letterId: string) => {
  const letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  return letters.find((letter: LoveLetter) => letter.id === letterId);
};

export const deleteLetter = (letterId: string) => {
  const letters = JSON.parse(localStorage.getItem('loveLetters') || '[]');
  const updatedLetters = letters.filter((letter: LoveLetter) => letter.id !== letterId);
  localStorage.setItem('loveLetters', JSON.stringify(updatedLetters));
};
