if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

var fs = require('fs');
var path = require('path');
var replaceing = require('./post-processing/find-replace.json');
var rootLists = require('./post-processing/root-lists.json')['root-lists'];

var whiteList = ['core-model.yang'];
var extension = '.yang';

var folder = './project';
if (process.argv.length > 2) {
    folder = process.argv[2];
}

var save = function (filename, string) {
    fs.writeFile(filename, string, function (error) {
        if (error) throw error;
    });
};

var getRevision = function (data) {
    var find = 'revision ';
    var revisionFormat = 'yyyy-mm-dd';
    var start = data.indexOf(find) + find.length;
    return data.slice(start, start + revisionFormat.length);
};

var postProcess = function (filename) {
    var addToYang = [__dirname, 'post-processing', 'add-partial.yang'].join('/');
    var add = fs.readFileSync(addToYang, 'utf8');
    var format = ['  list {0} {', '    key "{1}";', '    uses {2};','    description', '      "{3}";', '  }', ''].join('\n');
    Object.keys(rootLists).map(function (item) {
        var key = rootLists[item].key || 'uuid';
        var uses = rootLists[item].uses || item + '-g';
        var desciption = rootLists[item].desciption || 'none';
        var yangList = format.format(item, key, uses, desciption);
        add += yangList;
    });

    fs.readFile(filename, 'utf8', function (error, data) {
        if (error) throw error;
        var revision = getRevision(data);
        var newFilename = [filename.slice(0, filename.length - extension.length), '@', revision, extension].join('');

        // replace leaf references
        Object.keys(replaceing).map(function (find) {
            var regex = new RegExp(find, 'g');
            data = data.replace(regex, replaceing[find]);
        });

        // add yang root elements at the end
        var pos = data.lastIndexOf('}');
        data = [data.slice(0, pos), add, data.slice(pos)].join('\n');

        save(newFilename, data);
    });
};

var scanFolder = function (startPath, filter) {

    if (!fs.existsSync(startPath)) {
        console.info("Is not a directory:", startPath);
        return;
    }

    var files = fs.readdirSync(startPath)
        .filter(function (file) {
            return file.slice(-filter.length) === filter && whiteList.indexOf(file) > -1;
        })
        .map(function (file) {
            var filename = [__dirname, startPath, file].join('/');
            postProcess(filename);
        });
};
scanFolder(folder, extension);