let api = "https://apirobomonyxx.indicador.win"

//Select 

const formSelect = document.querySelector(".form-select")

formSelect.addEventListener("change", () => {

    let bot = formSelect.options[formSelect.selectedIndex].value

    if (bot === "futuryxx") {

        document.documentElement.style.setProperty('---mainColor', "#5B2293")
        api = "https://apirobomonyxx.indicador.win";


    } else {

        document.documentElement.style.setProperty('---mainColor', "#216BA5")
        api = "https://apispark.indicador.win";

    }

})


// login
const loginForm = document.querySelector(".loginForm")
const inputSenha = document.querySelector("#senha")
const inputUsuario = document.querySelector("#usuario")

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let dados = {
        usuario: (inputUsuario.value).trim(),
        senha: (inputSenha.value).trim()
    }

    let options = {
        method: "POST",
        body: JSON.stringify(dados)
    };

    let req = await fetch(`${api}/admin/login`, options)
    let res = await req.json();

    if (res.status === "ok") {
        localStorage.setItem("treloso", res.token)

        if (formSelect.options[formSelect.selectedIndex].value === "futuryxx") {
            window.location.href = "/painelFuturyxx.html"
        } else {
            window.location.href = "/painelSpark.html"
        }

    } else {
        alert(res.mensagem)
    }
})

