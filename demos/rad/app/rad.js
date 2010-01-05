// TO RUN: ./nodejuice demos/rad
// 
// OPEN: http://localhost:8080/

// rad() with template
rad ( /^\/$/, {
    file : '/static/template.htm',
    url  : '/test-url',
    text : 'click this link!'
} );

// rad() with text
rad ( /^\/?test.*/, 'you made it! Press Back Button.' )

// rad() with spcial template
rad ( /special/, 'This is a secret, pffff.' )
