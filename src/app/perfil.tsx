import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import { router } from "expo-router";

import {
  obterUsuario,
  encerrarSessao,
  type Usuario,
} from "../utils/auth";

export default function Perfil() {
  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  useEffect(() => {
    carregarUsuario();
  }, []);

  async function carregarUsuario() {
    try {
      const dados = await obterUsuario();

      if (!dados) {
        router.replace("/login");
        return;
      }

      setUsuario(dados);
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados da conta."
      );
    }
  }

  function confirmarSaida() {
    Alert.alert(
      "Sair da conta",
      "Deseja realmente sair do SheSafe?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: sair,
        },
      ]
    );
  }

  async function sair() {
    try {
      await encerrarSessao();

      router.replace("/login");
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível encerrar a sessão."
      );
    }
  }

  return (
    <View style={styles.container}>

      {/* =========================================
          CABEÇALHO
      ========================================= */}

      <View style={styles.cabecalho}>

        <Pressable
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.iconeVoltar}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>
            Meu perfil
          </Text>

          <Text style={styles.subtitulo}>
            Dados da sua conta
          </Text>
        </View>

      </View>

      {/* =========================================
          CONTEÚDO
      ========================================= */}

      <View style={styles.conteudo}>

        {/* AVATAR */}

        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {usuario?.nome
              ? usuario.nome
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </Text>
        </View>

        {/* NOME */}

        <Text style={styles.nome}>
          {usuario?.nome || "Usuária"}
        </Text>

        {/* E-MAIL */}

        <Text style={styles.email}>
          {usuario?.email || ""}
        </Text>

        {/* =====================================
            DADOS DA CONTA
        ===================================== */}

        <View style={styles.card}>

          <Text style={styles.cardTitulo}>
            Dados da conta
          </Text>

          <View style={styles.linha}>

            <Text style={styles.label}>
              Nome
            </Text>

            <Text style={styles.valor}>
              {usuario?.nome || "-"}
            </Text>

          </View>

          <View style={styles.linha}>

            <Text style={styles.label}>
              E-mail
            </Text>

            <Text style={styles.valor}>
              {usuario?.email || "-"}
            </Text>

          </View>

        </View>

        {/* =====================================
            MEUS CONTATOS
        ===================================== */}

        <Pressable
          style={styles.botaoContatos}
          onPress={() =>
            router.push("/contatos")
          }
        >

          <View style={styles.iconeContatosContainer}>
            <Text style={styles.iconeContatos}>
              👥
            </Text>
          </View>

          <View style={styles.textoContatosContainer}>

            <Text style={styles.tituloContatos}>
              Meus contatos
            </Text>

            <Text style={styles.subtituloContatos}>
              Pessoas de confiança
            </Text>

          </View>

          <Text style={styles.setaContatos}>
            ›
          </Text>

        </Pressable>

        {/* =====================================
            PRIVACIDADE
        ===================================== */}

        <View style={styles.aviso}>

          <Text style={styles.avisoTitulo}>
            Sua privacidade
          </Text>

          <Text style={styles.avisoTexto}>
            Os dados da sua conta e os contatos
            cadastrados são armazenados localmente
            neste dispositivo nesta versão do
            protótipo.
          </Text>

        </View>

        {/* =====================================
            SAIR
        ===================================== */}

        <Pressable
          style={styles.botaoSair}
          onPress={confirmarSaida}
        >

          <Text style={styles.iconeSair}>
            ⇥
          </Text>

          <Text style={styles.textoBotaoSair}>
            Sair da conta
          </Text>

        </Pressable>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /*
  ================================================
  CABEÇALHO
  ================================================
  */

  cabecalho: {
    minHeight: 90,

    backgroundColor: "#6A1B9A",

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 18,

    paddingTop: 20,

    paddingBottom: 14,
  },

  botaoVoltar: {
    width: 40,

    height: 40,

    justifyContent: "center",

    alignItems: "center",

    marginRight: 8,
  },

  iconeVoltar: {
    color: "#FFFFFF",

    fontSize: 38,

    fontWeight: "300",
  },

  tituloContainer: {
    flex: 1,
  },

  titulo: {
    color: "#FFFFFF",

    fontSize: 21,

    fontWeight: "bold",
  },

  subtitulo: {
    color: "#EDE7F6",

    fontSize: 14,

    marginTop: 3,
  },

  /*
  ================================================
  CONTEÚDO
  ================================================
  */

  conteudo: {
    flex: 1,

    padding: 22,

    alignItems: "center",
  },

  /*
  ================================================
  AVATAR
  ================================================
  */

  avatar: {
    width: 90,

    height: 90,

    borderRadius: 45,

    backgroundColor: "#EC407A",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 25,
  },

  avatarTexto: {
    color: "#FFFFFF",

    fontSize: 38,

    fontWeight: "bold",
  },

  /*
  ================================================
  NOME
  ================================================
  */

  nome: {
    fontSize: 24,

    fontWeight: "bold",

    color: "#222222",

    marginTop: 14,
  },

  email: {
    fontSize: 15,

    color: "#777777",

    marginTop: 5,
  },

  /*
  ================================================
  CARD DE DADOS
  ================================================
  */

  card: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 18,

    marginTop: 28,

    elevation: 3,

    shadowColor: "#000000",

    shadowOpacity: 0.08,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,

      height: 2,
    },
  },

  cardTitulo: {
    fontSize: 17,

    fontWeight: "bold",

    color: "#333333",

    marginBottom: 5,
  },

  linha: {
    borderTopWidth: 1,

    borderTopColor: "#EEEEEE",

    paddingVertical: 12,
  },

  label: {
    fontSize: 12,

    color: "#888888",

    marginBottom: 4,
  },

  valor: {
    fontSize: 16,

    color: "#333333",
  },

  /*
  ================================================
  MEUS CONTATOS
  ================================================
  */

  botaoContatos: {
    width: "100%",

    backgroundColor: "#FFFFFF",

    borderRadius: 14,

    padding: 15,

    flexDirection: "row",

    alignItems: "center",

    marginTop: 18,

    elevation: 2,

    shadowColor: "#000000",

    shadowOpacity: 0.06,

    shadowRadius: 4,

    shadowOffset: {
      width: 0,

      height: 2,
    },
  },

  iconeContatosContainer: {
    width: 48,

    height: 48,

    borderRadius: 24,

    backgroundColor: "#F3E5F5",

    justifyContent: "center",

    alignItems: "center",
  },

  iconeContatos: {
    fontSize: 24,
  },

  textoContatosContainer: {
    flex: 1,

    marginLeft: 12,
  },

  tituloContatos: {
    fontSize: 16,

    fontWeight: "bold",

    color: "#333333",
  },

  subtituloContatos: {
    fontSize: 12,

    color: "#777777",

    marginTop: 3,
  },

  setaContatos: {
    fontSize: 30,

    color: "#6A1B9A",

    fontWeight: "300",
  },

  /*
  ================================================
  AVISO DE PRIVACIDADE
  ================================================
  */

  aviso: {
    width: "100%",

    backgroundColor: "#F3E5F5",

    borderRadius: 12,

    padding: 14,

    marginTop: 18,
  },

  avisoTitulo: {
    fontSize: 14,

    fontWeight: "bold",

    color: "#6A1B9A",

    marginBottom: 5,
  },

  avisoTexto: {
    fontSize: 12,

    lineHeight: 17,

    color: "#6B6B6B",
  },

  /*
  ================================================
  BOTÃO SAIR
  ================================================
  */

  botaoSair: {
    width: "100%",

    height: 52,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: "#C62828",

    flexDirection: "row",

    justifyContent: "center",

    alignItems: "center",

    marginTop: 22,
  },

  iconeSair: {
    color: "#C62828",

    fontSize: 22,

    marginRight: 8,
  },

  textoBotaoSair: {
    color: "#C62828",

    fontSize: 16,

    fontWeight: "bold",
  },
});