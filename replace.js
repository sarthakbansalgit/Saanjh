const fs = require('fs');

const walkSync = function (dir, filelist) {
    let files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            if (file !== 'node_modules' && file !== 'build') {
                filelist = walkSync(dir + '/' + file, filelist);
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                filelist.push(dir + '/' + file);
            }
        }
    });
    return filelist;
};

const files = walkSync('./src');
let changed = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('http://localhost:5001') && !file.includes('api.js')) {
        let newContent = content;

        if (!newContent.includes('import API from')) {
            const depth = file.split('/').length - 3;
            const prefix = depth === 0 ? './' : '../'.repeat(depth);
            newContent = `import API from '${prefix}api';\n` + newContent;
        }

        newContent = newContent.replace(/'http:\/\/localhost:5001\/([^']+)'/g, '`${API}/$1`');
        newContent = newContent.replace(/"http:\/\/localhost:5001\/([^"]+)"/g, '`${API}/$1`');
        newContent = newContent.replace(/`http:\/\/localhost:5001\/([^`]+)`/g, '`${API}/$1`');
        newContent = newContent.replace(/'http:\/\/localhost:5001'/g, 'API');
        newContent = newContent.replace(/"http:\/\/localhost:5001"/g, 'API');
        newContent = newContent.replace(/`http:\/\/localhost:5001`/g, 'API');

        fs.writeFileSync(file, newContent);
        changed++;
        console.log(`Updated ${file}`);
    }
});
console.log(`Total changed files: ${changed}`);
