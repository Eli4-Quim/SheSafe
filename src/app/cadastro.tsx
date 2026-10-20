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
  salvarUsuario,
  criarSessao,
} from "../utils/auth";

export default function Cadastro() {
  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [confirmarSenha, setConfirmarSenha] =
    useState("");

  async function cadastrar() {
    const nomeLimpo =
      nome.trim();

    const emailLimpo =
      email.trim().toLowerCase();

    if (!nomeLimpo) {
      Alert.alert(
        "Campo obrigatório",
        "Digite seu nome."
      );

      return;
    }

    if (!emailLimpo) {
      Alert.alert(
        "Campo obrigatório",
        "Digite seu e-mail."
      );

      return;
    }

    if (
      !emailLimpo.includes("@") ||
      !emailLimpo.includes(".")
    ) {
      Alert.alert(
        "E-mail inválido",
        "Digite um e-mail válido."
      );

      return;
    }

    if (senha.length < 6) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter pelo menos 6 caracteres."
      );

      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert(
        "Senhas diferentes",
        "As senhas digitadas não são iguais."
      );

      return;
    }

    try {
      await salvarUsuario({
        nome: nomeLimpo,
        email: emailLimpo,
        senha,
      });

      await criarSessao();

      Alert.alert(
        "Cadastro realizado",
        "Sua conta foi criada com sucesso.",
        [
          {
            text: "Continuar",
            onPress: () =>
              router.replace("/mapa"),
          },
        ]
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Erro",
        "Não foi possível realizar o cadastro."
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
            Criar uma conta
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>
            Nome
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
            value={nome}
            onChangeText={setNome}
          />

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
            placeholder="Mínimo de 6 caracteres"
            placeholderTextColor="#999"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Text style={styles.label}>
            Confirmar senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite a senha novamente"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
          />

          <Pressable
            style={styles.botao}
            onPress={cadastrar}
          >
            <Text style={styles.textoBotao}>
              CADASTRAR
            </Text>
          </Pressable>

          <Pressable
            style={styles.login}
            onPress={() =>
              router.replace("/login")
            }
          >
            <Text style={styles.textoLogin}>
              Já possui uma conta?
            </Text>

            <Text
              style={
                styles.textoLoginDestaque
              }
            >
              Entrar
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
    marginBottom: 35,
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

  login: {
    alignItems: "center",
    marginTop: 22,
  },

  textoLogin: {
    color: "#FFFFFF",
    fontSize: 14,
  },

  textoLoginDestaque: {
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