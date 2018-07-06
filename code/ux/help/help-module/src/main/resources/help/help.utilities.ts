export var resolvePath = function (...paths: string[]): string {
  console.log(paths);
  function resolve(pathA, pathB) {
    //  ‘a’     => ['a']
    //  'a/b'   => ['a', 'b']
    //  '/a/b'  => ['', 'a', 'b']
    //  '/a/b/' => ['', 'a', 'b', '']
    pathB = pathB.split('/');
    if (pathB[0] === '') {
      return pathB.join('/');
    }
    pathA = pathA.split('/');
    var aLastIndex = pathA.length - 1;
    if (pathA[aLastIndex] !== '') {
      pathA[aLastIndex] = '';
    }

    var part;
    var i = 0;
    while (typeof (part = pathB[i]) === 'string') {
      switch (part) {
        case '..':
          pathA.pop();
          pathA.pop();
          pathA.push('');
          break;
        case '.':
          pathA.pop();
          pathA.push('');
          break;
        default:
          pathA.pop();
          pathA.push(part);
          pathA.push('');
          break;
      }
      i++;
    }
    if (pathB[pathB.length - 1] !== '') pathA.pop(); 
    return pathA.join('/');
  }

  var i = 0;
  var path;
  var r = location.pathname;

  const urlRegex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i;
  const multiSlashReg = /\/\/+/g;

  while (typeof (path = paths[i]) === 'string') {
    // debugger;
    const matches = path && path.match(urlRegex);
    if (matches || !i) {
      r = path;
    } else {
      path = path.replace(multiSlashReg, '/');
      r = resolve(r, path);
    }
    i++;
  }

  return r;
};