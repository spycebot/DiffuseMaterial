/*
	Inveterate Innovation
*/

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var container; // Mr.doob road minus stats lib
var camera, scene, renderer, raycaster, mesh;
var cameraRig, activeCamera, activeHelper, showHelpers;
var initialCameraHelper, orbitCameraHelper;
var orbitCamera, orthographicCamera, tetrahedron, plane;
//var frustumSize = 600;
var clock = new THREE.Clock();
var mouse = new THREE.Vector2(), INTERSECTED; // https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
var mouseX = 0, mouseY = 0; // https://github.com/mrdoob/three.js/blob/master/examples/canvas_geometry_earth.html#L75


function init(){
	container = document.createElement('div');
	document.body.appendChild(container);
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );
	//var geometry = new THREE.Geometry();
	/*
		https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
	*/
	raycaster = new THREE.Raycaster();
	/*
		Set up renderer
	*/
	renderer = new THREE.WebGLRenderer( { antialias: true , alpha: true} );
	//renderer = new THREE.CanvasRenderer( { alpha: true }); // gradient
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.domElement.style.position = "relative";
	container.appendChild( renderer.domElement );
	//renderer.autoClear = false; // ????
	renderer.setClearColor( 0xffffff, 0 );


	/*
		Respond to device changes
	*/
	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	/*
	document.addEventListener( 'keydown', onKeyDown, false );
	*/

	console.log("Isn't it complete?");
}

function setupCameras() {
	camera = new THREE.PerspectiveCamera( 50, 1, 1, 10000 ); // 0.5 * aspect
	orbitCamera = new THREE.PerspectiveCamera( 75, 0.5 * aspect, 1, 10000 );
	orthographicCamera = new THREE.OrthographicCamera( SCREEN_WIDTH / - 20, SCREEN_WIDTH / 20, SCREEN_HEIGHT / 20, SCREEN_HEIGHT / - 20, 1, 10000 );
	initialCameraHelper = new THREE.CameraHelper( camera );
	scene.add( initialCameraHelper );
	orbitCameraHelper = new THREE.CameraHelper( orbitCamera );
	scene.add( orbitCameraHelper );
	orthographicCameraHelper = new THREE.CameraHelper( orthographicCamera );
	scene.add( orthographicCamera );
	//camera = new THREE.OrthographicCamera( 0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000 );
	camera.position.z = 50;
	camera.position.y = 10;
	orbitCamera.position.z = 50;
	orbitCamera.position.y = 10;
	// cameraInitialHelper, cameraOrbitHelper;
	orthographicCamera.position.y = 40;
	orthographicCamera.position.z = 40;
	orthographicCamera.position.x = -40;
	//orthographicCamera.rotation.z = (Math.PI / 2 , 0, 0);
	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	orbitCamera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();
	orbitCamera.updateProjectionMatrix();

	activeCamera = camera;
	showHelpers = true;
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

	var octahedronGeometry = new THREE.OctahedronGeometry(5,0);
	var octahedron = new THREE.Mesh( octahedronGeometry, material) ;
	octahedron.position.x = 40;
	octahedron.position.y = 5;
	scene.add( octahedron );
	var dodecahedronGeometry = new THREE.DodecahedronGeometry(5,0);
	var dodecahedron = new THREE.Mesh( dodecahedronGeometry, material) ;
	dodecahedron.position.x = 60;
	dodecahedron.position.y = 5;
	scene.add( dodecahedron );
	var icosahedronGeometry = new THREE.IcosahedronGeometry(5,0);
	var icosahedron = new THREE.Mesh( icosahedronGeometry, material) ;
	icosahedron.position.x = 80;
	icosahedron.position.y = 5;
	scene.add( icosahedron );

	console.log("setupScene complete.");
}

function onDocumentMouseMove( event ) {
	event.preventDefault();	// ???
	mouseX = ( event.clientX - window.innerWidth / 2) ; //windowHalfX );
	mouseY = ( event.clientY - window.innerHeight / 2) ; //windowHalfY );
	/*
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	*/
	// console.log("Mouse x,y: " + mouse.x + ", " + mouse.y);
}


function animateObjects() {
	tetrahedron.rotation.y += 0.01
	//camera.position.z += 0.01;
	var r = Date.now() * 0.0001;
	var fudgeDistance = 50;
	orbitCamera.position.x = fudgeDistance * Math.cos( r );
	orbitCamera.position.z = fudgeDistance * Math.sin( r );
	camera.lookAt(tetrahedron.position);
	orbitCamera.lookAt(tetrahedron.position);
	orthographicCamera.lookAt(tetrahedron.position);
}

function onWindowResize(event) {
	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight;
	aspect = SCREEN_WIDTH / SCREEN_HEIGHT;


	$(".guiButton").css({"font-size" : (SCREEN_HEIGHT+SCREEN_WIDTH)/40 });

	renderer.setPixelRatio( window.devicePixelRatio );
	//console.log("Device pixel ratio: " + window.devicePixelRatio);
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
	updateTime();
	/*
		https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
	r.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects(scene.children);
	for (var i = 0; i < intersects.length; i++) {
		console.log("intersects.length: " + intersects.length);
		//intersects[0].object.material.color.set(0xff0000);
	}
	/*
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		console.log("Intersects.length = " + intersects.length + "; INTERSECTED: " + typeof intersects);
		if ( INTERSECTED != intersects[ 0 ].object ) {
			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			INTERSECTED = intersects[ 0 ].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex( 0xff0000 );
		}
	} else {
		if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
		INTERSECTED = null;
	}
	*/
	switch (activeCamera) {
		case camera:
			camera.position.x += ( mouseX - camera.position.x ) * 0.05;
			camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
			if (camera.position.y < 1 )	camera.position.y = 1;
		break;
		case orbitCamera:
		/*
			var r = Date.now() * 0.00001;
			orbitCamera.position.x += ( mouseX - orbitCamera.position.x ) * Math.cos( r );
			orbitCamera.position.y += ( mouseX - orbitCamera.position.y ) * Math.sin( r );
			*/
		break;
		case orthographicCamera:

		break;
		default:

		break;
	}
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

function updateTime() {
	$(function() {
		$("#myTime").text("Time: " + clock.getElapsedTime().toFixed(2));
	});
}

$(function() {
	$('#myGUI').children("#myGUI > h1, #myTime, #cameraButton, #helpersButton").hide();
	$(".guiButton").css({"font-size" : (SCREEN_HEIGHT+SCREEN_WIDTH)/40 }); /* two of two cf. on window resize */
	$("#cameraButton").click(function() {
		//if (activeCamera == orbitCamera ) { activeCamera = camera ; } else { activeCamera = orbitCamera ;}
		console.log("activeCamera: " + activeCamera.isCamera);
		switch (activeCamera) {
			case camera:
				activeCamera = orbitCamera;
			break;
			case orbitCamera:
				activeCamera = orthographicCamera;
				console.log ("Ortho camera position: " + orthographicCamera.position.x.toString() + ", " + orthographicCamera.position.y.toString() + ", " + orthographicCamera.position.z.toString() + "; rotation: " + orthographicCamera.rotation.x.toString() + ", " + orthographicCamera.rotation.y.toString() + ", " + orthographicCamera.rotation.z.toString());
			break;
			case orthographicCamera:
				activeCamera = camera;
			break;
			default: 
				console.log("Correct camera not chosen.")
			break;
		}
		console.log("Switch button pressed.");
	});
	$("#helpersButton").click(function() {
		if (showHelpers) { 
			showHelpers = false; 
			scene.remove(initialCameraHelper);
			scene.remove(orbitCameraHelper);
			scene.remove(orthographicCameraHelper);
		} else { 
			showHelpers = true ;
			scene.add(initialCameraHelper);
			scene.add(orbitCameraHelper);
			scene.add(orthographicCameraHelper);
		}
		console.log("showHelpers set to " + showHelpers.toString());
	})
	$("#guiToggleButton").click(function() { 
		/*
		$("#guiToggleButton").toggle(function(){
			$(this).text("Open Controls");
		}, function() {
			$(this).text("Close Controls");
		});
		*/
		if ($("#guiToggleButton").text() == "Open Controls") $("#guiToggleButton").text("Close Controls")
			else $("#guiToggleButton").text("Open Controls");
		$('#myGUI').children("#myGUI > h1, #myTime, #cameraButton, #helpersButton").slideToggle('fast'); 
	});
	console.log("End of jQuery");

});