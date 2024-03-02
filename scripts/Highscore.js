const table = document.getElementById("testBody");

let pacman_highcores;
if (localStorage.getItem('pacman_highscores')===null) {
    pacman_highcores = [];
} else {
    pacman_highcores = JSON.parse(localStorage.getItem('pacman_highscores'))
}

for(let i = 0; i < pacman_highcores.length; i++) {
    const s = pacman_highcores[i];
    
    let row = table.insertRow();
    let name = row.insertCell(0);
    name.innerHTML = s.name;
    let score = row.insertCell(1);
    score.innerHTML = s.score;

}