import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

import { router } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>
          She<Text style={styles.logoPink}>Safe</Text>
        </Text>

        <Text style={styles.subtitle}>
          Seu caminho, sua segurança.
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.startButton}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.startButtonText}>
            CRIAR CONTA
          </Text>
        </Pressable>

        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>
            Já tenho uma conta
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A1B9A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 100,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "700",
  },

  logoPink: {
    color: "#EC407A",
  },

  subtitle: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 12,
    textAlign: "center",
  },

  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },

  startButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#EC407A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  startButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  loginButton: {
    marginTop: 20,
    paddingVertical: 10,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});