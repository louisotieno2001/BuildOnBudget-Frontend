import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.text}>Add your privacy policy content here.</Text>
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
  },
});
