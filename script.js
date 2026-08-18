const nome_prod = document.querySelector("#nome_prod");
const codigo = document.querySelector("#codigo");
const preco = document.querySelector("#preco");
const quantidade = document.querySelector("#quantidade");
const cor = document.querySelector("#cor");
const capac = document.querySelector("#capac");
const espec = document.querySelector("#espec");
const quantidade_min = document.querySelector("#quantidade_min");
const id_fabric = document.querySelector("#id_fabric");
const corpo = document.querySelector("tbody");
const api = "http://localhost:3000";
const form = document.querySelector("form");
const logout = document.querySelector("#logout");
let prods = [];
window.addEventListener("load", async () => {
  const resposta = await fetch(`${api}/produtos`);
  prods = await resposta.json();
  console.log(prods)
  prods.forEach((prod)=>{
      id_fabric.innerHTML += `
      <option value="${prod.id_fab}">${prod.nome_fab}</option>
      `;
  })
  renderizar(prods);
});

function renderizar(prods) {
  prods.forEach((element) => {
    corpo.innerHTML += `     <tr>
                <td>${element.id_prod}</td>
                <td>${element.nome_prod}</td>
                <td>${element.codigo}</td>
                <td>${element.preco}</td>
                <td>${element.quantidade}</td>
                <td>${element.cor}</td>
                <td>${element.capac}</td>
                <td>${element.espec}</td>
                <td>${element.quantidade_min}</td>
                <td>
                <button onclick="deletar(${element.id_prod})">🗑️</button>
                <button onclick='editar(${element.id_prod})'>✏️</button>
                </td>
            </tr>`;
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dados = {
    nome_prod: nome_prod.value,
    codigo: codigo.value,
    preco: preco.value,
    quantidade: quantidade.value,
    cor: cor.value,
    capac: capac.value,
    espec: espec.value,
    quantidade_min: quantidade_min.value,
    id_fabric: id_fabric.value,
  };
  const resposta = await fetch(`${api}/cad_produto`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dados),
  });
  if (resposta.status == 201) {
    alert("cadastrado com sucesso");
    window.location.reload();
  }
});



async function deletar(id) {
  const resposta = await fetch(`http://localhost:3000/deleta/${id}`, {
    method: "DELETE",
  });
  if (resposta.status == 200) {
    return window.location.reload();
  }
  return alert("erro ao deletar");
}

async function editar(id) {
  const produto = await fetch(`${api}/produto/${id}`);
  const prod = await produto.json();
  const datas = {
    nome_prod: prompt("Nome do produto", prod.nome_prod),
    codigo: prompt("codigo", prod.codigo),
    preco: prompt("preco", prod.preco),
    quantidade: prompt("quantidade", prod.quantidade),
    cor: prompt("cor", prod.cor),
    capac: prompt("capacidade", prod.capac),
    espec: prompt("especifações", prod.espec),
    quantidade_min: prompt("quantidade minima", prod.quantidade_min),
  };
  const resposta = await fetch(`${api}/editar/${id}`, {
    method: "put",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(datas),
  });
  resposta.status == 201 ? window.location.reload() : alert("erro ao editar");
} 

logout.addEventListener("click", logoutUser);

async function logoutUser() {
  localStorage.removeItem("nome");
  const resposta = await fetch(`${api}/logout`, {
    method: "POST",
    headers: { "content-type": "application/json" },
  });
  if (resposta.status == 200) {
    alert("Logout realizado com sucesso");
  } else {
    alert("Logout realizado");
  }
  window.location.href = "./login.html";
}