import * as SecureStore from "expo-secure-store";

const CONTATOS_KEY = "shesafe_contatos";

export type Contato = {
  id: string;
  nome: string;
  telefone: string;
};

/**
 * Busca todos os contatos salvos no dispositivo.
 */
export async function obterContatos(): Promise<Contato[]> {
  try {
    const dados = await SecureStore.getItemAsync(
      CONTATOS_KEY
    );

    if (!dados) {
      return [];
    }

    const contatos = JSON.parse(dados);

    if (!Array.isArray(contatos)) {
      return [];
    }

    return contatos;
  } catch (erro) {
    console.log(
      "Erro ao obter contatos:",
      erro
    );

    return [];
  }
}

/**
 * Salva a lista de contatos no dispositivo.
 */
export async function salvarContatos(
  contatos: Contato[]
): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      CONTATOS_KEY,
      JSON.stringify(contatos)
    );
  } catch (erro) {
    console.log(
      "Erro ao salvar contatos:",
      erro
    );

    throw erro;
  }
}

/**
 * Adiciona um novo contato.
 */
export async function adicionarContato(
  contato: Contato
): Promise<void> {
  try {
    const contatos = await obterContatos();

    // Limite de 5 contatos
    if (contatos.length >= 5) {
      throw new Error(
        "Limite de 5 contatos atingido."
      );
    }

    contatos.push(contato);

    await salvarContatos(contatos);
  } catch (erro) {
    console.log(
      "Erro ao adicionar contato:",
      erro
    );

    throw erro;
  }
}

/**
 * Exclui um contato pelo ID.
 */
export async function excluirContato(
  id: string
): Promise<void> {
  try {
    const contatos = await obterContatos();

    const contatosAtualizados =
      contatos.filter(
        (contato) => contato.id !== id
      );

    await salvarContatos(
      contatosAtualizados
    );
  } catch (erro) {
    console.log(
      "Erro ao excluir contato:",
      erro
    );

    throw erro;
  }
}

/**
 * Exclui todos os contatos.
 */
export async function excluirTodosContatos(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(
      CONTATOS_KEY
    );
  } catch (erro) {
    console.log(
      "Erro ao excluir todos os contatos:",
      erro
    );

    throw erro;
  }
}