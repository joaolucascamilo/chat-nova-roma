// login elements
const login = document.querySelector(".login");
const loginForm = document.querySelector(".login__form");
const loginInput = document.querySelector(".login__input");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = document.querySelector(".chat__form");
const chatInput = document.querySelector(".chat__input");
const chatMessages = document.querySelector(".chat__messages");

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const user = { id:"", name: "", color: ""};

let webSocket

const createMessageSelfElement = (content) => {
    const div = document.createElement("div");

    div.classList.add("message--self");
    div.innerHTML = content;

    return div;
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    const span = document.createElement("span");

    div.classList.add("message--other");

    div.classList.add("message--self");
    span.classList.add("message--sender");
    span.style.color = senderColor;

    div.appendChild(span);

    span.innerHTML = sender;
    div.innerHTML += content;

    return div;
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
});
}

const processMessage = ({data}) => {
    const { userId, userName, userColor, content } = JSON.parse(data);

    //Se o userId for igual ao id do usuário, a mensagem é do próprio usuário
    const message = userId == user.id ? createMessageSelfElement(content) : createMessageOtherElement(content, userName, userColor);

    chatMessages.appendChild(message);

    //Scrolla a tela para a última mensagem, sempre que uma nova mensagem for recebida
    scrollScreen();
}

const handleLogin = (event) =>{
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    login.style.display = "none";
    chat.style.display = "flex";

    webSocket = new WebSocket("wss://chat-nova-roma-backend.onrender.com"); 
    webSocket.onmessage = processMessage;
}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    webSocket.send(JSON.stringify(message))

    chatInput.value = "";
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
