function rectangularCollision({rectangle1 , rectangle2}) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
	    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
	    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
	    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}


function determineWinner({player, enemy, timerId}) {
	clearTimeout(timerId);
	result.style.display = 'flex'
	if(player.health === enemy.health){
			result.innerHTML = 'Tie </br> Press Space to restart' 
			ended = true;
		}else if(player.health > enemy.health){
			result.innerHTML = 'Player Wins! </br> Press Space to restart'
			ended = true;
		}else if(player.health < enemy.health){
			result.innerHTML = 'Enemy Wins! </br> Press Space to restart'
			ended = true;		
		}
}

const result = document.querySelector('#result')
let timer = 60;
function decreaseTimer() {
	if(timer > 0 && !paused){
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector('#timer').innerHTML = timer;
	}
	if(timer === 0){
		determineWinner({player, enemy, timerId});
	}
	
}