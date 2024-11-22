import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORE_KEY = 'game_scores';

export async function saveScore(mode: string, newScore: number): Promise<boolean> {
  try {
    const scoresJson = await AsyncStorage.getItem(SCORE_KEY);
    const scores = scoresJson ? JSON.parse(scoresJson) : {};

    const bestScore = scores[mode] ?? 0;
    if (newScore > bestScore) {
      scores[mode] = newScore;
      await AsyncStorage.setItem(SCORE_KEY, JSON.stringify(scores));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to save score:', error);
    throw error;
  }
}

export async function getScores(): Promise<Record<string, number> | null> {
  try {
    const scoresJson = await AsyncStorage.getItem(SCORE_KEY);
    return scoresJson ? JSON.parse(scoresJson) : null;
  } catch (error) {
    console.error('Failed to retrieve scores:', error);
    return null;
  }
}
