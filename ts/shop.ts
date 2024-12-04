interface Character {
    id: number,
    name: string;
    coins: number;
    image: string;
}
let charApi = "http://localhost:8080/api/v1/shop";
// const selectButtons = document.getElementsByClassName("price");

function select(id: number, event: Event) {
    event.preventDefault();
    console.log(id);
}
async function loadCharacter() {
    let characters: Character[];
    let str: string = "";
    characters = await fetch(charApi + "/getAllChar").then(res => {
        return res.json();
    });
    characters.forEach(char => {
        str+=
            `<div class="item">
                <img src="image/${char.image}" alt="Unicorn">
                <button type="submit" class="price" data-id="${char.id}">${char.coins} points</button>
            </div>`
    });
    const shopElement = document.getElementById("shop");
    if (shopElement) {
        shopElement.innerHTML = str;
    }
    const buttons = document.querySelectorAll(".price");
    buttons.forEach(button => {
        button.addEventListener("click", (event: Event) => {
            const id = Number((button as HTMLElement).getAttribute("data-id"));
            select(id, event);        
        });
    });
    requestAnimationFrame(loadCharacter);
}

loadCharacter();
