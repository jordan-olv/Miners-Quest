import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';
import { getScores } from '~/app/utils/scoreManager'; // Assurez-vous que le chemin est correct

export default function Home() {
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    async function fetchBestScore() {
      const scores = await getScores();
      if (scores && scores['test']) {
        setBestScore(scores['test']);
      }
    }

    fetchBestScore();
  }, []);

  return (
    <Container>
      <Text style={styles.title}>Miner's Quest</Text>
      <Link href={{ pathname: '/screens/GameScreen', params: { name: 'Dan' } }} asChild>
        <Button title="Jouer" />
      </Link>

      <Text style={styles.score}>Meilleur Score: {bestScore}</Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  score: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  }
});
