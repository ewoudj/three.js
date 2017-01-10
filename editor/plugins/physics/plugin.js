var availablePlugins = availablePlugins || {};
var activePlugins = activePlugins || {};

availablePlugins.Physics =  function(editor, menubar){
    this.editor = editor;
    this.menubar = menubar;
};

availablePlugins.Physics.prototype.onPlayerInit = function( startArgs ){
};

availablePlugins.Physics.prototype.onPlayerStart = function( ){
    var collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    var broadphase = new Ammo.btDbvtBroadphase();
    var solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration );
    this.physicsWorld.setGravity( new Ammo.btVector3( 0, -1, 0 ) );
};

availablePlugins.Physics.prototype.onPlayerUpdate = function( updateArgs ){
    this.geometriesInWorld = this.geometriesInWorld || {};
    var meshes = updateArgs.scene.children;
    meshes.forEach( function( mesh ) { 
        var geometry = mesh.geometry;
        if( geometry && !this.geometriesInWorld[geometry.uuid] && geometry.getPhysicsBody ) { 
            this.physicsWorld.addRigidBody(geometry.getPhysicsBody(mesh));
            this.geometriesInWorld[geometry.uuid] = geometry; 
        } 
    }, this);
    this.physicsWorld.stepSimulation( updateArgs.delta, 10 );
    meshes.forEach( function( mesh ) { 
        var geometry = mesh.geometry;
        if( geometry && geometry.getPhysicsBody ) { 
            var physicsBody = geometry.getPhysicsBody(mesh);
            var motionState = physicsBody.getMotionState();
            if ( motionState ) {
                var worldTransform = new Ammo.btTransform();
                motionState.getWorldTransform( worldTransform );
                var p = worldTransform.getOrigin();
                var q = worldTransform.getRotation();
                mesh.position.set( p.x(), p.y(), p.z() );
                mesh.quaternion.set( q.x(), q.y(), q.z(), q.w() );
            }
        }
    }, this);
};

availablePlugins.Physics.prototype.onPlayerStop = function( ){
    this.geometriesInWorld = null;
    this.physicsWorld = null;
};

THREE.PhysicsBoxGeometry = 	function ( width, height, depth, widthSegments, heightSegments, depthSegments, mass, friction ) {

    THREE.BoxBufferGeometry.call( this, width, height, depth, widthSegments, heightSegments, depthSegments);

    this.type = 'PhysicsBoxGeometry';
    this.isPhysicsType = true;

    this.parameters = {
        width: width,
        height: height,
        depth: depth,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        depthSegments: depthSegments,
        mass: mass,
        friction: friction
    };
};

THREE.PhysicsBoxGeometry.prototype = Object.create( THREE.BoxBufferGeometry.prototype );
THREE.PhysicsBoxGeometry.prototype.constructor = THREE.PhysicsBoxGeometry;

THREE.PhysicsBoxGeometry.prototype.getPhysicsBody = function(mesh){
    if(!this.physicsBody){
        var margin = 0.05;
        var shape = new Ammo.btBoxShape( new Ammo.btVector3( (this.parameters.width * mesh.scale.x) * 0.5, (this.parameters.height * mesh.scale.y) * 0.5, (this.parameters.depth * mesh.scale.z) * 0.5 ) );
        shape.setMargin( margin );

        var localInertia = new Ammo.btVector3( 0, 0, 0 );
        shape.calculateLocalInertia( this.parameters.mass, localInertia );
        
        var transform = new Ammo.btTransform();
        transform.setIdentity();
        var pos = mesh.position;
        transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
        var quat = mesh.quaternion;
        var q = new Ammo.btQuaternion();
		q.setValue( quat.x, quat.y, quat.z, quat.w );
		transform.setRotation( q );
        var motionState = new Ammo.btDefaultMotionState( transform );
        var rbInfo = new Ammo.btRigidBodyConstructionInfo( this.parameters.mass, motionState, shape, localInertia );
        var body = new Ammo.btRigidBody( rbInfo );
        body.setFriction(this.parameters.friction);

        this.physicsBody = body;
    }
    return this.physicsBody;
};


editorTypes.push({
    name: 'Physics box',
    group: 'Mesh',
    geometryType: 'PhysicsBoxGeometry',
    parameters: [{
        parameterName: 'width',
        name: 'Width',
        control: UI.Number
    }, {
        parameterName: 'height',
        name: 'Height',
        control: UI.Number
    }, {
        parameterName: 'depth',
        name: 'Depth',
        control: UI.Number
    }, {
        parameterName: 'widthSegments',
        name: 'Width segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'heightSegments',
        name: 'Height segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'depthSegments',
        name: 'Depth segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'mass',
        name: 'Mass',
        control: UI.Number
    }, {
        parameterName: 'friction',
        name: 'Friction',
        control: UI.Number
    }],
    create: function(){
        var geometry = new THREE.PhysicsBoxGeometry( 1, 1, 1, 0, 0, 0, 1, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

THREE.PhysicsPlaneGeometry = 	function ( width, height, widthSegments, heightSegments, mass, friction ) {

    THREE.PlaneBufferGeometry.call( this, width, height, widthSegments, heightSegments);

    this.type = 'PhysicsPlaneGeometry';
    this.isPhysicsType = true;

    this.parameters = {
        width: width,
        height: height,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        mass: mass,
        friction: friction
    };
};

THREE.PhysicsPlaneGeometry.prototype = Object.create( THREE.BoxBufferGeometry.prototype );
THREE.PhysicsPlaneGeometry.prototype.constructor = THREE.PlaneBufferGeometry;

THREE.PhysicsPlaneGeometry.prototype.getPhysicsBody = function(mesh){
    if(!this.physicsBody){
        var margin = 0.05;
        
        var shape = new Ammo.btBoxShape( new Ammo.btVector3( (this.parameters.width * mesh.scale.x) * 0.5, (this.parameters.height * mesh.scale.y) * 0.5, 0.01 ) );
        shape.setMargin( margin );

        var localInertia = new Ammo.btVector3( 0, 0, 0 );
        shape.calculateLocalInertia( this.parameters.mass, localInertia );

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        var pos = mesh.position;
        transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
        var quat = mesh.quaternion;
        var q = new Ammo.btQuaternion();
		q.setValue( quat.x, quat.y, quat.z, quat.w );
		transform.setRotation( q );
        var motionState = new Ammo.btDefaultMotionState( transform );
        var rbInfo = new Ammo.btRigidBodyConstructionInfo( this.parameters.mass, motionState, shape, localInertia );
        var body = new Ammo.btRigidBody( rbInfo );

        this.physicsBody = body;
    }
    return this.physicsBody;
};

editorTypes.push({
    name: 'Physics plane',
    group: 'Mesh',
    geometryType: 'PhysicsPlaneGeometry',
    parameters: [{
        parameterName: 'width',
        name: 'Width',
        control: UI.Number
    }, {
        parameterName: 'height',
        name: 'Height',
        control: UI.Number
    }, {
        parameterName: 'widthSegments',
        name: 'Width segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'heightSegments',
        name: 'Height segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'mass',
        name: 'Mass',
        control: UI.Number
    }, {
        parameterName: 'friction',
        name: 'Friction',
        control: UI.Number
    }],
    create: function(){
        var geometry = new THREE.PhysicsPlaneGeometry( 2, 2, 0, 0, 0, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

THREE.PhysicsSphereGeometry = 	function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, mass, friction ) {

    THREE.SphereBufferGeometry.call( this, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);

    this.type = 'PhysicsSphereGeometry';
    this.isPhysicsType = true;

    this.parameters = {
        radius: radius,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        phiStart: phiStart,
        phiLength: phiLength,
        thetaStart: thetaStart,
        thetaLength: thetaLength,
        mass: mass,
        friction: friction
    };
};

THREE.PhysicsSphereGeometry.prototype = Object.create( THREE.SphereBufferGeometry.prototype );
THREE.PhysicsSphereGeometry.prototype.constructor = THREE.PhysicsSphereGeometry;

THREE.PhysicsSphereGeometry.prototype.getPhysicsShape = function(mesh){
    var shape = null;
    if(mesh.scale.x == mesh.scale.y && mesh.scale.x == mesh.scale.z){
        shape = new Ammo.btSphereShape( this.parameters.radius * mesh.scale.x );
    }
    else{
        shape = new Ammo.btConvexHullShape();
        var positions = mesh.geometry.attributes.position.array;
        for(var i = 0; i < positions.length; i += 3)
        {
            var pt = new Ammo.btVector3(positions[i] * mesh.scale.x, positions[i+1] * mesh.scale.y, positions[i+2] * mesh.scale.z);
            shape.addPoint(pt);
        }
    }
    return shape;
};

THREE.PhysicsSphereGeometry.prototype.getPhysicsBody = function(mesh){
    if(!this.physicsBody){
        var margin = 0.05;
        var shape = this.getPhysicsShape(mesh);
        shape.setMargin( margin );

        var localInertia = new Ammo.btVector3( 0, 0, 0 );
        shape.calculateLocalInertia( this.parameters.mass, localInertia );

        var transform = new Ammo.btTransform();
        transform.setIdentity();
        var pos = mesh.position;
        transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
        var quat = mesh.quaternion;
        var q = new Ammo.btQuaternion();
		q.setValue( quat.x, quat.y, quat.z, quat.w );
		transform.setRotation( q );
        var motionState = new Ammo.btDefaultMotionState( transform );
        var rbInfo = new Ammo.btRigidBodyConstructionInfo( this.parameters.mass, motionState, shape, localInertia );
        var body = new Ammo.btRigidBody( rbInfo );
        body.setDamping(0, 0);
        this.physicsBody = body;
    }
    return this.physicsBody;
};

editorTypes.push({
    name: 'Physics sphere',
    group: 'Mesh',
    geometryType: 'PhysicsSphereGeometry',
    parameters: [{
        parameterName: 'radius',
        name: 'Radius',
        control: UI.Number
    }, {
        parameterName: 'widthSegments',
        name: 'Width segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'heightSegments',
        name: 'Height segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'phiStart',
        name: 'Phi start',
        control: UI.Number
    }, {
        parameterName: 'phiLength',
        name: 'Phi length',
        control: UI.Number
    }, {
        parameterName: 'thetaStart',
        name: 'Theta start',
        control: UI.Number
    }, {
        parameterName: 'thetaLength',
        name: 'Theta length',
        control: UI.Number
    }, {
        parameterName: 'mass',
        name: 'Mass',
        control: UI.Number
    }, {
        parameterName: 'friction',
        name: 'Friction',
        control: UI.Number
    }],
    create: function(){
        var radius = 1;
		var widthSegments = 32;
		var heightSegments = 16;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;
        var geometry = new THREE.PhysicsSphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, 1, 0.5 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});



