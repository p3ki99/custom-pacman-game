const dialog = document.getElementById('dialog');
const save_button = document.getElementById('d_savebutton');
const close_button = document.getElementById('d_closebutton');
const p = document.getElementById('d_text');
const input_name = document.getElementById('input_name');

let score;
export function showDialog() {
    try {
        if (typeof dialog.showModal === "function") {
            score = localStorage.getItem("score") || "0";
            p.innerHTML = "YOUR SCORE: " + score;
        
            dialog.showModal();
          } else {
            // not supported
        
          }
      } catch(e) {
    
      }
}

save_button.addEventListener('click', () => {
    try {
        const name = input_name.value || 'player';

        let pacman_highcores;
        try {
            if (localStorage.getItem('pacman_highscores')===null) {
                pacman_highcores = [];
            } else {
                pacman_highcores = JSON.parse(localStorage.getItem('pacman_highscores'))
            }
        } catch (e) {
            pacman_highcores = [];
        }
       
        pacman_highcores.push( { name: name, score: score} );
        localStorage.setItem('pacman_highscores', JSON.stringify(pacman_highcores));
    } catch (e) {

    }
    dialog.close();
    window.location.href = './index.html';
 });

close_button.addEventListener('click', () => {
   dialog.close();
   window.location.href = './index.html';
});

// If a browser doesn't support the dialog, then hide the
// dialog contents by default.
if (typeof dialog.showModal !== 'function') {
    dialog.hidden = true;
  /* a fallback script to allow this dialog/form to function
     for legacy browsers that do not support <dialog>
     could be provided here.
  */
}

