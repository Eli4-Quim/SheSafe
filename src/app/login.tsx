import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { router } from "expo-router";

import {
  obterUsuario,
  criarSessao,
} from "../utils/auth";

export default function Login() {
  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  async function entrar() {
    const emailLimpo =
      email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha o e-mail e a senha."
      );

      return;
    }

    try {
      const usuario =
        await obterUsuario();

      if (!usuario) {
        Alert.alert(
          "Conta não encontrada",
          "Cadastre-se antes de entrar."
        );

        return;
      }

      if (
        usuario.email !== emailLimpo ||
        usuario.senha !== senha
      ) {
        Alert.alert(
          "Dados incorretos",
          "E-mail ou senha incorretos."
        );

        return;
      }

      await criarSessao();

      router.replace("/mapa");
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível realizar o login."
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>
            She
            <Text style={styles.logoPink}>
              Safe
            </Text>
          </Text>

          <Text style={styles.subtitulo}>
            Entre na sua conta
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>
            Senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Pressable
            style={styles.botao}
            onPress={entrar}
          >
            <Text style={styles.textoBotao}>
              ENTRAR
            </Text>
          </Pressable>

          <Pressable
            style={styles.cadastro}
            onPress={() =>
              router.push("/cadastro")
            }
          >
            <Text
              style={styles.textoCadastro}
            >
              Não possui uma conta?
            </Text>

            <Text
              style={styles.textoCadastroDestaque}
            >
              Cadastre-se
            </Text>
          </Pressable>

          <Pressable
            style={styles.voltar}
            onPress={() =>
              router.replace("/")
            }
          >
            <Text style={styles.textoVoltar}>
              Voltar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6A1B9A",
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 30,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 45,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },

  logoPink: {
    color: "#EC407A",
  },

  subtitulo: {
    color: "#FFFFFF",
    fontSize: 18,
    marginTop: 8,
  },

  formulario: {
    width: "100%",
  },

  label: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  botao: {
    height: 54,
    backgroundColor: "#EC407A",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  cadastro: {
    alignItems: "center",
    marginTop: 22,
  },

  textoCadastro: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  textoCadastroDestaque: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 4,
  },

  voltar: {
    alignItems: "center",
    marginTop: 20,
  },

  textoVoltar: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});