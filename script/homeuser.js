const api = "http://localhost:3000";
const aluno = JSON.parse(localStorage.getItem("aluno") || "null");

if (!aluno || !aluno.aluno_id) window.location.href = "./loginuser.html";

const titulo = document.querySelector("#titulo");
const listaTreinos = document.querySelector("#listaTreinos");
const logoutButton = document.querySelector("#logout");

titulo.textContent = `Olá, ${aluno.nome_alu || "aluno"}`;

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("aluno");
  window.location.href = "./loginuser.html";
});

async function carregarTreinos() {
  try {
    const resposta = await fetch(`${api}/treinos?aluno_id=${aluno.aluno_id}`);
    if (!resposta.ok) throw new Error("Erro ao buscar treinos");

    const treinosBanco = await resposta.json();
    const treinosLocais = JSON.parse(localStorage.getItem("professorTreinos") || "[]")
      .filter((treino) => Number(treino.alunoId) === Number(aluno.aluno_id))
      .map((treino) => ({
        treino_id: treino.treino_id || treino.id,
        local: !treino.treino_id,
        nome_trei: treino.nome_trei || treino.nome,
        tipo_trei: treino.tipo_trei || treino.tipo,
        data_trei: treino.data_trei || treino.data,
        observ_trei: treino.observ_trei || treino.observacao,
        finalizado: treino.finalizado || false,
      }));

    const idsDoBanco = new Set(treinosBanco.map((treino) => String(treino.treino_id)));
    const treinos = [
      ...treinosBanco,
      ...treinosLocais.filter((treino) => !idsDoBanco.has(String(treino.treino_id))),
    ];

    if (!treinos.length) {
      listaTreinos.innerHTML = '<p class="empty">Nenhum treino cadastrado para você.</p>';
      return;
    }

    listaTreinos.innerHTML = treinos
      .map(
        (treino) => `
          <article class="treino ${treino.finalizado ? "finalizado" : ""}">
            <h3>${treino.nome_trei || "Treino"}</h3>
            <p><strong>Tipo:</strong> ${treino.tipo_trei || "-"}</p>
            <p><strong>Data:</strong> ${treino.data_trei ? new Date(treino.data_trei).toLocaleDateString("pt-BR") : "-"}</p>
            <p><strong>Observações:</strong> ${treino.observ_trei || "Sem observações"}</p>
            <button class="finalizar-btn" type="button" data-id="${treino.treino_id}">
              ${treino.finalizado ? "Finalizado" : "Marcar como finalizado"}
            </button>
          </article>
        `
      )
      .join("");

    document.querySelectorAll(".finalizar-btn").forEach((botao) => {
      botao.addEventListener("click", async () => {
        const treinoId = Number(botao.dataset.id);
        const treinoAtual = treinos.find((item) => item.treino_id === treinoId);

        if (!treinoAtual) return;

        try {
          const treinoDoBanco =
            !treinoAtual.local && Number.isInteger(treinoId) && treinoId <= 2147483647;

          if (treinoDoBanco) {
            const resposta = await fetch(`${api}/treino/${treinoId}/finalizar`, {
              method: "PATCH",
            });

            if (!resposta.ok) throw new Error("Erro ao finalizar treino");
          }

          treinoAtual.finalizado = true;
          const treinosLocais = JSON.parse(localStorage.getItem("professorTreinos") || "[]");
          const treinoLocal = treinosLocais.find(
            (item) => String(item.id) === String(treinoId)
          );
          if (treinoLocal) {
            treinoLocal.finalizado = true;
            localStorage.setItem("professorTreinos", JSON.stringify(treinosLocais));
          }
          botao.textContent = "Finalizado";
          botao.disabled = true;
          botao.closest(".treino").classList.add("finalizado");
          alert("Treino marcado como finalizado!");
        } catch {
          alert("Não foi possível finalizar o treino.");
        }
      });
    });
  } catch {
    listaTreinos.innerHTML = '<p class="empty">Não foi possível carregar os treinos.</p>';
  }
}

carregarTreinos();
