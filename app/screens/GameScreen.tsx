import { Stack } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';

import { saveScore, getScores } from '../utils/scoreManager';

import blocsData from '~/app/data/bloc';
import toolsData from '~/app/data/tools';
import { Container } from '~/components/Container';
import { Countdown } from '~/components/Countdown';

interface Bloc {
  id: number;
  name: string;
  image: string;
  toolsId: number;
}

export default function GameScreen() {
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [countdownTimer, setCountdownTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [blocs, setBlocs] = useState<Bloc[]>([]);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(scoreAnim, {
      toValue: score,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [score]);

  useEffect(() => {
    console.log('Game over state changed:', gameOver);
  }, [gameOver]);

  const generateBlocs = (start: number, count: number) => {
    const newBlocs = [];
    for (let i = start; i < start + count; i++) {
      const randomIndex = Math.floor(Math.random() * blocsData.length);
      newBlocs.push(blocsData[randomIndex]);
    }
    return newBlocs;
  };

  useEffect(() => {
    setBlocs(generateBlocs(0, 100));
  }, []);

  const handleGameOver = async () => {
    if (!gameOver) {
      try {
        setGameOver(true);
        await saveScore('test', score);
        const scores = await getScores();
        setBestScore(scores ? scores['test'] || 0 : 0);
      } catch (error) {
        console.error('Failed to handle game over:', error);
      }
    }
  };

  const restartGame = () => {
    setGameOver(false);
    setBlocs(generateBlocs(0, 100));
    setScore(0);
    setCountdownTimer(10);
    console.log('Game restarted');
  };

  const handlePress = (toolId: number) => {
    if (gameOver) return;

    const topBloc = blocs[0];

    //If not the same tool, shake the bloc
    if (toolId !== topBloc.toolsId) {
      setErrorOccurred(true);
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start(() => setErrorOccurred(false));

      return;
    }

    setBlocs(blocs.slice(1));

    if (toolId === topBloc.toolsId) {
      setScore(score + 1);
    }
  };

  return (
    <ImageBackground source={require('../../assets/bg.jpg')} style={styles.backgroundImage}>
      <Stack.Screen options={{ title: 'Game' }} />
      <Container>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreBlock}>
            <Text style={styles.numberText}>{score}</Text>
            <Text style={styles.scoreText}>Score</Text>
          </View>

          <Countdown initialCount={countdownTimer} onEnd={handleGameOver} />

          <View style={styles.scoreBlock}>
            <Text style={styles.numberText}>{bestScore}</Text>
            <Text style={styles.scoreText}>Best</Text>
          </View>
        </View>
        <View style={styles.blocsContainer}>
          {blocs.map((bloc, index) => (
            <View key={index}>
              <Animated.View
                style={[
                  styles.block,
                  {
                    transform: [{ translateX: shakeAnimation }],
                    borderColor: errorOccurred ? 'red' : 'transparent',
                  },
                ]}>
                <Image source={bloc.image} style={styles.bloc} />
              </Animated.View>
            </View>
          ))}
        </View>
        <View style={styles.buttonsContainer}>
          {toolsData.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={[styles.button, styles[`slot${tool.slot}`]]}
              onPress={() => handlePress(tool.id)}>
              <Image source={tool.image} style={styles.toolImage} />
            </TouchableOpacity>
          ))}
        </View>

        {/* make popup for game over and restart */}
        {gameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
              <Text style={styles.restartText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
      </Container>
    </ImageBackground>
  );
}

const styles: { [key: string]: any } = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blocsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 80,
  },
  bloc: {
    width: 135,
    height: 135,
    backgroundColor: '#e0e0e0', // Utiliser une couleur neutre pour la visibilité de l'ombre
    borderRadius: 8, // Adoucir légèrement les bords
    alignItems: 'center',
    justifyContent: 'center',

    // Ombre
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10, // Pour Android
  },
  blocText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.5)',
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
    bottom: 130,
  },
  slot2: {
    padding: 10,
    minWidth: 100,
    minHeight: 100,
    borderRadius: 100,
    position: 'absolute',
    right: 10,
    bottom: 130,
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
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fond semi-transparent
    marginTop: 0,
    height: 100, // Hauteur fixe pour tout le container
    width: '100%',
  },
  scoreBlock: {
    flex: 1,
    alignItems: 'center', // Centrer les textes à l'intérieur de chaque bloc
  },

  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 5,
  },
  numberText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(0, 180, 0)',
  },
  toolImage: {
    width: 60,
    height: 60,
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFF',
  },
  restartButton: {
    backgroundColor: 'rgb(0, 180, 0)',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  restartText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
