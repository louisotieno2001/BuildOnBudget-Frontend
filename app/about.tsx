import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>About</Text>
      <Text style={styles.text}>
        BuildOnBudget helps you plan, track, and collaborate on projects while keeping spending in check.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5f0',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#5b21b6',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: '#52606d',
    lineHeight: 22,
  },
});
