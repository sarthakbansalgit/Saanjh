const fs = require('fs');

let signupCode = fs.readFileSync('src/components/Signup.jsx', 'utf8');
const styleMatch = signupCode.match(/<style>\{`([\s\S]+?)`\}<\/style>/);

if (styleMatch) {
  const cssStyles = styleMatch[1];
  
  // Append to index.css
  let indexCss = fs.readFileSync('src/index.css', 'utf8');
  if (!indexCss.includes('.sp-page {')) {
      fs.appendFileSync('src/index.css', '\n/* Signup Scoped CSS */\n' + cssStyles);
  }
  
  // Remove from Signup.jsx
  signupCode = signupCode.replace(/\{\/\* Inline styles[^\n]*\n\s*<style>\{`[\s\S]+?`\}<\/style>/, '');
  fs.writeFileSync('src/components/Signup.jsx', signupCode);
  console.log('Successfully moved styles out of Signup.jsx to index.css');
} else {
  console.log('Style block not found.');
}
