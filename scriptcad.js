const api = "http://localhost:3000";
document.querySelector("#enviar").addEventListener("click", async () => {
  const senha = document.querySelector("#senha").value;
  const nova = document.querySelector("#Csenha").value;
  if (nova != senha || senha == "" || nova == "") {
    alert("as senhas precisam ser iguais");
  } else {
    const datas = {
      user: document.querySelector("#nome").value,
      password: document.querySelector("#senha").value,
    };
    const resposta = await fetch(`${api}/cadastro`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(datas),
    });
    if (resposta.status != 201) {
     return alert("usuário ou senha incorretos");
    }
    window.location.href = "./login.html";
  }
});
