let web3;
let ValAdemic;
let instancia;

document.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Metamask conectado");
    } catch (error) {
      console.error("Usuário negou acesso à conta");
    }
  } else if (typeof window.web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
    console.log("Usando provedor web3 legado");
  } else {
    console.log("Metamask não encontrado. Instale o Metamask.");
    alert("Metamask não encontrado. Instale o Metamask.");
    return;
  }

  const ValAdemicArtifact = await fetch("build/contracts/ValAdemic.json");
  const ValAdemicJSON = await ValAdemicArtifact.json();
  ValAdemic = TruffleContract(ValAdemicJSON);
  ValAdemic.setProvider(web3.currentProvider);

  instancia = await ValAdemic.deployed();
});

async function consultarDiploma() {
  const hash = document.getElementById("consultaHash").value;
  try {
    const resultado = await instancia.getDiploma(hash);
    document.getElementById("consultaResultado").innerText = `
      Nome: ${resultado[0]}
      ID do Estudante: ${resultado[1]}
      Instituição: ${resultado[2]}
      Data: ${new Date(resultado[3] * 1000).toLocaleDateString()}
    `;
  } catch (error) {
    document.getElementById("consultaResultado").innerText = "Erro ao consultar diploma: " + error.message;
  }
}

function autorizarCadastro() {
  const chaveConta = document.getElementById("chaveConta").value;
  if (web3.utils.isAddress(chaveConta)) {
    document.getElementById("cadastroForm").style.display = "block";
  } else {
    alert("Chave de conta inválida");
  }
}

async function cadastrarDiploma() {
  const studentName = document.getElementById("studentName").value;
  const studentId = document.getElementById("studentId").value;
  const institution = document.getElementById("institution").value;
  const date = new Date(document.getElementById("date").value).getTime() / 1000;
  const contas = await web3.eth.getAccounts();

  try {
    const resultado = await instancia.registerDiploma(studentName, studentId, institution, date, { from: contas[0] });
    const evento = resultado.logs[0].args;
    document.getElementById("cadastroResultado").innerText = `
      Diploma registrado com sucesso!
      Hash: ${evento.hash}
    `;
  } catch (error) {
    document.getElementById("cadastroResultado").innerText = "Erro ao registrar diploma: " + error.message;
  }
}
