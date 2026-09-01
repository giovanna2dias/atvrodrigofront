const api = "http://localhost:3000";
const professor = JSON.parse(localStorage.getItem("professor"));

if (!professor) {
  window.location.href = "./login.html";
}

const storageTreinos = "professorTreinos";

const formAluno = document.querySelector("#formAluno");
const formTreino = document.querySelector("#formTreino");
const listaAlunos = document.querySelector("#listaAlunos");
const listaTreinos = document.querySelector("#listaTreinos");
const treinoAlunoSelect = document.querySelector("#treinoAluno");
const addExercicioButton = document.querySelector("#addExercicio");
const exerciciosTreino = document.querySelector("#exerciciosTreino");
const logoutButton = document.querySelector("#logout");
const tabButtons = document.querySelectorAll(".tab-button");
const listaNomesTreino = document.querySelector("#listaNomesTreino");
const listaTiposTreino = document.querySelector("#listaTiposTreino");
const listaObservacoesTreino = document.querySelector("#listaObservacoesTreino");
const listaExercicios = document.querySelector("#listaExercicios");
const listaSeries = document.querySelector("#listaSeries");
const listaObservacoesExercicio = document.querySelector("#listaObservacoesExercicio");

function getTreinos() {
  return JSON.parse(localStorage.getItem(storageTreinos) || "[]");
}

function saveTreinos(treinos) {
  localStorage.setItem(storageTreinos, JSON.stringify(treinos));
}

async function carregarAlunos() {
  try {
    const resposta = await fetch(`${api}/alunos?prof_id=${professor.prof_id}`);

    if (!resposta.ok) {
      throw new Error("Erro ao buscar alunos");
    }

    const alunos = await resposta.json();

    const options = alunos
      .map((aluno) => `<option value="${aluno.aluno_id}">${aluno.nome_alu}</option>`)
      .join("");

    treinoAlunoSelect.innerHTML = `
      <option value="">Selecione o aluno</option>
      ${options}
    `;

    if (!alunos.length) {
      listaAlunos.innerHTML =
        '<p class="empty-state">Nenhum aluno cadastrado ainda.</p>';
      return;
    }

    listaAlunos.innerHTML = alunos
      .map(
        (aluno) => `
          <div class="item-card">
            <h3>${aluno.nome_alu}</h3>
            <p><strong>Telefone:</strong> ${aluno.tele_alu || "Não informado"}</p>
          </div>
        `
      )
      .join("");
  } catch (error) {
    listaAlunos.innerHTML =
      '<p class="empty-state">Não foi possível carregar os alunos do banco.</p>';
    treinoAlunoSelect.innerHTML = '<option value="">Selecione o aluno</option>';
  }
}

async function carregarOpcoesTreino() {
  try {
    const [treinosResposta, exerciciosResposta] = await Promise.all([
      fetch(`${api}/treinos?prof_id=${professor.prof_id}`),
      fetch(`${api}/exercicios`),
    ]);

    if (!treinosResposta.ok || !exerciciosResposta.ok) {
      throw new Error("Erro ao buscar opções de treino");
    }

    const treinos = await treinosResposta.json();
    const exercicios = await exerciciosResposta.json();

    const nomesTreino = [...new Set(treinos.map((treino) => treino.nome_trei).filter(Boolean))];
    const tiposTreino = [...new Set(treinos.map((treino) => treino.tipo_trei).filter(Boolean))];
    const observacoesTreino = [...new Set(treinos.map((treino) => treino.observ_trei).filter(Boolean))];
    const nomesExercicios = [...new Set(exercicios.map((exercicio) => exercicio.nome_exer).filter(Boolean))];
    const seriesExercicios = [...new Set(exercicios.map((exercicio) => exercicio.serie_exer).filter(Boolean))];
    const observacoesExercicio = [...new Set(exercicios.map((exercicio) => exercicio.observ_exer).filter(Boolean))];

    listaNomesTreino.innerHTML = nomesTreino.map((valor) => `<option value="${valor}"></option>`).join("");
    listaTiposTreino.innerHTML = tiposTreino.map((valor) => `<option value="${valor}"></option>`).join("");
    listaObservacoesTreino.innerHTML = observacoesTreino.map((valor) => `<option value="${valor}"></option>`).join("");
    listaExercicios.innerHTML = nomesExercicios.map((valor) => `<option value="${valor}"></option>`).join("");
    listaSeries.innerHTML = seriesExercicios.map((valor) => `<option value="${valor}"></option>`).join("");
    listaObservacoesExercicio.innerHTML = observacoesExercicio.map((valor) => `<option value="${valor}"></option>`).join("");
  } catch (error) {
    listaNomesTreino.innerHTML = "";
    listaTiposTreino.innerHTML = "";
    listaObservacoesTreino.innerHTML = "";
    listaExercicios.innerHTML = "";
    listaSeries.innerHTML = "";
    listaObservacoesExercicio.innerHTML = "";
  }
}

function renderTreinos() {
  const treinos = getTreinos();

  if (!treinos.length) {
    listaTreinos.innerHTML =
      '<p class="empty-state">Nenhum treino cadastrado ainda.</p>';
    return;
  }

  listaTreinos.innerHTML = treinos
    .map(
      (treino) => {
        const exercicios = treino.exercicios
          .map(
            (exercicio) => `
              <li>
                <strong>${exercicio.nome}</strong> — ${exercicio.series} séries,
                ${exercicio.repeticoes} repetições,
                ${exercicio.carga || "carga não informada"}
                ${exercicio.observacao ? `- ${exercicio.observacao}` : ""}
              </li>
            `
          )
          .join("");

        return `
          <div class="item-card">
            <h3>${treino.nome}</h3>
            <p><strong>Aluno ID:</strong> ${treino.alunoId}</p>
            <p><strong>Tipo:</strong> ${treino.tipo}</p>
            <p><strong>Data:</strong> ${treino.data}</p>
            <p><strong>Observações:</strong> ${treino.observacao || "Nenhuma"}</p>
            <ul>${exercicios}</ul>
          </div>
        `;
      }
    )
    .join("");
}

function buildExerciseRow() {
  const row = document.createElement("div");
  row.className = "exercise-row";
  row.innerHTML = `
    <button type="button" class="remove-exercise" aria-label="Remover exercício">Remover</button>
    <div class="exercise-grid">
      <label>
        Exercício
        <input type="text" name="nomeExercicio" list="listaExercicios" placeholder="Ex: Supino" required />
      </label>
      <label>
        Séries
        <input type="text" name="seriesExercicio" list="listaSeries" placeholder="Ex: 4" required />
      </label>
      <label>
        Repetições
        <input type="text" name="repeticoesExercicio" placeholder="Ex: 10" required />
      </label>
      <label>
        Carga
        <input type="text" name="cargaExercicio" placeholder="Ex: 20kg" />
      </label>
    </div>
    <label>
      Observação do exercício
      <input type="text" name="obsExercicio" list="listaObservacoesExercicio" placeholder="Ex: lento e controlado" />
    </label>
  `;

  row.querySelector(".remove-exercise").addEventListener("click", () => {
    row.remove();
  });

  return row;
}

function adicionarLinhaExercicio() {
  exerciciosTreino.appendChild(buildExerciseRow());
}

formAluno.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.querySelector("#nomeAluno").value.trim();
  const senha = document.querySelector("#senhaAluno").value.trim();
  const telefone = document.querySelector("#telefoneAluno").value.trim();

  if (!nome || !senha) {
    alert("Informe o nome e a senha do aluno.");
    return;
  }

  try {
    const resposta = await fetch(`${api}/aluno`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome_alu: nome,
        senha_alu: senha,
        tele_alu: telefone,
        prof_id: professor.prof_id,
      }),
    });

    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar aluno");
    }

    formAluno.reset();
    await carregarAlunos();
    alert("Aluno cadastrado com sucesso!");
  } catch (error) {
    alert("Não foi possível cadastrar o aluno.");
  }
});

formTreino.addEventListener("submit", (event) => {
  event.preventDefault();

  const alunoId = Number(treinoAlunoSelect.value);
  const nome = document.querySelector("#nomeTreino").value.trim();
  const tipo = document.querySelector("#tipoTreino").value.trim();
  const data = document.querySelector("#dataTreino").value;
  const observacao = document.querySelector("#observacaoTreino").value.trim();

  if (!alunoId || !nome || !tipo || !data) {
    alert("Preencha todos os campos do treino.");
    return;
  }

  const rows = [...document.querySelectorAll(".exercise-row")];
  const exercicios = rows
    .map((row) => {
      const nomeExercicio = row.querySelector('[name="nomeExercicio"]').value.trim();
      const series = row.querySelector('[name="seriesExercicio"]').value.trim();
      const repeticoes = row.querySelector('[name="repeticoesExercicio"]').value.trim();
      const carga = row.querySelector('[name="cargaExercicio"]').value.trim();
      const obsExercicio = row.querySelector('[name="obsExercicio"]').value.trim();

      if (!nomeExercicio || !series || !repeticoes) {
        return null;
      }

      return {
        nome: nomeExercicio,
        series,
        repeticoes,
        carga: carga || "Não informado",
        observacao: obsExercicio || "",
      };
    })
    .filter(Boolean);

  if (!exercicios.length) {
    alert("Adicione pelo menos um exercício ao treino.");
    return;
  }

  const treinos = getTreinos();
  treinos.push({
    id: Date.now(),
    alunoId,
    nome,
    tipo,
    data,
    observacao,
    exercicios,
  });

  saveTreinos(treinos);
  formTreino.reset();
  exerciciosTreino.innerHTML = "";
  adicionarLinhaExercicio();
  renderTreinos();
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("professor");
  window.location.href = "./login.html";
});

for (const button of tabButtons) {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    document.querySelectorAll(".tab-button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.id === `${target}Tab`);
    });
  });
}

addExercicioButton.addEventListener("click", adicionarLinhaExercicio);

async function inicializar() {
  document.querySelector("#dataTreino").valueAsDate = new Date();
  adicionarLinhaExercicio();
  await Promise.all([carregarAlunos(), carregarOpcoesTreino()]);
  renderTreinos();
}

inicializar();
