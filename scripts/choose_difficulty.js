
const easy = document.getElementById('easy');
const medium = document.getElementById('medium');
const hard = document.getElementById('hard');

easy.addEventListener('click', () => {
    localStorage.setItem("pacmanDifficulty", "easy");
});

medium.addEventListener('click', () => {
    localStorage.setItem("pacmanDifficulty", "medium");
});

hard.addEventListener('click', () => {
    localStorage.setItem("pacmanDifficulty", "hard");
});

