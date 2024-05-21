import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé pour stocker les scores
const SCORE_KEY = 'user_scores';

// Fonction pour obtenir le score actuel
export async function getScores(): Promise<{[key: string]: number} | null> {
  try {
    const scoresJson = await AsyncStorage.getItem(SCORE_KEY);
    return scoresJson != null ? JSON.parse(scoresJson) : {};
  } catch (e) {
    console.error('Failed to fetch scores', e);
    return null; // Retourne null en cas d'erreur
  }
}

// Fonction pour sauvegarder le meilleur score
export async function saveScore(mode: string, newScore: number): Promise<boolean> {
  try {
    const scores = await getScores();
    if (!scores) {
      throw new Error('Unable to retrieve scores');
    }
    const bestScore = scores[mode] ?? 0;
    if (newScore > bestScore) {
      scores[mode] = newScore;
      const scoresJson = JSON.stringify(scores);
      await AsyncStorage.setItem(SCORE_KEY, scoresJson);
      return true; // Retourne true pour indiquer le succès
    }
    return false; // Retourne false si le nouveau score n'est pas un record
  } catch (e) {
    console.error('Failed to save score', e);
    throw e; // Propage l'erreur
  }
}
