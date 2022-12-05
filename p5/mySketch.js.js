let flies = [];
let webs = [];
let score = 0;

function preload() {
	backgroundimage = loadImage("background.jpg");
	playerWeb = loadImage("web.png");
	flyI = loadImage("fly.png");
	spider = loadImage("spider.png");
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	playerWeb.resize(100, 100);
	flyI.resize(128, 75);
	spider.resize(200, 200);
	imageMode(CENTER);
	backgroundimage.resize(1920, 1000);
}

function draw() {
	image(backgroundimage, windowWidth / 2, windowHeight / 2);
	image(spider, mouseX, 750);
	textSize(20);

	if (score <= 4) {
		fill(255);
		text("Fly Type: Normal", width / 2 - 70, 50);
		text("Score: " + score, width / 2 - 30, 80);
	}
	if (score > 4) {
		fill(255, 0, 0);
		text("Fly Type: Trans-AM", width / 2 - 70, 50);
		text("Score: " + score, width / 2 - 30, 80);
	}

	// Create fly
	if (frameCount % 30 === 1) {
		let fly = new Fly();
		flies.push(fly);
	}

	// Update all the flies
	for (let i = 0; i < flies.length; i++) {
		flies[i].update();
		if (flies[i].x > width) {
			flies[i].catchUp = true;
			flies.splice(i, 1);
			i = i - 1;
		} else if (flies[i].y > height || flies[i].y < 0) {
			flies[i].velY = flies[i].velY * -1;
		}
	}

	for (let i = 0; i < webs.length; i++) {
		webs[i].update();
		if (webs[i].y < 0) {
			webs.splice(i, 1);
			i = i - 1;
		}
	}
}

function mousePressed() {
	// Make a web
	if (frameCount % 2 === 0) {
		let web = new Web(mouseX);
		webs.push(web);
	}
}

// Flies move right from the left of the screen
class Fly {
	constructor() {
		this.x = 0;
		this.y = random(0, height);
		this.velX = random(1, 3);
		this.velY = random(-3, 3);
		this.catchUp = false;
	}
	update() {
		for (let i = 0; i < webs.length; i++) {
			let d = dist(this.x, this.y, webs[i].x, webs[i].y);
			if (d < webs[i].diameter && this.catchUp === false) {
				this.catchUp = true;
				score = score + 1;
				webs.splice(i, 1);
				i = i - 1;
			}
		}
		if (this.catchUp === false && score < 5) {
			this.x += this.velX;
			this.y += this.velY;
			image(flyI, this.x, this.y);
		} else if (this.catchUp === false && score >= 5) {
			this.x += this.velX * 3;
			this.y += this.velY * 2;
			image(flyI, this.x, this.y);
		}
	}
}

class Web {
	constructor(mX) {
		this.x = mX;
		this.y = 810;
		this.diameter = 41;
	}

	update() {
		// Draw the web
		this.y = this.y - 7;
		image(playerWeb, this.x, this.y);
	}
}