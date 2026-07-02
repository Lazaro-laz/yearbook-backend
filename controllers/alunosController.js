import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// GET /alunos — lista todos os alunos
export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany();
  res.json(alunos); // responde com o array de alunos em JSON
}

// GET /alunos/:id — busca um aluno pelo ID
export async function buscarAluno(req, res) {
  const { id } = req.params; // extrai o :id da URL
  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) } // converte string → number
  });

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' }); // null → 404
  }

  res.json(aluno); // retorna o aluno encontrado
}

// 🎯 POST /alunos — cria um novo aluno
export async function criarAluno(req, res) {
  const { nome, email, fotoUrl, role } = req.body;
  
  const aluno = await prisma.aluno.create({
    data: {
      nome,
      email,
      fotoUrl,
      role
    }
  });
  res.status(201).json(aluno);
}

// 🎯 PUT /alunos/:id — atualiza um aluno existente
export async function atualizarAluno(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, fotoUrl, role } = req.body;
    
    const alunoAtualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        fotoUrl,
        role
      }
    });
    
    return res.json(alunoAtualizado);
    
  } catch (erro) {
    if (erro.code === 'P2025') {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}

// 🎯 DELETE /alunos/:id — deleta um aluno
export async function deletarAluno(req, res) {
  try {
    const { id } = req.params;
    await prisma.aluno.delete({ 
      where: { id: Number(id) } 
    });

    return res.status(204).end();
    
  } catch (erro) {
    if (erro.code === 'P2025') {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    console.error("Erro desconhecido ao deletar:", erro);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}