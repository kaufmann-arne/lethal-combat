const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); 


canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: 'assets/background.png'
})

const shop = new Sprite({
	position: {
		x: 600,
		y: 128
	},
	imageSrc: 'assets/shop.png',
	scale: 2.75,
	framesMax: 6
})

const player = new Fighter({
	position: {
		x:200,
		y:230
	}, 
	velocity: {
		x:0,
		y:0
	},
	offset: {
		x:0,
		y:0
	},
	imageSrc: 'assets/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: 'assets/samuraiMack/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: 'assets/samuraiMack/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: 'assets/samuraiMack/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: 'assets/samuraiMack/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: 'assets/samuraiMack/Attack1.png',
			framesMax: 6
		},
		takeHit: {
			imageSrc: 'assets/samuraiMack/Take Hit2.png',
			framesMax: 4
		},
		death: {
			imageSrc: 'assets/samuraiMack/Death.png',
			framesMax: 6
		}

	},
	attackBox: {
		offset: {x: 100, y: 50},
		width: 160,
		height: 50
	}
})



const enemy = new Fighter({
	position: {
		x:730,
		y:230
	}, 
	velocity: {
		x:0,
		y:0
	},
	color: 'orange',
	offset: {
		x:-50,
		y:0
	},
	imageSrc: 'assets/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 167
	},
	sprites: {
		idle: {
			imageSrc: 'assets/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: 'assets/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: 'assets/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: 'assets/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: 'assets/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: 'assets/kenji/Take hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: 'assets/kenji/Death.png',
			framesMax: 7
		}
	},
	attackBox: {
		offset: {x: -170, y: 50},
		width: 170,
		height: 50
	}
})


const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowUp: {
		pressed: false
	}
}



const msg = document.querySelector('#msg')
let started = false;
let paused = false;
let ended = true;
let frameGoing = true;
function animate1() {
	if(frameGoing) window.requestAnimationFrame(animate1);
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.draw();;
	shop.draw();;
	c.fillStyle = 'rgba(255, 255, 255, 0.1)';
	c.fillRect(0, 0, canvas.width, canvas.height);
	// player.position.x = 200
	// player.position.y = 230
	// enemy.position.x = 730
	// enemy.position.y = 230
	player.draw();
	enemy.draw();
}
animate1()


function animate() {
	if(started && !paused) window.requestAnimationFrame(animate);
	c.fillStyle = 'black';
	c.fillRect(0, 0, canvas.width, canvas.height);
	background.update();
	shop.update();
	c.fillStyle = 'rgba(255, 255, 255, 0.1)';
	c.fillRect(0, 0, canvas.width, canvas.height);
	player.update();
	enemy.update();

	player.velocity.x = 0;

	
	if(keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
		player.switchSprite('run');
	}else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
		player.switchSprite('run');
	}else{
		player.switchSprite('idle');
	}

	if(player.velocity.y < 0 && player.position.y >= 34.4) {
		player.switchSprite('jump');
	}else if(player.velocity.y > 0){
		player.switchSprite('fall');
	}

	enemy.velocity.x = 0;

	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -5
		enemy.switchSprite('run');
	}else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = 5
		enemy.switchSprite('run');
	}else{
		enemy.switchSprite('idle');
	}

	if(enemy.velocity.y < 0 && enemy.position.y >= 34.4) {
		enemy.switchSprite('jump');
	}else if(enemy.velocity.y > 0){
		enemy.switchSprite('fall');
	}

	if(rectangularCollision({
		rectangle1: player, rectangle2: enemy
	}) && player.isAttacking && player.framesCurrent === 4){

	   enemy.health -= 25; //could declare in takehit as well but then damage needs to be equal
	   enemy.takeHit();
	   player.isAttacking = false;
	   gsap.to('#enemyHealth', {width: enemy.health + '%'})
	   if(enemy.health < 0){
	   	document.querySelector('#enemyHealth').style.width = 0 + '%';
	   }
	}

	if(player.isAttacking && player.framesCurrent === 4){
		player.isAttacking = false;
	}



	if(rectangularCollision({
		rectangle1: enemy, rectangle2: player
	}) && enemy.isAttacking && enemy.framesCurrent === 2){

	   player.health -= 15;
	   player.takeHit();
	   enemy.isAttacking = false;
	   gsap.to('#playerHealth', {width: player.health + '%'})
	   if(player.health < 0){
	   	document.querySelector('#playerHealth').style.width = 0 + '%';
	   }
	   
	}

	if(enemy.isAttacking && enemy.framesCurrent === 2){
		enemy.isAttacking = false;
	}
	if(player.health <= 0 || enemy.health <= 0){
		determineWinner({player, enemy, timerId});
		animate1()	
	}

}

window.addEventListener('keydown', (event) => {
	console.log(event.key)
	if(!started && ended && event.key == ' '){
		console.log("A")
		started = true;
		ended = false;
		result.style.display = 'none'
		animate();
		decreaseTimer();
	}else if(started && !ended && !paused && event.key == ' '){
		console.log("B")
		paused = true;
		result.style.display = 'flex'
		result.innerHTML = 'Paused'
		animate()
	}else if(started && !ended && paused && event.key == ' ') {
		console.log("C")
		paused = false;
		result.style.display = 'none'
		animate()
		decreaseTimer();
	}else if(ended && event.key == ' ') {
		console.log("D")
		document.querySelector('#playerHealth').style.width = 100 + '%';
		document.querySelector('#enemyHealth').style.width = 100 + '%';
		player.position.x = 200;
		enemy.position.x = 730;
		player.position.y = 230;
		enemy.position.y = 230;
		timer = 60;
		timer.innerHTML = 60;
		player.health = 100;
		enemy.health = 100;
		player.dead = false;
		enemy.dead = false;
		paused = false;
		started = false;
		animate();
		result.innerHTML = 'Press Space to Start'
		result.style.display = 'flex'		
	}

	
	if(!player.dead && !enemy.dead && !paused){
		switch(event.key) {				
			case 'd':
				keys.d.pressed = true;
				player.lastKey = 'd';
				break;
			case 'a':
				keys.a.pressed = true;
				player.lastKey = 'a';
				break;
			case 'w':
				if(player.position.y >= 34.4)player.velocity.y = -20;
				break;
			case 's':
				player.attack();
				break
			
		}
	}

	if(!enemy.dead && !player.dead && !paused){
		switch(event.key){
			case 'ArrowRight':
				keys.ArrowRight.pressed = true;
				enemy.lastKey = 'ArrowRight';
				break;
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true;
				enemy.lastKey = 'ArrowLeft';
				break;
			case 'ArrowUp':
				if(enemy.position.y >= 34.4)enemy.velocity.y = -20;
				break;
			case 'ArrowDown':
				enemy.attack();
				break;
		}
	}
})

window.addEventListener('keyup', (event) => {
	switch(event.key) {
		case 'd':
			keys.d.pressed = false;
			break;
		case 'a':
			keys.a.pressed = false;
			break;
		case 'w':
			keys.w.pressed = false;
			break;
		case 'ArrowRight':
			keys.ArrowRight.pressed = false;
			break;
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false;
			break;
		case 'ArrowUp':
			keys.ArrowUp.pressed = false;
			break;
	}
})