import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CountdownProps = {
  initialCount: number;
  onEnd: () => void;
};

export const Countdown = ({ initialCount, onEnd }: CountdownProps) => {
  const [count, setCount] = useState(initialCount);

  // Re-initialize the count whenever initialCount changes
  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    console.log('Countdown value:', count);
    if (count <= 0) {
      onEnd(); // Assure-toi que cela n'est pas déclenché immédiatement
      return;
    }

    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer); // Nettoyage du timeout précédent
  }, [count]);

  return (
    <View style={styles.countdownBlock}>
      <Text style={styles.countdownText}>{count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  countdownBlock: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderColor: '#FFF',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 150, 0, 0.7)',
    marginTop: 50,
  },
  countdownText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
