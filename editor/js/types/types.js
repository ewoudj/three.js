var editorTypes = editorTypes || [];

editorTypes.push({
    name: 'Group',
    group: 'Group',
    create: function(){
        return new THREE.Group();;
    }
});

editorTypes.push({
    name: 'Plane',
    group: 'Mesh',
    geometryType: 'PlaneBufferGeometry',
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
    }],
    create: function(){
        var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		var material = new THREE.MeshStandardMaterial();
		var mesh = new THREE.Mesh( geometry, material );
        return mesh;
    }
});

editorTypes.push({
    name: 'Box',
    group: 'Mesh',
    geometryType: 'BoxBufferGeometry',
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
    }],
    create: function(){
        var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'Circle',
    group: 'Mesh',
    geometryType: 'CircleBufferGeometry',
    parameters: [{
        parameterName: 'radius',
        name: 'Radius',
        control: UI.Number
    }, {
        parameterName: 'segments',
        name: 'Segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'thetaStart',
        name: 'Theta start',
        control: UI.Number
    }, {
        parameterName: 'thetaLength',
        name: 'Theta length',
        control: UI.Number
    }],
    create: function(){
        var radius = 1;
		var segments = 32;
		var geometry = new THREE.CircleBufferGeometry( radius, segments );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'Cylinder',
    group: 'Mesh',
    geometryType: 'CylinderBufferGeometry',
    parameters: [{
        parameterName: 'radiusTop',
        name: 'Radius top',
        control: UI.Number
    }, {
        parameterName: 'radiusBottom',
        name: 'Radius bottom',
        control: UI.Number
    }, {
        parameterName: 'height',
        name: 'Height',
        control: UI.Number
    }, {
        parameterName: 'radialSegments',
        name: 'Radial segments',
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
        parameterName: 'openEnded',
        name: 'Open ended',
        control: UI.Checkbox
    }],
    create: function(){
		var radiusTop = 1;
		var radiusBottom = 1;
		var height = 2;
		var radiusSegments = 32;
		var heightSegments = 1;
		var openEnded = false;
		var geometry = new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'Sphere',
    group: 'Mesh',
    geometryType: 'SphereBufferGeometry',
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
    }],
    create: function(){
		var radius = 1;
		var widthSegments = 32;
		var heightSegments = 16;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;
		var geometry = new THREE.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'Icosahedron',
    group: 'Mesh',
    geometryType: 'IcosahedronGeometry',
    parameters: [{
        parameterName: 'radius',
        name: 'Radius',
        control: UI.Number
    }, {
        parameterName: 'detail',
        name: 'Detail',
        control: UI.Integer,
        rangeStart: 0,
        rangeEnd: Infinity
    }],
    create: function(){
		var radius = 1;
		var detail = 2;
		var geometry = new THREE.IcosahedronGeometry( radius, detail );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'Torus',
    group: 'Mesh',
    geometryType: 'TorusBufferGeometry',
    parameters: [{
        parameterName: 'radius',
        name: 'Radius',
        control: UI.Number
    }, {
        parameterName: 'tube',
        name: 'Tube',
        control: UI.Number
    }, {
        parameterName: 'radialSegments',
        name: 'Radial segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'tubularSegments',
        name: 'Tubular segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'arc',
        name: 'Arc',
        control: UI.Number
    }],
    create: function(){
		var radius = 2;
		var tube = 1;
		var radialSegments = 32;
		var tubularSegments = 12;
		var arc = Math.PI * 2;
		var geometry = new THREE.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'TorusKnot',
    group: 'Mesh',
    geometryType: 'TorusKnotBufferGeometry',
    parameters: [{
        parameterName: 'radius',
        name: 'Radius',
        control: UI.Number
    }, {
        parameterName: 'tube',
        name: 'Tube',
        control: UI.Number
    }, {
        parameterName: 'tubularSegments',
        name: 'Tubular segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'radialSegments',
        name: 'Radial segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'p',
        name: 'P',
        control: UI.Number
    }, {
        parameterName: 'q',
        name: 'Q',
        control: UI.Number
    }],
    create: function(){
		var radius = 2;
		var tube = 0.8;
		var tubularSegments = 64;
		var radialSegments = 12;
		var p = 2;
		var q = 3;
		var geometry = new THREE.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

editorTypes.push({
    name: 'Lathe',
    group: 'Mesh',
    geometryType: 'LatheBufferGeometry',
    parameters: [{
        parameterName: 'points',
        name: 'Points',
        control: UI.PointsList
    }, {
        parameterName: 'segments',
        name: 'Segments',
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
    }],
    create: function(){
        var points = [
            new THREE.Vector2( 0, 0 ),
            new THREE.Vector2( 4, 0 ),
            new THREE.Vector2( 3.5, 0.5 ),
            new THREE.Vector2( 1, 0.75 ),
            new THREE.Vector2( 0.8, 1 ),
            new THREE.Vector2( 0.8, 4 ),
            new THREE.Vector2( 1, 4.2 ),
            new THREE.Vector2( 1.4, 4.8 ),
            new THREE.Vector2( 2, 5 ),
            new THREE.Vector2( 2.5, 5.4 ),
            new THREE.Vector2( 3, 12 )
        ];
        var segments = 20;
        var phiStart = 0;
        var phiLength = 2 * Math.PI;

        var geometry = new THREE.LatheBufferGeometry( points, segments, phiStart, phiLength );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } ) );
        return mesh;
    }
});

editorTypes.push({
    name: 'Teapot',
    group: 'Mesh',
    geometryType: 'TeapotBufferGeometry',
    parameters: [{
        parameterName: 'size',
        name: 'Size',
        control: UI.Number
    }, {
        parameterName: 'segments',
        name: 'Segments',
        control: UI.Integer,
        rangeStart: 1,
        rangeEnd: Infinity
    }, {
        parameterName: 'bottom',
        name: 'Bottom',
        control: UI.Checkbox
    }, {
        parameterName: 'lid',
        name: 'Lid',
        control: UI.Checkbox
    }, {
        parameterName: 'body',
        name: 'Body',
        control: UI.Checkbox
    }, {
        parameterName: 'fitLid',
        name: 'Fit lid',
        control: UI.Checkbox
    }, {
        parameterName: 'blinn',
        name: 'Blinn',
        control: UI.Checkbox
    }],
    create: function(){
        var size = 1;
        var segments = 10;
        var bottom = true;
        var lid = true;
        var body = true;
        var fitLid = false;
        var blinn = true;

        var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinn );
        var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
        return mesh;
    }
});

/*
// Teapot

var option = new UI.Row();
option.setClass( 'option' );
option.setTextContent( 'Teapot' );
option.onClick( function () {

    var size = 50;
    var segments = 10;
    var bottom = true;
    var lid = true;
    var body = true;
    var fitLid = false;
    var blinnScale = true;

    var material = new THREE.MeshStandardMaterial();

    var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.name = 'Teapot ' + ( ++ meshCount );

    editor.addObject( mesh );
    editor.select( mesh );

} );
options.add( option );
*/

editorTypes.push({
    name: 'Sprite',
    group: 'Mesh',
    create: function(){
        return new THREE.Sprite( new THREE.SpriteMaterial() );
    }
});

editorTypes.push({
    name: 'PointLight',
    group: 'Light',
    create: function(){
        var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		return new THREE.PointLight( color, intensity, distance );
    }
});

editorTypes.push({
    name: 'SpotLight',
    group: 'Light',
    hasTarget: true,
    create: function(){
		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var angle = Math.PI * 0.1;
		var penumbra = 0;
		var light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
		light.position.set( 5, 10, 7.5 );
        return light;
    }
});

editorTypes.push({
    name: 'DirectionalLight',
    group: 'Light',
    hasTarget: true,
    create: function(){
		var color = 0xffffff;
		var intensity = 1;
		var light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 5, 10, 7.5 );
        return light;
    }
});

editorTypes.push({
    name: 'HemisphereLight',
    group: 'Light',
    create: function(){
		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;
		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.position.set( 0, 10, 0 );
        return light;
    }
});

editorTypes.push({
    name: 'AmbientLight',
    group: 'Light',
    create: function(){
		var color = 0x222222;
		return new THREE.AmbientLight( color );
    }
});

editorTypes.push({
    name: 'PerspectiveCamera',
    group: 'Camera',
    create: function(){
		return new THREE.PerspectiveCamera( 50, 1, 1, 10000 );
    }
});