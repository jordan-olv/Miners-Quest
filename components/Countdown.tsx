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
    <View style={styles.container}>
      <Text style={styles.text}>{count}</Text>
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
});
