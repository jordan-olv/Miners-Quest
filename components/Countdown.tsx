import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CountdownProps = {
  initialCount: number;
  onEnd: () => void;
  errorOccurred: boolean;
};

export const Countdown = ({ initialCount, onEnd, errorOccurred }: CountdownProps) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count <= 0) {
      onEnd();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count]);

  // Écouter les changements sur `errorOccurred` pour déduire 2 secondes
  useEffect(() => {
    if (errorOccurred) {
      // Vérifie que déduire 2 ne met pas le compte à un nombre négatif
      setCount(prevCount => Math.max(prevCount - 2, 0));
    }
  }, [errorOccurred]);

  return (
    <View style={styles.countdownBlock}>
      <Text style={styles.countdownText}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000A0',
    borderRadius: 100,
    width: 80,
    height: 80,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countdownBlock: {
    width: 110, // Larger width for the countdown
    height: 110, // Height equal to the width to make a circle
    borderRadius: 60, // Half of the width and height to create a full circle
    borderColor: '#FFF',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 150, 0, 0.7)', // Minecraft green color
    marginTop: 50,
  },
  countdownText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
