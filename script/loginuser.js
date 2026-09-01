const api = "http://localhost:3000";

document.querySelector("form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome_alu = document.querySelector("#nome_alu").value;
  const senha_alu = document.querySelector("#senha_alu").value;

  try {
    const resposta = await fetch(`${api}/aluno/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome_alu, senha_alu }),
    });

    if (!resposta.ok) {
      alert("Nome ou senha incorretos");
      return;
    }

    const aluno = await resposta.json();
    localStorage.setItem("aluno", JSON.stringify(aluno));
    window.location.href = "./homeuser.html";
  } catch (error) {
    alert("Não foi possível conectar ao servidor");
  }
});