import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';

import toolsData from '~/app/data/tools.json';
import blocsData from '~/app/data/bloc';
import { Container } from '~/components/Container';
import { Countdown } from '~/components/Countdown';
import { saveScore, getScores } from '../utils/scoreManager';

interface Bloc {
  id: number;
  name: string;
  image: string;
  toolsId: number;
}

export default function GameScreen() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [blocs, setBlocs] = useState<Bloc[]>([]);

  const generateBlocs = (start: number, count: number) => {
    const newBlocs = [];
    for (let i = start; i < start + count; i++) {
      const randomIndex = Math.floor(Math.random() * blocsData.length);
      newBlocs.push(blocsData[randomIndex]);
    }
    return newBlocs;
  };

  useEffect(() => {
    setBlocs(generateBlocs(0, 10));
  }, []);

  const handleGameOver = async () => {
    setGameOver(true);
    await saveScore('test', score);
    const scores = await getScores();
    if (scores) {
      const bestScore = scores['test'] || 0;
      setBestScore(bestScore);
    } else {
      setBestScore(0);
    }
  };

  const handlePress = (toolId: number) => {
    if (gameOver) return;

    const topBloc = blocs[0];
    if (toolId === topBloc.toolsId) {
      setBlocs(blocs.slice(1));
      setScore(score + 1);

      if(blocs.length < 6) {
        setBlocs(generateBlocs(0, 6));
      }
    } else {
      console.log("Outil incorrect! Essaie encore.");
    }
  };

  return (
    <ImageBackground source={require('../../assets/bg.jpg')} style={styles.backgroundImage}>
      <Stack.Screen options={{ title: 'Game' }} />
      <Container>
        <Countdown initialCount={10} onEnd={handleGameOver} />
        <Text>Score: {score}</Text>
        {gameOver && <Text>Meilleur Score: {bestScore}</Text>}
        <View style={styles.blocsContainer}>
          {blocs.map((bloc, index) => (
            <View key={index}>
              <Image source={bloc.image} style={styles.bloc} />
            </View>
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          {toolsData.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.button, styles[`slot${tool.slot}`]]}
              onPress={() => handlePress(tool.id)}>
              <Text>{tool.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Container>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blocsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 100,
  },
  bloc: {
    padding: 10,
    textAlign: 'center',
    width: 125,
    height: 125,
  },
  buttonsContainer: {
    position: 'absolute',
    padding: 20,
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'rgba(204, 204, 204, 0.7)',
    borderWidth: 3,
    borderColor: 'rgba(204, 204, 204, 0.7)',
    padding: 10,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftButton: {
    marginLeft: 10,
  },
  rightButton: {
    marginRight: 10,
  },
  slot1: {
    padding: 10,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100,
    position: 'absolute',
    left: 10,
    bottom: 120,
  },
  slot2: {
    padding: 10,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    bottom: 120,
  },
  slot3: {
    padding: 10,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100,
    position: 'absolute',
    left: 10,
    bottom: 10,
  },
  slot4: {
    padding: 10,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    bottom: 10,
  }
});
