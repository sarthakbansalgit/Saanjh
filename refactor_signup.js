const fs = require('fs');
let code = fs.readFileSync('src/components/Signup.jsx', 'utf8');

// Remove definitions
code = code.replace(/const Err = [\s\S]*?: null;/g, '');
code = code.replace(/const Select = [\s\S]*?\);\n/g, '');
code = code.replace(/const Input = [\s\S]*?\);\n/g, '');
code = code.replace(/const Field = [\s\S]*?\);\n/g, '');

// Process Input fields
code = code.replace(/<Field errors={errors} name="([^"]+)" label="([^"]+)">\s*<Input udetails={udetails} handleChange={handleChange} name="\1"([^>]+)\/>\s*<\/Field>/g, (match, name, label, rest) => {
  return `<div className="sp-field">
                    <label className="sp-label">${label}</label>
                    <input
                      name="${name}"
                      value={udetails['${name}']}
                      onChange={handleChange}
                      className="sp-input"
                      autoComplete="off"${rest}/>
                    {errors && errors['${name}'] && <span className="sp-error">{errors['${name}']}</span>}
                  </div>`;
});

// Process Select fields
code = code.replace(/<Field errors={errors} name="([^"]+)" label="([^"]+)">\s*<Select udetails={udetails} handleChange={handleChange} name="\1"([\s\S]*?)>\s*([\s\S]*?)<\/Select>\s*<\/Field>/g, (match, name, label, rest, children) => {
  return `<div className="sp-field">
                    <label className="sp-label">${label}</label>
                    <select
                      name="${name}"
                      value={udetails['${name}']}
                      onChange={handleChange}
                      className="sp-input"${rest}>
                      ${children.trim()}
                    </select>
                    {errors && errors['${name}'] && <span className="sp-error">{errors['${name}']}</span>}
                  </div>`;
});

// Process custom Field (like Gender, CreatedBy, Description)
code = code.replace(/<Field errors={errors} name="([^"]+)" label="([^"]+)">([\s\S]*?)<Err name="\1" errors={errors} \/>\s*<\/Field>/g, (match, name, label, children) => {
  return `<div className="sp-field">
                    <label className="sp-label">${label}</label>
                    ${children.trim()}
                    {errors && errors['${name}'] && <span className="sp-error">{errors['${name}']}</span>}
                  </div>`;
});
code = code.replace(/<Field errors={errors} name="([^"]+)" label="([^"]+)">([\s\S]*?)<\/Field>/g, (match, name, label, children) => {
  return `<div className="sp-field">
                    <label className="sp-label">${label}</label>
                    ${children.trim()}
                    {errors && errors['${name}'] && <span className="sp-error">{errors['${name}']}</span>}
                  </div>`;
});

fs.writeFileSync('src/components/Signup.jsx', code);
console.log('Refactored Signup.jsx successfully.');
