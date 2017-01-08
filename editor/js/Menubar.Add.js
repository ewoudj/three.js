/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Add' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var typesCount = {};

	editor.signals.editorCleared.add( function () {
		typesCount = {};
	} );

	var createEditorTypeMenuItem = function(editorType){
		var option = new UI.Row();
		option.setClass( 'option' );
		option.setTextContent( editorType.name );
		option.onClick( function () {
			if(!typesCount[editorType.name]){
				typesCount[editorType.name] = 0;
			}
			var instance = editorType.create();
			instance.name = editorType.name + ' ' + ( ++typesCount[editorType.name] );
			if(editorType.hasTarget){
				instance.target.name = editorType.name + ' ' + typesCount[editorType.name] + ' Target';
			}
			editor.execute( new AddObjectCommand( instance ) );
		} );
		options.add( option );
	};

	for(var i = 0; i < editorTypes.length; i++){
		if(i > 0 && editorTypes[i - 1].group != editorTypes[i].group){
			options.add( new UI.HorizontalRule() );
		}
		createEditorTypeMenuItem(editorTypes[i]);
	}

	return container;

};
