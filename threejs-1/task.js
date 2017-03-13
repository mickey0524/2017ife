function init() {
	var renderer = new THREE.WebGLRenderer({
		canvas: document.getElementById('myCanvas'),
		antialias: true,
		precision: "highp"
	});

	renderer.setClearColor(0x666666);

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, 4 / 3, 1, 1000);
	camera.position.set(10, 4, 9);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	var cube = new THREE.Mesh(new THREE.CubeGeometry(8, 4, 4),
		new THREE.MeshPhongMaterial({
			color: 0xD2D2D2
	
		})
	);
	scene.add(cube);

	var torus_1 = new THREE.Mesh(new THREE.TorusGeometry(4 / 5,  1 / 3, 12, 18),
		new THREE.MeshBasicMaterial({
			color: 0xD2D2D2
		}));
	scene.add(torus_1);
	torus_1.position.set(9 / 5, -2, 2);

	var torus_2 = new THREE.Mesh(new THREE.TorusGeometry(2 / 3, 1 / 5, 12, 18),
		new THREE.MeshBasicMaterial({
			color: 0xD2D2D2
		}));
	scene.add(torus_2);
	torus_2.position.set(3 / 2, -1 / 3, 3.8);

	var ambientLight = new THREE.AmbientLight(0x666666);   // 添加环境光
	scene.add(ambientLight);
	var directionalLight = new THREE.DirectionalLight(0x989898);  // 添加平行光
	directionalLight.position.set(4, 4, 5);   // 设置平行光光源位置
	scene.add(directionalLight);	
	
	renderer.render(scene, camera);
}