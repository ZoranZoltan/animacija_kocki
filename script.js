const B = BABYLON;

class App {
	constructor() {
		this.cubes = [];
		this.canvas = document.getElementById("renderCanvas");
		this.settings = {
			numberOfCubes: 200,
			cubeSize: 5,
			camera: { alpha: 1, beta: 1, radius: 50 },
			offsetY: 5,
		};
		this.settings.light = { x: this.settings.numberOfCubes, y: 100, z: this.settings.numberOfCubes };
		this.settings.cameraTarget = { x: this.settings.numberOfCubes, y: 2.5, z: this.settings.numberOfCubes };
		this.start();
	}
	
	start() {
		this.engine = new B.Engine(this.canvas, true);
		this.scene = new B.Scene(this.engine);
		this.scene.clearColor = new B.Color3(0.1, 0.1, 0.1);
		this.target = new B.MeshBuilder.CreateSphere("target", this.scene);
		this.target.material = new B.StandardMaterial("target-material", this.scene);
		this.target.material.emissiveColor = new B.Color3(1, 0, 0);
		this.target.position = new B.Vector3(this.settings.cameraTarget.x, this.settings.cameraTarget.y, this.settings.cameraTarget.z);
		this.target.material.alpha = 0;
		this.camera = new B.ArcRotateCamera("Camera", this.settings.camera.alpha, this.settings.camera.beta, this.settings.camera.radius, this.target, this.scene);
		this.camera.attachControl(this.canvas, true);
		this.camera.useAutoRotationBehavior = true;
		this.camera.autoRotationBehavior.idleRotationSpeed = 0.1;
		this.light = new B.PointLight("light1", new B.Vector3(this.settings.light.x, this.settings.light.y, this.settings.light.z), this.scene);
		this.light.intensity = 1.5;
		this.light.range = 115;
		this.createCubes();
		this.engine.runRenderLoop(() => this.update());
		window.addEventListener("resize", () => this.engine.resize());
	}
	
	update() {
		this.scene.render();
	}
	
	createCubes() {
		let cubesPerRow = this.settings.numberOfCubes / 2;
		
		for (let i = 0; i < cubesPerRow; i++) {
			for (let j = 0; j < cubesPerRow; j++) {
				this.cubes.push(new Cube(new B.Vector3(i * this.settings.cubeSize, this.getRandomArbitrary(0, 5), j * this.settings.cubeSize), this));
			}
		}
	}
	
	getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}
}

class Cube {
	constructor(pos, app) {
		this.app = app;
		this.key = "box-" + Math.round(Math.random() * 10000);
		this.mesh = B.MeshBuilder.CreateBox(this.key, { width: app.settings.cubeSize, height: app.settings.cubeSize, depth: app.settings.cubeSize }, app.scene);
		this.mesh.position = pos;
		this.mesh.material = new B.StandardMaterial("cube-material", app.scene);
		this.mesh.material.emissiveColor = new B.Color3(0.1, 0.1, 0.1);
		this.animate();
	}
	
	animate() {
		const fr = 1,
			yAnim = new B.Animation("yAnim", "position.y", fr, B.Animation.ANIMATIONTYPE_FLOAT, B.Animation.ANIMATIONLOOPMODE_CYCLE),
			maxY = Math.random() * this.app.settings.offsetY,
			easing = new B.CircleEase();
		
		easing.setEasingMode(B.EasingFunction.EASINGMODE_EASEINOUT);
		yAnim.setEasingFunction(easing);
		
		yAnim.setKeys([
			{
				frame: 0,
				value: this.mesh.position.y,
			},
			{
				frame: fr,
				value: maxY
			},
			{
				frame: 2 * fr,
				value: this.mesh.position.y,
			}
		]);
		
		this.mesh.animations.push(yAnim);
		this.app.scene.beginAnimation(this.mesh, 0, 2 * fr, true);
	}
}

new App();