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
    document.getElementById("consultaResultado").innerText = "Erro ao consultar diploma.";
  }
}

async function autorizarCadastro() {
  const chavePrivada = document.getElementById("chaveConta").value.trim();

  try {
    const contas = await web3.eth.getAccounts();
    const contaMetaMask = contas[0];
    const mensagem = `Autorização para cadastro: ${contaMetaMask}`;
    const assinaturaMetaMask = await web3.eth.personal.sign(mensagem, contaMetaMask, '');
    const enderecoRecuperadoMetaMask = web3.eth.accounts.recover(mensagem, assinaturaMetaMask);

    if (enderecoRecuperadoMetaMask.toLowerCase() !== contaMetaMask.toLowerCase()) {
      document.getElementById("cadastroResultado").innerText = "A assinatura não corresponde à conta do MetaMask.";
      return;
    }

    const assinaturaPrivada = web3.eth.accounts.sign(mensagem, chavePrivada);
    const enderecoRecuperadoPrivada = web3.eth.accounts.recover(mensagem, assinaturaPrivada.signature);

    if (enderecoRecuperadoPrivada.toLowerCase() === contaMetaMask.toLowerCase()) {
      document.getElementById("cadastroForm").style.display = "block";
    } else {
      document.getElementById("cadastroResultado").innerText = "Chave privada não corresponde à conta do MetaMask.";
    }
  } catch (error) {
    console.error("Erro ao autorizar cadastro:", error);
    document.getElementById("cadastroResultado").innerText = "Erro ao autorizar cadastro.";
  }
}

async function cadastrarDiploma() {
  const studentName = document.getElementById("studentName").value;
  const studentId = document.getElementById("studentId").value;
  const institution = document.getElementById("institution").value;
  const dateInput = document.getElementById("date").value;

  if (!dateInput) {
    document.getElementById("cadastroResultado").innerText = "Data inválida";
    return;
  }

  const date = Math.floor(new Date(dateInput).getTime() / 1000);
  const contas = await web3.eth.getAccounts();

  try {
    const resultado = await instancia.registerDiploma(studentName, studentId, institution, date, { from: contas[0] });
    const evento = resultado.logs[0].args;
    const hash = evento.hash;

    document.getElementById("cadastroResultado").innerText = `
      Diploma registrado com sucesso!
      Hash: ${hash}`;

    const response = await fetch('http://127.0.0.1:3000/saveHash', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ studentName, studentId, institution, date, hash })
    });

    if (response.ok) {
      console.log("Hash salvo no MongoDB");
    } else {
      console.error("Erro ao salvar o hash no MongoDB");
    }
  } catch (error) {
    document.getElementById("cadastroResultado").innerText = "Erro ao registrar diploma.";
  }
}
