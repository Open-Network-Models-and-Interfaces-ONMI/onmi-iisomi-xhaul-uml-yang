const mvn = require('maven').create({
      cwd: '../'
    });
    mvn.execute(['clean', 'compile'], { 'skipTests': true }).then(() => {
      console.log("output");
    });
