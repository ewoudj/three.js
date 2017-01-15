(function(){
    var ZERO_QUATERNION = new THREE.Quaternion(0, 0, 0, 1);

    var wheelIndex = {
        FRONT_LEFT : 0,
        FRONT_RIGHT : 1,
        BACK_LEFT : 2,
        BACK_RIGHT : 3
    };

    THREE.PhysicsVehicle = 	function (chassisWidth, chassisHeight, chassisLength, mass, wheelAxisPositionBack, wheelRadiusBack, wheelWidthBack, wheelHalfTrackBack, wheelAxisHeightBack, 
                wheelAxisFrontPosition, wheelHalfTrackFront, wheelAxisHeightFront, wheelRadiusFront, wheelWidthFront, friction, suspensionStiffness, suspensionDamping,
                suspensionCompression, suspensionRestLength, rollInfluence, steeringIncrement, steeringClamp, maxEngineForce, maxBreakingForce) {

        THREE.Object3D.call( this );

        this.type = 'PhysicsVehicle';

        this.engineForce = 0;
        this.vehicleSteering = 0;
        this.breakingForce = 0;

        this.parameters = {
            chassisWidth : chassisWidth,
            chassisHeight : chassisHeight,
            chassisLength : chassisLength,
            mass: mass,
            wheelAxisPositionBack : wheelAxisPositionBack,
            wheelRadiusBack : wheelRadiusBack,
            wheelWidthBack : wheelWidthBack,
            wheelHalfTrackBack : wheelHalfTrackBack,
            wheelAxisHeightBack : wheelAxisHeightBack,
            wheelAxisFrontPosition : wheelAxisFrontPosition,
            wheelHalfTrackFront : wheelHalfTrackFront,
            wheelAxisHeightFront : wheelAxisHeightFront,
            wheelRadiusFront : wheelRadiusFront,
            wheelWidthFront : wheelWidthFront,
            friction : friction,
            suspensionStiffness : suspensionStiffness,
            suspensionDamping : suspensionDamping,
            suspensionCompression : suspensionCompression,
            suspensionRestLength : suspensionRestLength,
            rollInfluence : rollInfluence,
            steeringIncrement : steeringIncrement,
            steeringClamp : steeringClamp,
            maxEngineForce : maxEngineForce,
            maxBreakingForce : maxBreakingForce
        };
    };

    THREE.PhysicsVehicle.prototype = Object.create( THREE.Object3D.prototype );
    THREE.PhysicsVehicle.prototype.constructor = THREE.PhysicsVehicle;

    THREE.PhysicsVehicle.prototype.addToWorld = function(world){
        
        var p = this.parameters;
        var self = this;

        // Chassis
        var geometry = new Ammo.btBoxShape( new Ammo.btVector3( p.chassisWidth * .5, p.chassisHeight * .5, p.chassisLength * .5 ) );
        var transform = new Ammo.btTransform( );
        transform.setIdentity( );
        transform.setOrigin(new Ammo.btVector3( this.position.x, this.position.y, this.position.z ) );
        transform.setRotation(new Ammo.btQuaternion( this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w ) );
        var motionState = new Ammo.btDefaultMotionState( transform );
        var localInertia = new Ammo.btVector3( 0, 0, 0 );
        geometry.calculateLocalInertia( p.mass, localInertia );
        var body = new Ammo.btRigidBody( new Ammo.btRigidBodyConstructionInfo( p.mass, motionState, geometry, localInertia ) );
        body.setActivationState( bodyActivationState.DISABLE_DEACTIVATION );
        world.addRigidBody( body );
        
        // Raycast Vehicle
        var tuning = new Ammo.btVehicleTuning( );
        var rayCaster = new Ammo.btDefaultVehicleRaycaster( world );
        this.vehicle = new Ammo.btRaycastVehicle( tuning, body, rayCaster );
        this.vehicle.setCoordinateSystem( 0, 1, 2 );
        world.addAction( this.vehicle );

        var wheelDirectionCS0 = new Ammo.btVector3( 0, -1, 0 );
        var wheelAxleCS = new Ammo.btVector3( -1, 0, 0 );
        function addWheelBody( isFront, pos, radius ) {
            var wheelInfo = self.vehicle.addWheel(
                    pos,
                    wheelDirectionCS0,
                    wheelAxleCS,
                    p.suspensionRestLength,
                    radius,
                    tuning,
                    isFront);
            wheelInfo.set_m_suspensionStiffness( p.suspensionStiffness );
            wheelInfo.set_m_wheelsDampingRelaxation( p.suspensionDamping );
            wheelInfo.set_m_wheelsDampingCompression( p.suspensionCompression );
            wheelInfo.set_m_frictionSlip( p.friction );
            wheelInfo.set_m_rollInfluence( p.rollInfluence );
        }
        addWheelBody(true, new Ammo.btVector3(p.wheelHalfTrackFront, p.wheelAxisHeightFront, p.wheelAxisFrontPosition), p.wheelRadiusFront);
        addWheelBody(true, new Ammo.btVector3(-p.wheelHalfTrackFront, p.wheelAxisHeightFront, p.wheelAxisFrontPosition), p.wheelRadiusFront);
        addWheelBody(false, new Ammo.btVector3(-p.wheelHalfTrackBack, p.wheelAxisHeightBack, p.wheelAxisPositionBack), p.wheelRadiusBack);
        addWheelBody(false, new Ammo.btVector3(p.wheelHalfTrackBack, p.wheelAxisHeightBack, p.wheelAxisPositionBack), p.wheelRadiusBack);
        this.position.set(0, 0, 0);
        this.quaternion.set(0, 0, 0, 1);
    };

    THREE.PhysicsVehicle.prototype.updateWorld = function( deltaTime ){
        this.parent.updateMatrixWorld();
        var speed = 10;//this.vehicle.getCurrentSpeedKmHour();
        this.breakingForce = 0;
        this.engineForce = 100; //0;
        /*if (actions.acceleration) {
            if (speed < -1)
                breakingForce = maxBreakingForce;
            else engineForce = maxEngineForce;
        }
        if (actions.braking) {
            if (speed > 1)
                breakingForce = maxBreakingForce;
            else engineForce = -maxEngineForce / 2;
        }
        if (actions.left) {
            if (vehicleSteering < steeringClamp)
                vehicleSteering += steeringIncrement;
        }
        else {
            if (actions.right) {
                if (vehicleSteering > -steeringClamp)
                    vehicleSteering -= steeringIncrement;
            }
            else {
                if (vehicleSteering < -steeringIncrement)
                    vehicleSteering += steeringIncrement;
                else {
                    if (vehicleSteering > steeringIncrement)
                        vehicleSteering -= steeringIncrement;
                    else {
                        vehicleSteering = 0;
                    }
                }
            }
        }*/
        this.vehicle.applyEngineForce(this.engineForce, wheelIndex.BACK_LEFT);
        this.vehicle.applyEngineForce(this.engineForce, wheelIndex.BACK_RIGHT);
        this.vehicle.setBrake(this.breakingForce / 2, wheelIndex.FRONT_LEFT);
        this.vehicle.setBrake(this.breakingForce / 2, wheelIndex.FRONT_RIGHT);
        this.vehicle.setBrake(this.breakingForce, wheelIndex.BACK_LEFT);
        this.vehicle.setBrake(this.breakingForce, wheelIndex.BACK_RIGHT);
        this.vehicle.setSteeringValue(this.vehicleSteering, wheelIndex.FRONT_LEFT);
        this.vehicle.setSteeringValue(this.vehicleSteering, wheelIndex.FRONT_RIGHT);

        var scene = this.parent;
        var chassisMesh = this.children[0];
        var wheelMeshes = [this.children[1], this.children[2], this.children[3], this.children[4]];

        var tm, p, q, i;
        var n = this.vehicle.getNumWheels();
        for (i = 0; i < n; i++) {
            this.vehicle.updateWheelTransform(i, true);
            tm = this.vehicle.getWheelTransformWS(i);
            p = tm.getOrigin();
            q = tm.getRotation();
            wheelMeshes[i].position.set(p.x(), p.y(), p.z());
            wheelMeshes[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
            wheelMeshes[i].rotateZ( Math.PI / 2 );
        }
        tm = this.vehicle.getChassisWorldTransform();
        p = tm.getOrigin();
        q = tm.getRotation();
        chassisMesh.position.set(p.x(), p.y(), p.z());
        chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());

    };

    editorTypes.push({
        name: 'Physics vehicle',
        group: 'Mesh',
        geometryType: 'PhysicsVehicle',
        parameters: [{
            parameterName: 'chassisWidth',
            name: 'chassisWidth',
            control: UI.Number
        }, {
            parameterName: 'chassisHeight',
            name: 'chassisHeight',
            control: UI.Number
        }, {
            parameterName: 'chassisLength',
            name: 'chassisLength',
            control: UI.Number
        }, {
            parameterName: 'mass',
            name: 'mass',
            control: UI.Number
        }, {
            parameterName: 'wheelAxisPositionBack',
            name: 'wheelAxisPositionBack',
            control: UI.Number
        }, {
            parameterName: 'wheelRadiusBack',
            name: 'wheelRadiusBack',
            control: UI.Number
        }, {
            parameterName: 'wheelWidthBack',
            name: 'wheelWidthBack',
            control: UI.Number
        }, {
            parameterName: 'wheelHalfTrackBack',
            name: 'wheelHalfTrackBack',
            control: UI.Number
        }, {
            parameterName: 'wheelAxisHeightBack',
            name: 'wheelAxisHeightBack',
            control: UI.Number
        }, {
            parameterName: 'wheelAxisFrontPosition',
            name: 'wheelAxisFrontPosition',
            control: UI.Number
        }, {
            parameterName: 'wheelHalfTrackFront',
            name: 'wheelHalfTrackFront',
            control: UI.Number
        }, {
            parameterName: 'wheelAxisHeightFront',
            name: 'wheelAxisHeightFront',
            control: UI.Number
        }, {
            parameterName: 'wheelRadiusFront',
            name: 'wheelRadiusFront',
            control: UI.Number
        }, {
            parameterName: 'wheelWidthFront',
            name: 'wheelWidthFront',
            control: UI.Number
        }, {
            parameterName: 'friction',
            name: 'friction',
            control: UI.Number
        }, {
            parameterName: 'suspensionStiffness',
            name: 'suspensionStiffness',
            control: UI.Number
        }, {
            parameterName: 'suspensionDamping',
            name: 'suspensionDamping',
            control: UI.Number
        }, {
            parameterName: 'suspensionCompression',
            name: 'suspensionCompression',
            control: UI.Number
        }, {
            parameterName: 'suspensionRestLength',
            name: 'suspensionRestLength',
            control: UI.Number
        }, {
            parameterName: 'rollInfluence',
            name: 'rollInfluence',
            control: UI.Number
        }, {
            parameterName: 'steeringIncrement',
            name: 'steeringIncrement',
            control: UI.Number
        }, {
            parameterName: 'steeringClamp',
            name: 'steeringClamp',
            control: UI.Number
        }, {
            parameterName: 'maxEngineForce',
            name: 'maxEngineForce',
            control: UI.Number
        }, {
            parameterName: 'maxBreakingForce',
            name: 'maxBreakingForce',
            control: UI.Number
        }],
        create: function(){
            var chassisWidth = 1.8; 
            var chassisHeight = .6; 
            var chassisLength = 4; 
            var mass = 800; 
            var wheelAxisPositionBack = -1; 
            var wheelRadiusBack = .4; 
            var wheelWidthBack = .3; 
            var wheelHalfTrackBack = 1; 
            var wheelAxisHeightBack = .3; 
            var wheelAxisFrontPosition = 1.7; 
            var wheelHalfTrackFront = 1; 
            var wheelAxisHeightFront = .3; 
            var wheelRadiusFront = .35; 
            var wheelWidthFront = .2; 
            var friction = 1000; 
            var suspensionStiffness = 20.0; 
            var suspensionDamping = 2.3; 
            var suspensionCompression = 4.4; 
            var suspensionRestLength = 0.6; 
            var rollInfluence = 0.2; 
            var steeringIncrement = .04; 
            var steeringClamp = .5; 
            var maxEngineForce = 2000; 
            var maxBreakingForce = 100
            
            var vehicle = new THREE.PhysicsVehicle( 
                chassisWidth, chassisHeight, chassisLength, mass, wheelAxisPositionBack, wheelRadiusBack, wheelWidthBack, wheelHalfTrackBack, wheelAxisHeightBack, 
                wheelAxisFrontPosition, wheelHalfTrackFront, wheelAxisHeightFront, wheelRadiusFront, wheelWidthFront, friction, suspensionStiffness, suspensionDamping,
                suspensionCompression, suspensionRestLength, rollInfluence, steeringIncrement, steeringClamp, maxEngineForce, maxBreakingForce 
            );

            // Mesh for Chassis
            var shape = new THREE.BoxGeometry( chassisWidth, chassisHeight, chassisLength , 1, 1, 1 );
            var chassisMesh = new THREE.Mesh( shape, new THREE.MeshStandardMaterial( ) );
            chassisMesh.name = 'Chassis';
            chassisMesh.position.set(0, ((wheelAxisHeightBack + wheelAxisHeightFront) / 2) + suspensionRestLength, 0);
            //chassisMesh.quaternion.set( vehicle.quaternion.x, vehicle.quaternion.y, vehicle.quaternion.z, vehicle.quaternion.w );
            vehicle.add( chassisMesh );

            // Meshes fot the wheels
            var wheelMeshes = [];
            function addWheelMesh( pos, radius, width, index ) {
                var cylinderGeometry = new THREE.CylinderGeometry( radius, radius, width, 24, 1 );
                var mesh = new THREE.Mesh( cylinderGeometry, new THREE.MeshStandardMaterial() );
                mesh.add( new THREE.Mesh( new THREE.BoxGeometry( width * 1.5, radius * 1.75, radius*.25, 1, 1, 1), new THREE.MeshStandardMaterial( ) ) );
                vehicle.add( mesh );
                mesh.name = "Wheel " + index;
                mesh.position.set( pos.x, pos.y, pos.z );
                mesh.rotateZ( Math.PI / 2 );
                //mesh.quaternion.set( vehicle.quaternion.x, vehicle.quaternion.y, vehicle.quaternion.z, vehicle.quaternion.w );
                wheelMeshes[index] = mesh;
            }
            addWheelMesh( new THREE.Vector3(wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, wheelIndex.FRONT_LEFT);
            addWheelMesh( new THREE.Vector3(-wheelHalfTrackFront, wheelAxisHeightFront, wheelAxisFrontPosition), wheelRadiusFront, wheelWidthFront, wheelIndex.FRONT_RIGHT);
            addWheelMesh( new THREE.Vector3(-wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, wheelIndex.BACK_LEFT);
            addWheelMesh( new THREE.Vector3(wheelHalfTrackBack, wheelAxisHeightBack, wheelAxisPositionBack), wheelRadiusBack, wheelWidthBack, wheelIndex.BACK_RIGHT);

            return vehicle;
        }
    });
})();