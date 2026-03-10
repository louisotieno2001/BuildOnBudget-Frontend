import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TermsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terms of Service</Text>
      <Text style={styles.text}>Add your terms of service content here.</Text>
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
