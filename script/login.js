const api = "http://localhost:3000";

document.querySelector("#entrar").addEventListener("click", async () => {
  const nome_prof = document.querySelector("#nome_prof").value;
  const senha_prof = document.querySelector("#senha_prof").value;

  const resposta = await fetch(`${api}/professor/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nome_prof, senha_prof }),
  });

  if (!resposta.ok) {
    alert("Nome ou senha incorretos");
    return;
  }

  const professor = await resposta.json();
  localStorage.setItem("professor", JSON.stringify(professor));
  window.location.href = "./home.html";
});