var stealTools = require( "steal-tools" );

stealTools.export( {
  steal: {
    config: __dirname + "/package.json!npm"
  },
  outputs: {
    "+cjs": {},
    "+amd": {},
    "+global-js": {}
  }
} )
  .then(function() {
    return stealTools.export( {
      steal: {
        main: 'test/test',
        config: __dirname + "/package.json!npm"
      },
      options: {
        ignoreAllDependencies: true,
        format: 'cjs',
        sourceMaps: true
      },
      outputs: {
        "test": {
          modules: ['test/test'],
          dest: function(){
            return __dirname + '/dist/test/test.js';
          },
          format: 'cjs'
        }
      }
    } );
  })
  .catch( function( e ) {

    setTimeout( function() {
      throw e;
    }, 1 );

  } );
