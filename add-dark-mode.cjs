const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /bg-white(?!\s+dark:)/g, replace: 'bg-white dark:bg-slate-800' },
  { regex: /bg-slate-50(?!\s*\/|\s+dark:)/g, replace: 'bg-slate-50 dark:bg-slate-900/50' },
  { regex: /bg-slate-100(?!\s*\/|\s+dark:)/g, replace: 'bg-slate-100 dark:bg-slate-800/80' },
  // Texts
  { regex: /text-slate-900(?!\s+dark:)/g, replace: 'text-slate-900 dark:text-white' },
  { regex: /text-slate-800(?!\s+dark:)/g, replace: 'text-slate-800 dark:text-slate-100' },
  { regex: /text-slate-700(?!\s+dark:)/g, replace: 'text-slate-700 dark:text-slate-200' },
  { regex: /text-slate-600(?!\s+dark:)/g, replace: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-500(?!\s+dark:)/g, replace: 'text-slate-500 dark:text-slate-400' },
  { regex: /text-slate-400(?!\s+dark:)/g, replace: 'text-slate-400 dark:text-slate-500' },
  // Borders
  { regex: /border-slate-100(?!\s*\/|\s+dark:)/g, replace: 'border-slate-100 dark:border-slate-700' },
  { regex: /border-slate-200(?!\s*\/|\s+dark:)/g, replace: 'border-slate-200 dark:border-slate-700' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log('Done.');
