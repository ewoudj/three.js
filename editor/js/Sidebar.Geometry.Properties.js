Sidebar.Geometry.Properties = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

    var editorType = editorTypes.find( t => t.geometryType == geometry.type);
    var valueControls = [];

    if(editorType.parameters){
        editorType.parameters.forEach(function (param) {
            	var paramRow = new UI.Row();
                var valueControl = new param.control( parameters[param.parameterName] );
                valueControl.onChange( update );
                if(valueControl.setRange && param.rangeStart && param.rangeEnd){
                    valueControl.setRange( param.rangeStart, param.rangeEnd );
                }
                valueControls.push(valueControl);
                paramRow.add( new UI.Text( param.name ).setWidth( '90px' ) );
                paramRow.add( valueControl );
                container.add( paramRow );
        });
    }

    function construct(constructor, args) {
        function F() {
            return constructor.apply(this, args);
        }
        F.prototype = constructor.prototype;
        return new F();
    }

	function update() {
        var constructorArgs = [];
        valueControls.forEach(function (valueControl) {
            constructorArgs.push(valueControl.getValue());
        });
        var newGeometry = new construct(THREE[ geometry.type ], constructorArgs);
		editor.execute( new SetGeometryCommand( object, newGeometry ) );
	}

	return container;

};

