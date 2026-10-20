import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from "react-native";

import { router } from "expo-router";

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";

import * as Location from "expo-location";

import { usuarioEstaLogado } from "../utils/auth";

type TipoLocal =
  | "delegacia"
  | "hospital"
  | "apoio"
  | "ocorrencia"
  | "historico";

type TipoOcorrencia =
  | "estupro"
  | "feminicidio"
  | "violencia_domestica"
  | "outros";

type Local = {
  id: string;
  tipo: TipoLocal;
  subtipo?: TipoOcorrencia;

  nome: string;
  descricao: string;

  latitude: number;
  longitude: number;

  cor: string;

  periodo?: string;
  registros?: number;
  fonte?: string;
};

/*
======================================================
LOCAIS DO MAPA
======================================================
*/

const locais: Local[] = [
  // ==================================================
  // DELEGACIA
  // ==================================================

  {
    id: "1",
    tipo: "delegacia",
    nome: "1ª Delegacia da Mulher – Recife",
    descricao:
      "Praça do Campo Santo, s/n - Santo Amaro",
    latitude: -8.0503,
    longitude: -34.88286,
    cor: "#2196F3",
  },

  // ==================================================
  // APOIO
  // ==================================================

  {
    id: "2",
    tipo: "apoio",
    nome: "Centro de Referência Clarice Lispector",
    descricao:
      "Rua Dr. Silva Ferreira, 122 - Santo Amaro",
    latitude: -8.05271,
    longitude: -34.87829,
    cor: "#9C27B0",
  },

  {
    id: "3",
    tipo: "apoio",
    nome: "Centro Marta Almeida",
    descricao:
      "Rua do Bom Jesus, 147 - Bairro do Recife",
    latitude: -8.06248,
    longitude: -34.87161,
    cor: "#9C27B0",
  },

  // ==================================================
  // HOSPITAIS
  // ==================================================

  {
    id: "4",
    tipo: "hospital",
    nome: "Hospital da Restauração",
    descricao:
      "Av. Gov. Agamenon Magalhães, s/n - Derby",
    latitude: -8.05378,
    longitude: -34.89776,
    cor: "#FF9800",
  },

  {
    id: "5",
    tipo: "hospital",
    nome: "Hospital Agamenon Magalhães",
    descricao:
      "Estrada do Arraial, 2723 - Casa Amarela",
    latitude: -8.03099,
    longitude: -34.90736,
    cor: "#FF9800",
  },

  {
    id: "6",
    tipo: "hospital",
    nome: "Hospital da Mulher do Recife",
    descricao:
      "BR-101, 485 - Curado",
    latitude: -8.07071,
    longitude: -34.94113,
    cor: "#FF9800",
  },

  // ==================================================
  // INDICADORES
  // ==================================================

  {
    id: "7",
    tipo: "ocorrencia",
    subtipo: "violencia_domestica",
    nome: "Violência doméstica – Recife",
    descricao:
      "Indicador municipal agregado. O marcador representa o município, não o endereço de uma ocorrência específica.",
    latitude: -8.0476,
    longitude: -34.877,
    cor: "#E91E63",
    periodo: "Janeiro a setembro de 2025",
    registros: 5140,
    fonte:
      "SDS-PE / GGACE – Violência Doméstica",
  },

  {
    id: "8",
    tipo: "ocorrencia",
    subtipo: "estupro",
    nome: "Estupro – Recife",
    descricao:
      "Indicador municipal agregado. O marcador representa o município, não o endereço de uma ocorrência específica.",
    latitude: -8.0476,
    longitude: -34.877,
    cor: "#F44336",
    periodo: "Janeiro a setembro de 2025",
    registros: 325,
    fonte:
      "SDS-PE / GGACE – Estupro",
  },

  {
    id: "9",
    tipo: "ocorrencia",
    subtipo: "violencia_domestica",
    nome: "Violência doméstica – Recife 2024",
    descricao:
      "Indicador municipal agregado. O marcador representa o município, não o endereço de uma ocorrência específica.",
    latitude: -8.0476,
    longitude: -34.877,
    cor: "#AD1457",
    periodo: "Janeiro a dezembro de 2024",
    registros: 9811,
    fonte:
      "SDS-PE / GGACE – Violência Doméstica",
  },

  {
    id: "10",
    tipo: "ocorrencia",
    subtipo: "estupro",
    nome: "Estupro – Recife 2024",
    descricao:
      "Indicador municipal agregado. O marcador representa o município, não o endereço de uma ocorrência específica.",
    latitude: -8.0476,
    longitude: -34.877,
    cor: "#C62828",
    periodo: "Janeiro a dezembro de 2024",
    registros: 455,
    fonte:
      "SDS-PE / GGACE – Estupro",
  },

  // ==================================================
  // HISTÓRICO POR BAIRRO
  // ==================================================

  {
    id: "bairro-1",
    tipo: "historico",
    nome: "Boa Viagem",
    descricao:
      "Histórico de violência contra a mulher — dado agregado do bairro.",
    latitude: -8.1235,
    longitude: -34.9034,
    cor: "#C62828",
    periodo: "2021",
    registros: 874,
    fonte:
      "SDS-PE / estudo UFPE",
  },

  {
    id: "bairro-2",
    tipo: "historico",
    nome: "Água Fria",
    descricao:
      "Histórico de violência contra a mulher — dado agregado do bairro.",
    latitude: -8.01697,
    longitude: -34.89824,
    cor: "#D32F2F",
    periodo: "2021",
    registros: 469,
    fonte:
      "SDS-PE / estudo UFPE",
  },

  {
    id: "bairro-3",
    tipo: "historico",
    nome: "Iputinga",
    descricao:
      "Histórico de violência contra a mulher — dado agregado do bairro.",
    latitude: -8.03982,
    longitude: -34.93735,
    cor: "#E53935",
    periodo: "2021",
    registros: 465,
    fonte:
      "SDS-PE / estudo UFPE",
  },

  {
    id: "bairro-4",
    tipo: "historico",
    nome: "Cohab",
    descricao:
      "Histórico de violência contra a mulher — dado agregado do bairro.",
    latitude: -8.11948,
    longitude: -34.95267,
    cor: "#EF5350",
    periodo: "2021",
    registros: 443,
    fonte:
      "SDS-PE / estudo UFPE",
  },

  {
    id: "bairro-5",
    tipo: "historico",
    nome: "Várzea",
    descricao:
      "Histórico de violência contra a mulher — dado agregado do bairro.",
    latitude: -8.04573,
    longitude: -34.95277,
    cor: "#E53935",
    periodo: "2021",
    registros: 427,
    fonte:
      "SDS-PE / estudo UFPE",
  },
];

/*
======================================================
FILTROS PRINCIPAIS
======================================================
*/

const filtrosLocais = [
  {
    id: "todos",
    nome: "Todos",
  },
  {
    id: "delegacia",
    nome: "Delegacias",
  },
  {
    id: "hospital",
    nome: "Hospitais",
  },
  {
    id: "apoio",
    nome: "Apoio",
  },
  {
    id: "ocorrencia",
    nome: "Indicadores",
  },
  {
    id: "historico",
    nome: "Histórico por bairro",
  },
];

/*
======================================================
FILTROS DE OCORRÊNCIA
======================================================
*/

const filtrosOcorrencia = [
  {
    id: "todos",
    nome: "Todos",
  },
  {
    id: "estupro",
    nome: "Estupro",
  },
  {
    id: "feminicidio",
    nome: "Feminicídio",
  },
  {
    id: "violencia_domestica",
    nome: "Violência doméstica",
  },
  {
    id: "outros",
    nome: "Outros",
  },
];

/*
======================================================
PERÍODOS
======================================================
*/

const periodos = [
  {
    id: "todos",
    nome: "Todos",
  },
  {
    id: "2025",
    nome: "2025",
  },
  {
    id: "2024",
    nome: "2024",
  },
];

/*
======================================================
NOME DO TIPO
======================================================
*/

function nomeTipo(tipo: TipoLocal) {
  if (tipo === "delegacia") {
    return "Delegacia / DEAM";
  }

  if (tipo === "hospital") {
    return "Hospital";
  }

  if (tipo === "apoio") {
    return "Apoio à mulher";
  }

  if (tipo === "ocorrencia") {
    return "Indicador de segurança";
  }

  return "Histórico por bairro";
}

/*
======================================================
NOME DA OCORRÊNCIA
======================================================
*/

function nomeOcorrencia(
  tipo?: TipoOcorrencia
) {
  if (tipo === "estupro") {
    return "Estupro";
  }

  if (tipo === "feminicidio") {
    return "Feminicídio";
  }

  if (tipo === "violencia_domestica") {
    return "Violência doméstica";
  }

  if (tipo === "outros") {
    return "Outros";
  }

  return "";
}

/*
======================================================
MAPA
======================================================
*/

export default function Mapa() {
  const mapaRef = useRef<MapView | null>(null);

  const [filtroLocal, setFiltroLocal] =
    useState("todos");

  const [filtroOcorrencia, setFiltroOcorrencia] =
    useState("todos");

  const [periodoSelecionado, setPeriodoSelecionado] =
    useState("todos");

  const [localizacao, setLocalizacao] =
    useState<Location.LocationObject | null>(
      null
    );

  const [regiaoInicial, setRegiaoInicial] =
    useState<Region>({
      latitude: -8.053,
      longitude: -34.899,
      latitudeDelta: 0.12,
      longitudeDelta: 0.16,
    });

  const [localSelecionado, setLocalSelecionado] =
    useState<Local | null>(null);

  /*
  ==================================================
  VERIFICAR SESSÃO
  ==================================================
  */

  useEffect(() => {
    verificarSessao();
  }, []);

  async function verificarSessao() {
    try {
      const logado =
        await usuarioEstaLogado();

      if (!logado) {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }

  /*
  ==================================================
  LOCALIZAÇÃO
  ==================================================
  */

  useEffect(() => {
    obterLocalizacao();
  }, []);

  async function obterLocalizacao() {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Precisamos da sua localização para mostrar sua posição no mapa."
        );

        return;
      }

      const posicao =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High,
        });

      setLocalizacao(posicao);

      setRegiaoInicial({
        latitude:
          posicao.coords.latitude,
        longitude:
          posicao.coords.longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível obter sua localização."
      );
    }
  }

  /*
  ==================================================
  MINHA LOCALIZAÇÃO
  ==================================================
  */

  async function minhaLocalizacao() {
    try {
      if (!localizacao) {
        await obterLocalizacao();
        return;
      }

      mapaRef.current?.animateToRegion(
        {
          latitude:
            localizacao.coords.latitude,

          longitude:
            localizacao.coords.longitude,

          latitudeDelta: 0.015,

          longitudeDelta: 0.015,
        },

        800
      );
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível localizar você."
      );
    }
  }

  /*
  ==================================================
  COMO CHEGAR
  ==================================================
  */

  async function comoChegar(
    local: Local
  ) {
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${local.latitude},${local.longitude}`;

    try {
      const podeAbrir =
        await Linking.canOpenURL(url);

      if (podeAbrir) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Erro",
          "Não foi possível abrir o aplicativo de mapas."
        );
      }
    } catch {
      Alert.alert(
        "Erro",
        "Não foi possível abrir o Google Maps."
      );
    }
  }

  /*
  ==================================================
  LIGAÇÃO
  ==================================================
  */

  async function ligar(numero: string) {
    const mensagem =
      numero === "190"
        ? "Deseja ligar para o 190?"
        : "Deseja ligar para o Ligue 180?";

    Alert.alert(
      "Confirmar ligação",
      mensagem,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },

        {
          text: "Ligar",

          onPress: async () => {
            try {
              const url =
                `tel:${numero}`;

              const podeAbrir =
                await Linking.canOpenURL(
                  url
                );

              if (podeAbrir) {
                await Linking.openURL(
                  url
                );
              } else {
                Alert.alert(
                  "Erro",
                  "Este dispositivo não permite iniciar chamadas."
                );
              }
            } catch {
              Alert.alert(
                "Erro",
                "Não foi possível iniciar a ligação."
              );
            }
          },
        },
      ]
    );
  }

  /*
  ==================================================
  FILTRAGEM
  ==================================================
  */

  const locaisFiltrados =
    locais.filter((local) => {

      // HISTÓRICO POR BAIRRO

      if (
        filtroLocal === "historico"
      ) {
        return (
          local.tipo === "historico"
        );
      }

      // FILTRO PRINCIPAL

      if (
        filtroLocal !== "todos" &&
        local.tipo !== filtroLocal
      ) {
        return false;
      }

      // INDICADORES

      if (
        local.tipo === "ocorrencia"
      ) {

        if (
          filtroOcorrencia !==
            "todos" &&
          local.subtipo !==
            filtroOcorrencia
        ) {
          return false;
        }

        if (
          periodoSelecionado !==
            "todos" &&
          !local.periodo?.includes(
            periodoSelecionado
          )
        ) {
          return false;
        }
      }

      return true;
    });

  const mostrarFiltrosOcorrencia =
    filtroLocal === "ocorrencia";

  return (
    <View style={styles.container}>

      {/* =========================================
          CABEÇALHO
      ========================================= */}

      <View style={styles.cabecalho}>

        <View style={styles.informacoesCabecalho}>

          <Text style={styles.titulo}>
            SheSafe
          </Text>

          <Text style={styles.subtitulo}>
            Mapa de segurança
          </Text>

        </View>

        <Pressable
          style={styles.botaoPerfil}
          onPress={() =>
            router.push("/perfil")
          }
        >

          <Text style={styles.iconePerfil}>
            👤
          </Text>

        </Pressable>

      </View>

      {/* =========================================
          FILTROS PRINCIPAIS
      ========================================= */}

      <View style={styles.areaFiltros}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.filtros
          }
        >

          {filtrosLocais.map(
            (filtro) => {

              const selecionado =
                filtroLocal ===
                filtro.id;

              return (
                <Pressable
                  key={filtro.id}

                  onPress={() => {

                    setFiltroLocal(
                      filtro.id
                    );

                    if (
                      filtro.id !==
                      "ocorrencia"
                    ) {

                      setFiltroOcorrencia(
                        "todos"
                      );

                      setPeriodoSelecionado(
                        "todos"
                      );
                    }
                  }}

                  style={[
                    styles.botaoFiltro,

                    selecionado &&
                      styles.botaoFiltroSelecionado,
                  ]}
                >

                  <Text
                    style={[
                      styles.textoFiltro,

                      selecionado &&
                        styles.textoFiltroSelecionado,
                    ]}
                  >
                    {filtro.nome}
                  </Text>

                </Pressable>
              );
            }
          )}

        </ScrollView>

      </View>

      {/* =========================================
          FILTROS DE OCORRÊNCIA
      ========================================= */}

      {mostrarFiltrosOcorrencia && (
        <>

          <View
            style={
              styles.tituloFiltroSecundario
            }
          >

            <Text
              style={
                styles.textoTituloSecundario
              }
            >
              Tipo de ocorrência
            </Text>

          </View>

          <View
            style={
              styles.areaFiltrosSecundarios
            }
          >

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.filtrosSecundarios
              }
            >

              {filtrosOcorrencia.map(
                (filtro) => {

                  const selecionado =
                    filtroOcorrencia ===
                    filtro.id;

                  return (
                    <Pressable
                      key={filtro.id}

                      onPress={() =>
                        setFiltroOcorrencia(
                          filtro.id
                        )
                      }

                      style={[
                        styles.botaoFiltroSecundario,

                        selecionado &&
                          styles.botaoFiltroSecundarioSelecionado,
                      ]}
                    >

                      <Text
                        style={[
                          styles.textoFiltroSecundario,

                          selecionado &&
                            styles.textoFiltroSecundarioSelecionado,
                        ]}
                      >
                        {filtro.nome}
                      </Text>

                    </Pressable>
                  );
                }
              )}

            </ScrollView>

          </View>

          <View
            style={
              styles.tituloFiltroSecundario
            }
          >

            <Text
              style={
                styles.textoTituloSecundario
              }
            >
              Período
            </Text>

          </View>

          <View
            style={
              styles.areaFiltrosSecundarios
            }
          >

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.filtrosSecundarios
              }
            >

              {periodos.map(
                (periodo) => {

                  const selecionado =
                    periodoSelecionado ===
                    periodo.id;

                  return (
                    <Pressable
                      key={periodo.id}

                      onPress={() =>
                        setPeriodoSelecionado(
                          periodo.id
                        )
                      }

                      style={[
                        styles.botaoFiltroSecundario,

                        selecionado &&
                          styles.botaoFiltroSecundarioSelecionado,
                      ]}
                    >

                      <Text
                        style={[
                          styles.textoFiltroSecundario,

                          selecionado &&
                            styles.textoFiltroSecundarioSelecionado,
                        ]}
                      >
                        {periodo.nome}
                      </Text>

                    </Pressable>
                  );
                }
              )}

            </ScrollView>

          </View>

        </>
      )}

      {/* =========================================
          MAPA
      ========================================= */}

      <MapView
        ref={mapaRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={regiaoInicial}
      >

        {locaisFiltrados.map(
          (local) => (

            <Marker
              key={local.id}

              coordinate={{
                latitude:
                  local.latitude,

                longitude:
                  local.longitude,
              }}

              title={local.nome}

              description={
                local.tipo ===
                  "ocorrencia" ||
                local.tipo ===
                  "historico"
                  ? `${local.registros?.toLocaleString(
                      "pt-BR"
                    )} registros — ${local.periodo}`
                  : local.descricao
              }

              pinColor={local.cor}

              onPress={() =>
                setLocalSelecionado(
                  local
                )
              }
            />

          )
        )}

      </MapView>

      {/* =========================================
          BOTÃO MINHA LOCALIZAÇÃO
      ========================================= */}

      <Pressable
        style={
          styles.botaoLocalizacao
        }
        onPress={
          minhaLocalizacao
        }
      >

        <Text
          style={
            styles.iconeLocalizacao
          }
        >
          ⌖
        </Text>

        <Text
          style={
            styles.textoLocalizacao
          }
        >
          Minha localização
        </Text>

      </Pressable>

      {/* =========================================
          LEGENDA
      ========================================= */}

      <View style={styles.legenda}>

        <Text
          style={
            styles.legendaTitulo
          }
        >
          Legenda
        </Text>

        <View style={styles.item}>

          <View
            style={[
              styles.ponto,
              {
                backgroundColor:
                  "#2196F3",
              },
            ]}
          />

          <Text>
            Delegacia / DEAM
          </Text>

        </View>

        <View style={styles.item}>

          <View
            style={[
              styles.ponto,
              {
                backgroundColor:
                  "#FF9800",
              },
            ]}
          />

          <Text>
            Hospital
          </Text>

        </View>

        <View style={styles.item}>

          <View
            style={[
              styles.ponto,
              {
                backgroundColor:
                  "#9C27B0",
              },
            ]}
          />

          <Text>
            Apoio à mulher
          </Text>

        </View>

        <View style={styles.item}>

          <View
            style={[
              styles.ponto,
              {
                backgroundColor:
                  "#E91E63",
              },
            ]}
          />

          <Text>
            Indicador
          </Text>

        </View>

        <View style={styles.item}>

          <View
            style={[
              styles.ponto,
              {
                backgroundColor:
                  "#C62828",
              },
            ]}
          />

          <Text>
            Histórico por bairro
          </Text>

        </View>

      </View>

      {/* =========================================
          MODAL DE DETALHES
      ========================================= */}

      <Modal
        visible={
          localSelecionado !== null
        }
        transparent={true}
        animationType="slide"
        onRequestClose={() =>
          setLocalSelecionado(
            null
          )
        }
      >

        <View
          style={
            styles.modalFundo
          }
        >

          <View
            style={
              styles.modalCard
            }
          >

            {localSelecionado && (
              <>

                {/* INDICADOR */}

                <View
                  style={[
                    styles.indicadorTipo,
                    {
                      backgroundColor:
                        localSelecionado.cor,
                    },
                  ]}
                />

                {/* TIPO */}

                <Text
                  style={
                    styles.modalTipo
                  }
                >
                  {nomeTipo(
                    localSelecionado.tipo
                  )}
                </Text>

                {/* SUBTIPO */}

                {localSelecionado.tipo ===
                  "ocorrencia" && (

                  <Text
                    style={
                      styles.modalOcorrencia
                    }
                  >
                    {nomeOcorrencia(
                      localSelecionado.subtipo
                    )}
                  </Text>

                )}

                {/* NOME */}

                <Text
                  style={
                    styles.modalTitulo
                  }
                >
                  {localSelecionado.nome}
                </Text>

                {/* DESCRIÇÃO */}

                <Text
                  style={
                    styles.modalEndereco
                  }
                >
                  {localSelecionado.descricao}
                </Text>

                <View
                  style={
                    styles.linhaSeparadora
                  }
                />

                {/* INDICADOR OU HISTÓRICO */}

                {(localSelecionado.tipo ===
                  "ocorrencia" ||
                  localSelecionado.tipo ===
                    "historico") && (

                  <>

                    <Text
                      style={
                        styles.modalInfoTitulo
                      }
                    >
                      Registros
                    </Text>

                    <Text
                      style={
                        styles.numeroRegistros
                      }
                    >
                      {localSelecionado.registros?.toLocaleString(
                        "pt-BR"
                      )}
                    </Text>

                    <Text
                      style={
                        styles.modalInfoTitulo
                      }
                    >
                      Período
                    </Text>

                    <Text
                      style={
                        styles.modalInfo
                      }
                    >
                      {localSelecionado.periodo}
                    </Text>

                    <Text
                      style={[
                        styles.modalInfoTitulo,
                        {
                          marginTop: 12,
                        },
                      ]}
                    >
                      Fonte
                    </Text>

                    <Text
                      style={
                        styles.modalInfo
                      }
                    >
                      {localSelecionado.fonte}
                    </Text>

                    <View
                      style={
                        styles.avisoDados
                      }
                    >

                      <Text
                        style={
                          styles.textoAvisoDados
                        }
                      >
                        ⚠ Este dado é agregado
                        por município ou bairro
                        e não representa o endereço
                        de uma ocorrência específica.
                      </Text>

                    </View>

                  </>

                )}

                {/* LOCAIS DE APOIO */}

                {localSelecionado.tipo !==
                  "ocorrencia" &&
                  localSelecionado.tipo !==
                    "historico" && (

                  <>

                    <Text
                      style={
                        styles.modalInfoTitulo
                      }
                    >
                      Localização
                    </Text>

                    <Text
                      style={
                        styles.modalInfo
                      }
                    >
                      Latitude:{" "}
                      {localSelecionado.latitude.toFixed(
                        5
                      )}
                    </Text>

                    <Text
                      style={
                        styles.modalInfo
                      }
                    >
                      Longitude:{" "}
                      {localSelecionado.longitude.toFixed(
                        5
                      )}
                    </Text>

                  </>

                )}

                {/* COMO CHEGAR */}

                <Pressable
                  style={
                    styles.botaoComoChegar
                  }
                  onPress={() =>
                    comoChegar(
                      localSelecionado
                    )
                  }
                >

                  <Text
                    style={
                      styles.textoComoChegar
                    }
                  >
                    Como chegar
                  </Text>

                </Pressable>

                {/* 190 */}

                <Pressable
                  style={
                    styles.botaoEmergencia
                  }
                  onPress={() =>
                    ligar("190")
                  }
                >

                  <Text
                    style={
                      styles.textoEmergencia
                    }
                  >
                    ☎ Ligar 190
                  </Text>

                </Pressable>

                {/* 180 */}

                <Pressable
                  style={
                    styles.botaoMulher
                  }
                  onPress={() =>
                    ligar("180")
                  }
                >

                  <Text
                    style={
                      styles.textoMulher
                    }
                  >
                    ☎ Ligue 180
                  </Text>

                </Pressable>

                {/* FECHAR */}

                <Pressable
                  style={
                    styles.botaoFechar
                  }
                  onPress={() =>
                    setLocalSelecionado(
                      null
                    )
                  }
                >

                  <Text
                    style={
                      styles.textoFechar
                    }
                  >
                    Fechar
                  </Text>

                </Pressable>

                {/* AVISO */}

                <Text
                  style={
                    styles.aviso
                  }
                >
                  O SheSafe não substitui
                  os serviços oficiais de
                  emergência.
                </Text>

              </>
            )}

          </View>

        </View>

      </Modal>

    </View>
  );
}

/*
======================================================
ESTILOS
======================================================
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  cabecalho: {
    backgroundColor: "#6A1B9A",

    paddingTop: 18,
    paddingBottom: 14,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
  },

  informacoesCabecalho: {
    flex: 1,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },

  subtitulo: {
    color: "#FFFFFF",
    fontSize: 15,
    marginTop: 3,
  },

  botaoPerfil: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EC407A",

    justifyContent: "center",
    alignItems: "center",
  },

  iconePerfil: {
    fontSize: 22,
  },

  areaFiltros: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
  },

  filtros: {
    paddingHorizontal: 10,
    gap: 8,
  },

  botaoFiltro: {
    paddingVertical: 9,
    paddingHorizontal: 14,

    borderRadius: 20,

    backgroundColor: "#F2F2F2",

    borderWidth: 1,

    borderColor: "#DDDDDD",
  },

  botaoFiltroSelecionado: {
    backgroundColor: "#6A1B9A",
    borderColor: "#6A1B9A",
  },

  textoFiltro: {
    color: "#555555",
    fontSize: 14,
    fontWeight: "600",
  },

  textoFiltroSelecionado: {
    color: "#FFFFFF",
  },

  tituloFiltroSecundario: {
    backgroundColor: "#FFFFFF",

    paddingHorizontal: 12,

    paddingTop: 6,

    paddingBottom: 2,
  },

  textoTituloSecundario: {
    fontSize: 12,

    fontWeight: "bold",

    color: "#666666",
  },

  areaFiltrosSecundarios: {
    backgroundColor: "#FFFFFF",

    paddingVertical: 7,
  },

  filtrosSecundarios: {
    paddingHorizontal: 10,

    gap: 7,
  },

  botaoFiltroSecundario: {
    paddingVertical: 7,

    paddingHorizontal: 12,

    borderRadius: 18,

    backgroundColor: "#F7F7F7",

    borderWidth: 1,

    borderColor: "#DDDDDD",
  },

  botaoFiltroSecundarioSelecionado: {
    backgroundColor: "#EC407A",

    borderColor: "#EC407A",
  },

  textoFiltroSecundario: {
    color: "#555555",

    fontSize: 13,

    fontWeight: "600",
  },

  textoFiltroSecundarioSelecionado: {
    color: "#FFFFFF",
  },

  map: {
    flex: 1,
  },

  botaoLocalizacao: {
    position: "absolute",

    right: 16,

    bottom: 125,

    backgroundColor: "#FFFFFF",

    flexDirection: "row",

    alignItems: "center",

    paddingVertical: 11,

    paddingHorizontal: 14,

    borderRadius: 25,

    elevation: 5,

    shadowColor: "#000000",

    shadowOpacity: 0.2,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,

      height: 2,
    },
  },

  iconeLocalizacao: {
    fontSize: 21,

    color: "#6A1B9A",

    marginRight: 7,
  },

  textoLocalizacao: {
    fontSize: 14,

    color: "#6A1B9A",

    fontWeight: "bold",
  },

  legenda: {
    position: "absolute",

    bottom: 15,

    left: 15,

    backgroundColor: "#FFFFFF",

    borderRadius: 12,

    padding: 12,

    elevation: 5,

    shadowColor: "#000000",

    shadowOpacity: 0.2,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,

      height: 2,
    },
  },

  legendaTitulo: {
    fontSize: 16,

    fontWeight: "bold",

    marginBottom: 8,
  },

  item: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 6,
  },

  ponto: {
    width: 12,

    height: 12,

    borderRadius: 6,

    marginRight: 8,
  },

  modalFundo: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor:
      "rgba(0, 0, 0, 0.35)",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 24,

    borderTopRightRadius: 24,

    padding: 22,

    paddingBottom: 25,

    maxHeight: "90%",
  },

  indicadorTipo: {
    width: 45,

    height: 5,

    borderRadius: 5,

    alignSelf: "center",

    marginBottom: 16,
  },

  modalTipo: {
    fontSize: 14,

    fontWeight: "bold",

    color: "#6A1B9A",

    marginBottom: 4,
  },

  modalOcorrencia: {
    fontSize: 13,

    fontWeight: "bold",

    color: "#D81B60",

    marginBottom: 6,
  },

  modalTitulo: {
    fontSize: 22,

    fontWeight: "bold",

    color: "#222222",

    marginBottom: 8,
  },

  modalEndereco: {
    fontSize: 16,

    color: "#555555",

    lineHeight: 22,
  },

  linhaSeparadora: {
    height: 1,

    backgroundColor: "#E5E5E5",

    marginVertical: 18,
  },

  modalInfoTitulo: {
    fontSize: 15,

    fontWeight: "bold",

    marginBottom: 5,

    color: "#333333",
  },

  modalInfo: {
    fontSize: 13,

    color: "#777777",

    marginBottom: 2,
  },

  numeroRegistros: {
    fontSize: 30,

    fontWeight: "bold",

    color: "#6A1B9A",

    marginBottom: 15,
  },

  avisoDados: {
    backgroundColor: "#FFF3E0",

    borderRadius: 10,

    padding: 10,

    marginTop: 15,
  },

  textoAvisoDados: {
    fontSize: 12,

    lineHeight: 17,

    color: "#795548",
  },

  botaoComoChegar: {
    backgroundColor: "#6A1B9A",

    borderRadius: 12,

    paddingVertical: 14,

    alignItems: "center",

    marginTop: 20,
  },

  textoComoChegar: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "bold",
  },

  botaoEmergencia: {
    backgroundColor: "#C62828",

    borderRadius: 12,

    paddingVertical: 14,

    alignItems: "center",

    marginTop: 10,
  },

  textoEmergencia: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "bold",
  },

  botaoMulher: {
    backgroundColor: "#EC407A",

    borderRadius: 12,

    paddingVertical: 14,

    alignItems: "center",

    marginTop: 10,
  },

  textoMulher: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "bold",
  },

  botaoFechar: {
    paddingVertical: 13,

    alignItems: "center",

    marginTop: 5,
  },

  textoFechar: {
    color: "#6A1B9A",

    fontSize: 15,

    fontWeight: "bold",
  },

  aviso: {
    textAlign: "center",

    fontSize: 11,

    color: "#888888",

    marginTop: 8,
  },
});