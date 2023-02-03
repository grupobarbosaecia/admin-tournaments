// settings

let api = "https://apispark.indicador.win"

function getSessionToken(cname) {
    let token = localStorage.getItem(cname)
    return token
}

function deleteSessionToken(cname) {
    localStorage.removeItem(cname)
}

//exit painel

const logoutBtn = document.querySelector(".logoutBtn")

logoutBtn.addEventListener("click", () => {

    deleteSessionToken("treloso");
    window.location.href = "/";

})

// show tournaments
const tournamentsDiv = document.querySelector(".tournaments")

window.addEventListener("load", showTournaments)

async function showTournaments() {

    tournamentsDiv.innerHTML = ``

    let options = {
        headers: {
            "Authorization": getSessionToken("treloso"),
            "Content-Type": "application/json;charset=utf-8",
        }
    }

    let req = await fetch(`${api}/admin/torneios`, options)
    let res = await req.json()

    if (res.status === "ok") {

        let tournaments = res.torneios

        tournaments.forEach(element => {

            let div = document.createElement("div")
            div.classList.add("single-tournament", "bgMain", "d-flex", "justify-content-between", "align-items-center", "px-3", "py-4", "mb-4")

            div.innerHTML = `
                <p class="p-0 m-0 fontBg">${element.nome}</p>

                <div class="icons d-flex align-items-center" data-id=${element.id}>
                    <i class="ph-info-fill mx-3 infoBtn" data-bs-toggle="modal" data-bs-target="#information"></i>
                    <i class="ph-table-fill mx-3 rankingBtn" data-bs-toggle="modal" data-bs-target="#ranking"></i>
                    <i class="ph-pencil-simple-fill mx-3 editBtn" data-bs-toggle="modal" data-bs-target="#edit"></i>
                    <i class="ph-trash-fill ms-3 me-2 deleteBtn" data-bs-toggle="modal"
                        data-bs-target="#delete"></i>
                </div>
            `

            tournamentsDiv.appendChild(div)

            let rankingBtn = div.querySelector(".rankingBtn")
            let deleteBtn = div.querySelector(".deleteBtn")
            let infoBtn = div.querySelector(".infoBtn")
            let editBtn = div.querySelector(".editBtn")

            rankingBtn.addEventListener("click", (e) => { getRanking(e) })
            deleteBtn.addEventListener("click", (e) => { deleteTournament(e) })
            infoBtn.addEventListener("click", (e) => { showInformation(e) })
            editBtn.addEventListener("click", (e) => { buildEditModal(e) })

        });
    }
}


//create tournaments

const formCreateTournament = document.querySelector(".form-createTournament")
const sendBtn = document.querySelector(".sendTournament")

sendBtn.addEventListener("click", async () => {

    let inputNome = formCreateTournament.querySelector("#nome")
    let inputTaxa = formCreateTournament.querySelector("#taxa")
    let inputPar = formCreateTournament.querySelector(".form-select")
    let inputPremio = formCreateTournament.querySelector("#premio")
    let inputDataInicio = formCreateTournament.querySelector("#inicio")
    let inputDataFim = formCreateTournament.querySelector("#encerramento")

    let dados = {
        nome: inputNome.value,
        taxa: Number(inputTaxa.value),
        par: inputPar.options[inputPar.selectedIndex].value,
        premio: Number(inputPremio.value),
        data_inicio: (inputDataInicio.value).replace("T", " "),
        data_fim: (inputDataFim.value).replace("T", " ")
    }

    let options = {
        method: "POST",
        headers: {
            "Authorization": getSessionToken("treloso"),
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(dados)
    }

    let req = await fetch(`${api}/admin/criar_torneio`, options)
    sendBtn.setAttribute("disabled", true)
    let res = await req.json()


    if (res.status === "ok") {
        alert("Torneio Cadastrado")
        location.reload()
    }

})


// show ranking

const tableRanking = document.querySelector(".table-ranking")

async function getRanking(e) {

    tableRanking.innerHTML = ``

    let tournamentId = e.target.parentElement.dataset.id

    let options = {
        headers: {
            "Authorization": getSessionToken("treloso"),
            "Content-Type": "application/json;charset=utf-8",
        }
    }

    let req = await fetch(`${api}/admin/ranking_torneio?torneio=${tournamentId}`, options)
    let res = await req.json()

    let ranking = res.ranking

    if (ranking.length > 0) {

        ranking.forEach((element, index) => {
            if (index === 0) {

                let tr = document.createElement("tr")
                tr.classList.add("table-group-divider", "fw-semibold")

                tr.innerHTML = `
                    <td class="py-2 d-flex align-items-center"> <i class="ph-trophy-fill" style="font-size: 28px; color: #FFD700;"></i>
                    <td class="py-2">${element.nome}</td>
                    <td class="py-2">${element.pontos}</td>
                `

                tableRanking.appendChild(tr)

            } else if (index === 1) {

                let tr = document.createElement("tr")
                tr.classList.add("table-group-divider", "fw-semibold")

                tr.innerHTML = `
                    <td class="py-2 d-flex align-items-center"> <i class="ph-trophy-fill" style="font-size: 28px; color: #C0C0C0;"></i>
                    <td class="py-2">${element.nome}</td>
                    <td class="py-2">${element.pontos}</td>
                `

                tableRanking.appendChild(tr)

            } else if (index === 2) {

                let tr = document.createElement("tr")
                tr.classList.add("table-group-divider", "fw-semibold")

                tr.innerHTML = `
                    <td class="py-2 d-flex align-items-center"> <i class="ph-trophy-fill" style="font-size: 28px; color: #CD7F32;"></i>
                    <td class="py-2">${element.nome}</td>
                    <td class="py-2">${element.pontos}</td>
                `

                tableRanking.appendChild(tr)

            } else {

                let tr = document.createElement("tr")
                tr.classList.add("table-group-divider", "fw-semibold")

                tr.innerHTML = `
                    <td class="py-2 d-flex align-items-center ms-2">${index + 1}º</td>
                    <td class="py-2">${element.nome}</td>
                    <td class="py-2">${element.pontos}</td>
                `

                tableRanking.appendChild(tr)

            }
        })

    } else {
        let tr = document.createElement("tr")
        tr.classList.add("table-group-divider", "fw-semibold")

        tr.innerHTML = `
                    <td class="py-2 d-flex align-items-center" colspan="6">Ninguém está disputando esse torneio.</td>
                `

        tableRanking.appendChild(tr)
    }


}


// delete tournament

const yesBtn = document.querySelector(".yes")
const noBtn = document.querySelector(".no")

function deleteTournament(e) {
    let tournamentId = e.target.parentElement.dataset.id

    yesBtn.addEventListener("click", async () => {

        let dados = {
            id: tournamentId
        }

        let options = {
            method: "POST",
            headers: {
                "Authorization": getSessionToken("treloso"),
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(dados)
        }

        let req = await fetch(`${api}/admin/apagar_torneio`, options)
        let res = await req.json()

        if (res.status === "ok") {
            alert("Torneio excluído com sucesso")
            location.reload();
        }

    })

    noBtn.addEventListener("click", () => {
        tournamentId = null;
    })
}


// show information

const modalInformation = document.querySelector(".information-body")

async function showInformation(e) {

    let tournamentId = Number(e.target.parentElement.dataset.id)

    let options = {
        headers: {
            "Authorization": getSessionToken("treloso"),
            "Content-Type": "application/json;charset=utf-8",
        }
    }

    let req = await fetch(`${api}/admin/torneios`, options)
    let res = await req.json()

    let torneios = res.torneios;

    torneios.forEach(element => {

        if (element.id === tournamentId) {

            modalInformation.innerHTML = `
                <h3 class="text-center fontBg">Informações do torneio</h3>

                <div class="d-flex flex-column align-items-center justify-content-center mt-5">
                    <span class="category fontBg fw-bold">Nome</span>
                    <span class="nameTournament text-uppercase fontBg">${element.nome}</span>
                </div>

                <div class="w-100 d-flex justify-content-between px-3">
                    <div class="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span class="category fontBg fw-bold">Taxa</span>
                        <span class="attribute fontBg">${element.taxa} créditos</span>
                    </div>

                    <div class="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span class="category fontBg fw-bold">Prêmio</span>
                        <span class="attribute fontBg">R$ ${element.premio}</span>
                    </div>

                    <div class="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span class="category fontBg fw-bold">Par</span>
                        <span class="attribute fontBg">${element.par}</span>
                    </div>
                </div>

                <div class="w-100 d-flex justify-content-around px-3">
                    <div class="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span class="category fontBg fw-bold">Início</span>
                        <span class="attribute fontBg">${element.data_inicio}</span>
                    </div>

                    <div class="d-flex flex-column align-items-center justify-content-center mt-5">
                        <span class="category fontBg fw-bold">Encerramento</span>
                        <span class="attribute fontBg">${element.data_fim}</span>
                    </div>

                </div>
            `
        }
    })

}


//edit tournament

const formEditTournament = document.querySelector(".form-editTournament")


async function buildEditModal(e) {

    let tournamentId = Number(e.target.parentElement.dataset.id)
    formEditTournament.dataset.id = tournamentId

    let options = {
        headers: {
            "Authorization": getSessionToken("treloso"),
            "Content-Type": "application/json;charset=utf-8",
        }
    }

    let req = await fetch(`${api}/admin/torneios`, options)
    let res = await req.json()

    let torneios = res.torneios;

    torneios.forEach(element => {
        if (element.id === tournamentId) {
            formEditTournament.innerHTML = `

                <div class="mb-4">
                    <label for="Nome" class="form-label fontBg p-0 m-1">Nome</label>
                    <input type="text" class="form-control" id="nome" autocomplete="off" value="${element.nome}">
                </div>

                <div class="mb-4">
                    <label for="taxa" class="form-label fontBg p-0 m-1">Taxa</label>
                    <input type="number" class="form-control" id="taxa" autocomplete="off" value=${element.taxa}>
                </div>

                <div class="mb-4">
                    <label for="premio" class="form-label fontBg p-0 m-1">Prêmio</label>
                    <input type="number" class="form-control" id="premio" autocomplete="off" value=${element.premio}>
                </div>

                <div class="times mb-5 d-flex justify-content-between flex-column flex-sm-row">
                    <div>
                        <label for="inicio" class="form-label fontBg p-0 m-1">Início</label>
                        <input type="datetime-local" class="form-control" id="inicio" autocomplete="off" value=${(element.data_inicio).replace(" ", "T")}>
                    </div>

                    <div
                        class="text-sm-end d-flex justify-content-sm-end align-items-sm-end flex-column mt-4 mt-sm-0">
                        <label for="encerramento" class="form-label fontBg p-0 m-1">Encerramento</label>
                        <input type="datetime-local" class="form-control" id="encerramento" autocomplete="off" value=${(element.data_fim).replace(" ", "T")}>
                    </div>

                </div>

                <div class="mb-5">

                    <select class="form-select montserrat" aria-label="Default select example">
                        <option selected>Ativos</option>
                        <option value="BTCUSD" ${element.par === "BTCUSD" && "selected"}>BTC/USD</option>
                            <option value="EURUSD" ${element.par === "EURUSD" && "selected"}>EUR/USD</option>
                            <option value="BNBUSD" ${element.par === "BNBUSD" && "selected"}>BNB/USD</option>
                            <option value="ETHUSD" ${element.par === "ETHUSD" && "selected"}>ETH/USD</option>
                            <option value="EURJPY" ${element.par === "EURJPY" && "selected"}>EUR/JPY</option>
                            <option value="AUDUSD" ${element.par === "AUDUSD" && "selected"}>AUD/USD</option>
                            <option value="EURBGP" ${element.par === "EURBGP" && "selected"}>EUR/BGP</option>
                            <option value="GBPUSD" ${element.par === "GBPUSD" && "selected"}>GBP/USD</option>
                            <option value="USDJPY" ${element.par === "USDJPY" && "selected"}>USD/JPY</option>
                            <option value="AUDJPY" ${element.par === "AUDJPY" && "selected"}>AUD/JPY</option>
                            <option value="GBPJPY" ${element.par === "GBPJPY" && "selected"}>GBP/JPY</option>
                            <option value="AUDCAD" ${element.par === "AUDCAD" && "selected"}>AUD/CAD</option>
                    </select>

                </div>

                <div class="w-100 text-center mb-3">
                    <button type="submit">Cadastrar</button>
                </div>

            `
        }
    })
}

formEditTournament.addEventListener("submit", async (e) => {
    e.preventDefault();

    let inputNome = formEditTournament.querySelector("#nome")
    let inputTaxa = formEditTournament.querySelector("#taxa")
    let inputPar = formEditTournament.querySelector(".form-select")
    let inputPremio = formEditTournament.querySelector("#premio")
    let inputDataInicio = formEditTournament.querySelector("#inicio")
    let inputDataFim = formEditTournament.querySelector("#encerramento")

    let dados = {
        id: Number(formEditTournament.dataset.id),
        nome: inputNome.value,
        taxa: Number(inputTaxa.value),
        par: inputPar.options[inputPar.selectedIndex].value,
        premio: Number(inputPremio.value),
        data_inicio: (inputDataInicio.value).replace("T", " "),
        data_fim: (inputDataFim.value).replace("T", " ")
    }

    let options = {
        method: "POST",
        headers: {
            "Authorization": getSessionToken("treloso"),
            "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(dados)
    }

    let req = await fetch(`${api}/admin/editar_torneio`, options)
    let res = await req.json()

    if (res.status === "ok") {
        alert("Torneio editado")
        location.reload()
    }

})