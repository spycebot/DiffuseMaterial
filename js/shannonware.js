/*
	Inveterate
*/

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var container; // Mr.doob road minus stats lib
var camera, scene, renderer, mesh;
var cameraRig, activeCamera, activeHelper;
var initialCameraHelper, orbitCameraHelper;
var orbitCamera, tetrahedron, plane;
//var frustumSize = 600;
var clock = new THREE.Clock();


function init(){
	container = document.createElement('div');
	document.body.appendChild(container);
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
	//var geometry = new THREE.Geometry();
	/*
		Set up renderer
	*/
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";
	container.appendChild( renderer.domElement );
	//renderer.autoClear = false; // ????
	renderer.setClearColor( 0xffffff, 1.0 );


	/*
		Respond to device changes
	*/
	window.addEventListener( 'resize', onWindowResize, false );
	/*
	document.addEventListener( 'keydown', onKeyDown, false );
	*/

	console.log("Isn't it complete?");
}

function setupCameras() {
	camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
	orbitCamera = new THREE.PerspectiveCamera( 75, 0.5 * aspect, 1, 10000 );
	initialCameraHelper = new THREE.CameraHelper( camera );
	scene.add( initialCameraHelper );
	orbitCameraHelper = new THREE.CameraHelper( orbitCamera );
	scene.add( orbitCameraHelper );
	//camera = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000 );
	camera.position.z = 50;
	camera.position.y = 10;
	orbitCamera.position.z = 50;
	orbitCamera.position.y = 10;
	// cameraInitialHelper, cameraOrbitHelper;

	activeCamera = camera;
	//activeHelper = cameraPerspectiveHelper;
	//camera.lookAt(tetrahedron.position);
	console.log("setupCameras complete.");
}

function setupScene() {
	/*
		Lights
	*/
	ambientLight = new THREE.AmbientLight( 0x404040 );

	light = new THREE.DirectionalLight( 0xffffff, 0.7 );
	light.position.set( -800, 900, 300 );
	scene.add( ambientLight );
	scene.add( light );

	/*
		Geometry
	*/
	/*
		Tetrahedron	Cube		Octahedron	Dodecahedron	Icosahedron
		Four faces	Six faces	Eight faces	Twelve faces	Twenty faces
	*/
	var geometry = new THREE.TetrahedronGeometry( 10 );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff , wireframe: false }); //0x00ff00 } );
	var ka = 0.2;
	//material.ambient.setRGB(material.color.r * ka, material.color.g * ka, material.color.b * ka );
	material.ambient = new THREE.Color(0.5, 0.5, 0.5);
	tetrahedron = new THREE.Mesh( geometry, material );
	tetrahedron.position.y = 6;
	scene.add( tetrahedron );

	var planeGeometry = new THREE.PlaneGeometry( 1000, 1000, 16 );
	var planeMaterial = new THREE.MeshLambertMaterial( {color: 0x6aaa03, side: THREE.DoubleSide, wireframe: false } );
	plane = new THREE.Mesh( planeGeometry, planeMaterial );
	scene.add( plane );
	plane.rotation.x = Math.PI / 2;
	//plane.position.y = -2;

	var cubeGeometry = new THREE.BoxGeometry(10, 10, 10);
	var cube = new THREE.Mesh( cubeGeometry, material) ;
	scene.add(cube);
	cube.position.x = 20;
	cube.position.y = 5;

	var octahedronGeometry = new THREE.OctahedronGeometry(10,0);
	var octahedron = new THREE.Mesh( octahedronGeometry, material) ;
	octahedron.position.x = 40;
	octahedron.position.y = 5;
	scene.add( octahedron );
	var dodecahedronGeometry = new THREE.DodecahedronGeometry(10,0);
	var dodecahedron = new THREE.Mesh( dodecahedronGeometry, material) ;
	dodecahedron.position.x = 60;
	dodecahedron.position.y = 5;
	scene.add( dodecahedron );
	var icosahedronGeometry = new THREE.IcosahedronGeometry(10,0);
	var icosahedron = new THREE.Mesh( icosahedronGeometry, material) ;
	icosahedron.position.x = 80;
	icosahedron.position.y = 5;
	scene.add( icosahedron );

	console.log("setupScene complete.");
}

function animateObjects() {
	tetrahedron.rotation.y += 0.01
	//camera.position.z += 0.01;
	var r = Date.now() * 0.00001;
	var fudgeDistance = 50;
	orbitCamera.position.x = fudgeDistance * Math.cos( r );
	orbitCamera.position.z = fudgeDistance * Math.sin( r );
	orbitCamera.lookAt(tetrahedron.position);
}

function onWindowResize(event) {
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	renderer.setPixelRatio( window.devicePixelRatio );
	console.log("Device pixel ratio: " + window.devicePixelRatio);
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	camera.aspect = aspect ; //0.5 * aspect;
	/* */
	camera.updateProjectionMatrix();
	/*
	perspectiveCamera.aspect = 0.5 * aspect;
	perspectiveCamera.updateProjectionMatrix();
	*/
}

function render(){
	/*
		Start with this
	*/
	requestAnimationFrame( render );
	animateObjects();
	executeJQuery();
	/*
		Conform to this
	*/
	renderer.setViewport( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.render( scene, activeCamera );
	/*
	perspectiveCamera.lookAt(tetrahedron.position);
	/
	camera.lookAt(perspectiveCamera.position);
	renderer.setViewport( SCREEN_WIDTH/2, 0, SCREEN_WIDTH/2, SCREEN_HEIGHT );
	renderer.render( scene, camera );
	*/
}

try {
  init();
  setupCameras();
  setupScene();
  render();

	console.log("End of try block.");
} catch(e) {
    var errorReport = "Your program encountered an unrecoverable error, can not draw on canvas. Error was:<br/><br/>";
    $('#container').append(errorReport+e);

	console.log("End of catch block. Error? "+errorReport);
}

function executeJQuery() {
	$(function() {
		$("#myTime").text("Time: " + clock.getElapsedTime().toFixed(2));
	});
}

$(function() {
	$("#cameraButton").click(function() {
		if (activeCamera == orbitCamera ) { activeCamera = camera ; } else { activeCamera = orbitCamera ;}
		console.log("Switch button pressed.");
	})
	console.log("End of jQuery");

});