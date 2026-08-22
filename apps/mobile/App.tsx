import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";

function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>KAR LE BHAI</Text>
        <Text style={styles.heading}>A trusted circle has your back.</Text>
        <Text style={styles.copy}>
          The app shell is ready. Native alarm scheduling remains the source of truth; this React Native layer owns the shared experience.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#111827", flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: 28 },
  eyebrow: {
    color: "#A7F3D0",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 16,
  },
  heading: { color: "#FFFFFF", fontSize: 34, fontWeight: "700", lineHeight: 41 },
  copy: { color: "#D1D5DB", fontSize: 17, lineHeight: 26, marginTop: 18 },
});

export default App;
