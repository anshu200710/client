const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./app');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace font weights with Poppins font families
    content = content.replace(/fontWeight:\s*["']500["']/g, 'fontFamily: "Poppins_500Medium"');
    content = content.replace(/fontWeight:\s*["']600["']/g, 'fontFamily: "Poppins_600SemiBold"');
    content = content.replace(/fontWeight:\s*["']700["']/g, 'fontFamily: "Poppins_700Bold"');
    content = content.replace(/fontWeight:\s*["']800["']/g, 'fontFamily: "Poppins_800ExtraBold"');
    content = content.replace(/fontWeight:\s*["']900["']/g, 'fontFamily: "Poppins_800ExtraBold"');
    content = content.replace(/fontWeight:\s*["']bold["']/g, 'fontFamily: "Poppins_700Bold"');

    // Make sure title fontSize is 28 in signup.tsx
    if (file.endsWith('signup.tsx')) {
        content = content.replace(/fontSize:\s*26/, 'fontSize: 28');
    }

    fs.writeFileSync(file, content);
});

console.log('Fonts updated successfully');
