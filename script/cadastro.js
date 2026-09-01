const api = 'http://localhost:3000';

const nome = document.querySelector('#nome_prof');
const senha = document.querySelector('#senha_prof');
const confirmar = document.querySelector('#confirmar_senha');
const botao = document.querySelector('#cadastrar');

botao.addEventListener('click', async () => {
  const nome_prof = nome.value.trim();
  const senha_prof = senha.value.trim();
  const confirmarSenha = confirmar.value.trim();

  if (!nome_prof || !senha_prof || !confirmarSenha) {
    return alert('Preencha todos os campos.');
  }

  if (senha_prof !== confirmarSenha) {
    return alert('As senhas precisam ser iguais.');
  }

  const resposta = await fetch(`${api}/professor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome_prof, senha_prof })
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    return alert(erro.error || 'Erro ao cadastrar professor.');
  }

  alert('Cadastro realizado com sucesso!');
  window.location.href = './login.html';
});
