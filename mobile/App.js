import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  // URL de ton site Vercel (ou localhost en dev)
  const BASE_URL = 'https://openprimer.vercel.app'; 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      <View style={styles.webviewWrapper}>
        <WebView 
          source={{ uri: BASE_URL }}
          style={styles.webview}
          // Optimisations pour une expérience fluide
          allowsBackForwardNavigationGestures={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          scalesPageToFit={true}
          startInLoadingState={true}
          renderLoading={() => <View style={styles.loading} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Slate-950
  },
  webviewWrapper: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loading: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
