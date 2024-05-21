import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CountdownProps = {
  initialCount: number;
  onEnd: () => void;
};

export const Countdown = ({ initialCount, onEnd }: CountdownProps) => {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (count === 0) {
      onEnd();
      return;
    }
    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{count} seconds remaining</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#000000A0',
    borderRadius: 20,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
