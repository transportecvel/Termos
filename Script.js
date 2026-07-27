let termoAtual = 'MULTA';

// TROCA AUTOMÁTICA DE PAISAGENS (A CADA 6 SEGUNDOS)
const slides = document.querySelectorAll('.bg-slide');
let currentSlide = 0;

if (slides.length > 0) {
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 6000);
}

function alternarTermo(tipo) {
    termoAtual = tipo;
    if(tipo === 'MULTA') {
        document.getElementById('tabMulta').classList.add('active');
        document.getElementById('tabKit').classList.remove('active');
        document.getElementById('formMulta').style.display = 'block';
        document.getElementById('formKit').style.display = 'none';
    } else {
        document.getElementById('tabKit').classList.add('active');
        document.getElementById('tabMulta').classList.remove('active');
        document.getElementById('formKit').style.display = 'block';
        document.getElementById('formMulta').style.display = 'none';
    }
}

function numeroParaExtenso(valor) {
    if (!valor || valor <= 0) return "(zero reais)";
    const inteiros = Math.floor(valor);
    const centavos = Math.round((valor - inteiros) * 100);
    const unidades = ["", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"];
    const dezenas = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
    const centenas = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

    function converterBloco(n) {
        if (n === 100) return "cem";
        let str = "";
        let c = Math.floor(n / 100); let d = Math.floor((n % 100) / 10); let u = n % 10;
        if (c > 0) str += centenas[c];
        if (d === 1) { if (str !== "") str += " e "; str += unidades[n % 100]; return str; }
        if (d > 1) { if (str !== "") str += " e "; str += dezenas[d]; }
        if (u > 0) { if (str !== "") str += " e "; str += unidades[u]; }
        return str;
    }

    let texto = "";
    if (inteiros === 1000) texto = "um mil reais";
    else if (inteiros > 1000) {
        let mil = Math.floor(inteiros / 1000); let resto = inteiros % 1000;
        texto = (mil === 1 ? "mil" : converterBloco(mil) + " mil");
        if (resto > 0) texto += (resto < 100 || resto % 100 === 0 ? " e " : " ") + converterBloco(resto);
        texto += " reais";
    } else if (inteiros > 0) texto = converterBloco(inteiros) + (inteiros === 1 ? " real" : " reais");

    if (centavos > 0) {
        if (inteiros > 0) texto += " e ";
        texto += converterBloco(centavos) + (centavos === 1 ? " centavo" : " centavos");
    }
    return `(${texto})`;
}

function prepararEImprimir() {
    carregarDataHoje();

    // Limpa ativação anterior
    document.getElementById('docMultaPrint').classList.remove('active-print');
    document.getElementById('docKitPrint').classList.remove('active-print');

    if(termoAtual === 'MULTA') {
        document.getElementById('docMultaPrint').classList.add('active-print');

        const nome = document.getElementById('inputNomeMulta').value;
        const cpf = document.getElementById('inputCpfMulta').value;
        const auto = document.getElementById('inputAutoMulta').value;
        const dataInf = document.getElementById('inputDataInfracao').value;
        const valorTotal = parseFloat(document.getElementById('inputValorMulta').value) || 0;
        const qtdParcelas = parseInt(document.getElementById('inputParcelas').value) || 1;

        document.getElementById('pNomeMulta').innerText = nome ? nome.toUpperCase() : "____________________________________________________";
        document.getElementById('pCpfMulta').innerText = cpf ? cpf : "________________________";
        document.getElementById('pAutoMulta').innerText = auto ? auto.toUpperCase() : "____________________";

        if (dataInf) {
            const [ano, mes, dia] = dataInf.split('-');
            document.getElementById('pDataInfracao').innerText = `${dia}/${mes}/${ano}`;
        } else document.getElementById('pDataInfracao').innerText = "____/____/________";

        document.getElementById('pValorTotal').innerText = valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        document.getElementById('pValorExtenso').innerText = numeroParaExtenso(valorTotal);
        document.getElementById('pQtdParcelas').innerText = qtdParcelas;

        const valorParcela = valorTotal / qtdParcelas;
        document.getElementById('pValorParcela').innerText = valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        const tabelaCorpo = document.getElementById('pTabelaCorpoMulta');
        tabelaCorpo.innerHTML = "";
        const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        let dataAtual = new Date();

        for (let i = 0; i < qtdParcelas; i++) {
            let mesIndex = (dataAtual.getMonth() + i) % 12;
            let anoAdicional = Math.floor((dataAtual.getMonth() + i) / 12);
            let anoParcela = dataAtual.getFullYear() + anoAdicional;
            
            let tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${i + 1}ª Parcela</strong></td><td>${mesesNomes[mesIndex]} / ${anoParcela}</td><td>R$ ${valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>`;
            tabelaCorpo.appendChild(tr);
        }
    } else {
        document.getElementById('docKitPrint').classList.add('active-print');

        const nome = document.getElementById('inputNomeKit').value;
        const funcao = document.querySelector('input[name="funcaoKit"]:checked').value;
        
        document.getElementById('pNomeKit').innerText = nome ? nome.toUpperCase() : "____________________________________________________";
        document.getElementById('pFuncaoKit').innerHTML = funcao === 'MOTORISTA' ? "<strong>(X) Motorista</strong> &nbsp;&nbsp;&nbsp;&nbsp; ( ) Ajudante" : "( ) Motorista &nbsp;&nbsp;&nbsp;&nbsp; <strong>(X) Ajudante</strong>";

        const materiais = [
            { nome: "CANETA", qtd: document.getElementById('qtdCaneta').value },
            { nome: "GRAMPO", qtd: document.getElementById('qtdGrampo').value },
            { nome: "GRAMPEADOR", qtd: document.getElementById('qtdGrampeador').value },
            { nome: "PRANCHETA", qtd: document.getElementById('qtdPrancheta').value },
            { nome: "FITA", qtd: document.getElementById('qtdFita').value },
            { nome: "COLCHÃO", qtd: document.getElementById('qtdColchao').value },
            { nome: "CARRINHO", qtd: document.getElementById('qtdCarrinho').value }
        ];

        const extraNome = document.getElementById('itemExtraNome').value.toUpperCase().trim();
        const extraQtd = document.getElementById('itemExtraQtd').value;
        if(extraNome) materiais.push({ nome: extraNome, qtd: extraQtd });

        const tbody = document.getElementById('pTabelaCorpoKit');
        tbody.innerHTML = "";

        materiais.forEach(item => {
            let tr = document.createElement('tr');
            tr.innerHTML = `<td><strong>${item.nome}</strong></td><td class="qtd-col">${item.qtd ? item.qtd : ''}</td>`;
            tbody.appendChild(tr);
        });
    }

    window.print();
}

function carregarDataHoje() {
    const hoje = new Date();
    const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const strData = `${String(hoje.getDate()).padStart(2, '0')} de ${mesesNomes[hoje.getMonth()]} de ${hoje.getFullYear()}`;
    document.querySelectorAll('.dataHojeSpan').forEach(el => el.innerText = strData);
}