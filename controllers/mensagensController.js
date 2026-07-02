import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// GET /mensagens — lista todas as mensagens (mais recentes primeiro, com dados do autor)
export async function listarMensagens(req, res) {
  const mensagens = await prisma.mensagem.findMany({
    orderBy: { criadoEm: 'desc' },  // mais recente primeiro
    include: {
      autor: {                        // traz dados do autor junto
        select: {
          nome: true,                 // nome do autor
          fotoUrl: true,              // foto do autor
        },
      },
    },
  });
  res.json(mensagens); // retorna a lista com autor embutido
}

// 🎯 POST /mensagens — cria uma nova mensagem
export async function criarMensagem(req, res) {
  try {
    // 1. Extraia texto, imagemUrl e autorId de req.body
    const { texto, imagemUrl, autorId } = req.body;

    // 2. Valide: se texto não existir, retorne 400
    if (!texto || texto.trim() === '') {
      return res.status(400).json({ erro: 'O texto da mensagem é obrigatório.' });
    }

    // 3. Crie com prisma.mensagem.create()
    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,                 // Adicionado para salvar a imagem!
        autorId: Number(autorId),  // Convertendo para número conforme o aviso do professor!
      },
    });

    // 4. Retorne 201 com a mensagem criada
    res.status(201).json(novaMensagem);
    
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno ao tentar criar a mensagem.' });
  }
}

// 🎯 DELETE /mensagens/:id — deleta uma mensagem
export async function deletarMensagem(req, res) {
  try {
    const { id } = req.params; // Pega o ID da URL

    // Tenta deletar no banco
    await prisma.mensagem.delete({
      where: { id: Number(id) }, // Converte para número, igual fizemos no autorId
    });

    // Se der certo, retorna 204 (No Content - sem body)
    res.status(204).send();
    
  } catch (erro) {
    // Código 'P2025' é o erro padrão do Prisma quando o registro não existe
    if (erro.code === 'P2025') {
      return res.status(404).json({ erro: 'Mensagem não encontrada.' });
    }
    
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno ao tentar deletar a mensagem.' });
  }
}