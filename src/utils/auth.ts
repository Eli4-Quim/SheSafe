import * as SecureStore from "expo-secure-store";

const USUARIO_KEY = "shesafe_usuario";
const SESSAO_KEY = "shesafe_sessao";

export type Usuario = {
  nome: string;
  email: string;
  senha: string;
};

export async function salvarUsuario(usuario: Usuario) {
  await SecureStore.setItemAsync(
    USUARIO_KEY,
    JSON.stringify(usuario)
  );
}

export async function obterUsuario(): Promise<Usuario | null> {
  const dados = await SecureStore.getItemAsync(USUARIO_KEY);

  if (!dados) return null;

  try {
    return JSON.parse(dados);
  } catch {
    return null;
  }
}

export async function criarSessao() {
  await SecureStore.setItemAsync(SESSAO_KEY, "true");
}

export async function encerrarSessao() {
  await SecureStore.deleteItemAsync(SESSAO_KEY);
}

export async function usuarioEstaLogado() {
  const sessao = await SecureStore.getItemAsync(SESSAO_KEY);
  return sessao === "true";
}