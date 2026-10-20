import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  Linking,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { router } from "expo-router";

import * as SecureStore from "expo-secure-store";

const CONTATOS_KEY = "shesafe_contatos";

type Contato = {
  id: string;
  nome: string;
  telefone: string;
};

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  useEffect(() => {
    carregarContatos();
  }, []);

  async function carregarContatos() {
    try {
      const dados =
        await SecureStore.getItemAsync(
          CONTATOS_KEY
        );

      if (!dados) {
        setContatos([]);
        return;
      }

      const contatosSalvos = JSON.parse(dados);

      if (Array.isArray(contatosSalvos)) {
        setContatos(contatosSalvos);
      } else {
        setContatos([]);
      }
    } catch (erro) {
      console.log(
        "Erro ao carregar contatos:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível carregar os contatos."
      );
    }
  }

  async function salvarListaContatos(
    lista: Contato[]
  ) {
    await SecureStore.setItemAsync(
      CONTATOS_KEY,
      JSON.stringify(lista)
    );
  }

  async function adicionarNovoContato() {
    const nomeLimpo = nome.trim();
    const telefoneLimpo = telefone.trim();

    if (!nomeLimpo || !telefoneLimpo) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha o nome e o telefone."
      );
      return;
    }

    if (contatos.length >= 5) {
      Alert.alert(
        "Limite atingido",
        "Você pode cadastrar no máximo 5 contatos."
      );
      return;
    }

    try {
      const novoContato: Contato = {
        id: Date.now().toString(),
        nome: nomeLimpo,
        telefone: telefoneLimpo,
      };

      const novaLista = [
        ...contatos,
        novoContato,
      ];

      await salvarListaContatos(novaLista);

      setContatos(novaLista);

      setNome("");
      setTelefone("");
      setMostrarFormulario(false);

      Alert.alert(
        "Contato adicionado",
        `${nomeLimpo} foi adicionado aos seus contatos de confiança.`
      );
    } catch (erro) {
      console.log(
        "Erro ao adicionar contato:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível adicionar o contato."
      );
    }
  }

  function confirmarExclusao(
    contato: Contato
  ) {
    Alert.alert(
      "Excluir contato",
      `Deseja realmente excluir ${contato.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            removerContato(contato.id),
        },
      ]
    );
  }

  async function removerContato(id: string) {
    try {
      const novaLista = contatos.filter(
        (contato) => contato.id !== id
      );

      await salvarListaContatos(novaLista);

      setContatos(novaLista);
    } catch (erro) {
      console.log(
        "Erro ao excluir contato:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível excluir o contato."
      );
    }
  }

  async function ligarParaContato(
    telefone: string
  ) {
    const numero =
      telefone.replace(/\D/g, "");

    if (!numero) {
      Alert.alert(
        "Telefone inválido",
        "O número informado não é válido."
      );
      return;
    }

    try {
      await Linking.openURL(
        `tel:${numero}`
      );
    } catch (erro) {
      console.log(
        "Erro ao ligar:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível iniciar a ligação."
      );
    }
  }

  async function enviarMensagem(
    telefone: string
  ) {
    const numero =
      telefone.replace(/\D/g, "");

    if (!numero) {
      Alert.alert(
        "Telefone inválido",
        "O número informado não é válido."
      );
      return;
    }

    const mensagem =
      "Olá! Preciso falar com você. Estou usando o SheSafe.";

    const url =
      `sms:${numero}?body=${encodeURIComponent(
        mensagem
      )}`;

    try {
      await Linking.openURL(url);
    } catch (erro) {
      console.log(
        "Erro ao abrir SMS:",
        erro
      );

      Alert.alert(
        "Erro",
        "Não foi possível abrir o aplicativo de mensagens."
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
            Meus contatos
          </Text>

          <Text style={styles.subtitulo}>
            Pessoas de confiança
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.conteudo
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.info}>
          <Text style={styles.infoTitulo}>
            Contatos de confiança
          </Text>

          <Text style={styles.infoTexto}>
            Cadastre pessoas que você confia
            para encontrá-las rapidamente
            em uma situação de emergência.
          </Text>

          <Text style={styles.contador}>
            {contatos.length} de 5 contatos
            cadastrados
          </Text>
        </View>

        {contatos.length === 0 &&
          !mostrarFormulario && (
            <View style={styles.vazio}>
              <View
                style={styles.iconeVazio}
              >
                <Text
                  style={
                    styles.iconeVazioTexto
                  }
                >
                  👥
                </Text>
              </View>

              <Text
                style={styles.vazioTitulo}
              >
                Nenhum contato cadastrado
              </Text>

              <Text
                style={styles.vazioTexto}
              >
                Adicione alguém de confiança
                para facilitar o contato em
                uma emergência.
              </Text>
            </View>
          )}

        {contatos.map((contato) => (
          <View
            key={contato.id}
            style={styles.cardContato}
          >
            <View style={styles.avatar}>
              <Text
                style={styles.avatarTexto}
              >
                {contato.nome
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>

            <View
              style={styles.dadosContato}
            >
              <Text
                style={styles.nomeContato}
              >
                {contato.nome}
              </Text>

              <Text
                style={
                  styles.telefoneContato
                }
              >
                {contato.telefone}
              </Text>
            </View>

            <View style={styles.acoes}>
              <Pressable
                style={[
                  styles.botaoAcao,
                  styles.botaoLigar,
                ]}
                onPress={() =>
                  ligarParaContato(
                    contato.telefone
                  )
                }
              >
                <Text
                  style={styles.iconeAcao}
                >
                  ☎
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.botaoAcao,
                  styles.botaoMensagem,
                ]}
                onPress={() =>
                  enviarMensagem(
                    contato.telefone
                  )
                }
              >
                <Text
                  style={styles.iconeAcao}
                >
                  💬
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.botaoAcao,
                  styles.botaoExcluir,
                ]}
                onPress={() =>
                  confirmarExclusao(
                    contato
                  )
                }
              >
                <Text
                  style={
                    styles.iconeExcluir
                  }
                >
                  🗑
                </Text>
              </Pressable>
            </View>
          </View>
        ))}

        {mostrarFormulario ? (
          <View style={styles.formulario}>
            <Text
              style={
                styles.formularioTitulo
              }
            >
              Adicionar contato
            </Text>

            <Text style={styles.label}>
              Nome
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: Maria"
              placeholderTextColor="#999999"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>
              Telefone
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Ex.: (81) 99999-9999"
              placeholderTextColor="#999999"
              value={telefone}
              onChangeText={
                setTelefone
              }
              keyboardType="phone-pad"
            />

            <View
              style={
                styles.botoesFormulario
              }
            >
              <Pressable
                style={[
                  styles.botaoFormulario,
                  styles.botaoCancelar,
                ]}
                onPress={() => {
                  setNome("");
                  setTelefone("");
                  setMostrarFormulario(
                    false
                  );
                }}
              >
                <Text
                  style={
                    styles.textoCancelar
                  }
                >
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.botaoFormulario,
                  styles.botaoSalvar,
                ]}
                onPress={
                  adicionarNovoContato
                }
              >
                <Text
                  style={
                    styles.textoSalvar
                  }
                >
                  Salvar contato
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={[
              styles.botaoAdicionar,
              contatos.length >= 5 &&
                styles.botaoAdicionarDesabilitado,
            ]}
            disabled={contatos.length >= 5}
            onPress={() =>
              setMostrarFormulario(true)
            }
          >
            <Text
              style={
                styles.iconeAdicionar
              }
            >
              +
            </Text>

            <Text
              style={
                styles.textoAdicionar
              }
            >
              Adicionar contato
            </Text>
          </Pressable>
        )}

        <View
          style={
            styles.avisoPrivacidade
          }
        >
          <Text
            style={styles.avisoTitulo}
          >
            Privacidade
          </Text>

          <Text
            style={styles.avisoTexto}
          >
            Os contatos cadastrados ficam
            armazenados localmente neste
            dispositivo nesta versão do
            protótipo.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

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

  scroll: {
    flex: 1,
  },

  conteudo: {
    padding: 20,
    paddingBottom: 40,
  },

  info: {
    backgroundColor: "#F3E5F5",
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },

  infoTitulo: {
    color: "#6A1B9A",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 6,
  },

  infoTexto: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 19,
  },

  contador: {
    color: "#6A1B9A",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 10,
  },

  vazio: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    marginBottom: 18,
    elevation: 2,
  },

  iconeVazio: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F3E5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  iconeVazioTexto: {
    fontSize: 32,
  },

  vazioTitulo: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
  },

  vazioTexto: {
    fontSize: 13,
    color: "#777777",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  cardContato: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EC407A",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarTexto: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },

  dadosContato: {
    flex: 1,
    marginLeft: 12,
  },

  nomeContato: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },

  telefoneContato: {
    fontSize: 13,
    color: "#777777",
    marginTop: 4,
  },

  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  botaoAcao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  botaoLigar: {
    backgroundColor: "#E8F5E9",
  },

  botaoMensagem: {
    backgroundColor: "#E3F2FD",
  },

  botaoExcluir: {
    backgroundColor: "#FFEBEE",
  },

  iconeAcao: {
    fontSize: 17,
  },

  iconeExcluir: {
    fontSize: 16,
  },

  formulario: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 6,
    elevation: 2,
  },

  formularioTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555555",
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#333333",
    backgroundColor: "#FAFAFA",
    marginBottom: 15,
  },

  botoesFormulario: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },

  botaoFormulario: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  botaoCancelar: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    backgroundColor: "#FFFFFF",
  },

  botaoSalvar: {
    backgroundColor: "#6A1B9A",
  },

  textoCancelar: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "bold",
  },

  textoSalvar: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  botaoAdicionar: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#6A1B9A",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },

  botaoAdicionarDesabilitado: {
    opacity: 0.5,
  },

  iconeAdicionar: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "300",
    marginRight: 8,
    marginTop: -2,
  },

  textoAdicionar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  avisoPrivacidade: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  avisoTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 5,
  },

  avisoTexto: {
    fontSize: 12,
    color: "#777777",
    lineHeight: 17,
  },
});