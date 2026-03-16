const fs = require('fs');
let code = fs.readFileSync('src/components/Signup.jsx', 'utf8');

const errDef = /const Err = [\s\S]*?: null;/;
const selectDef = /const Select = [\s\S]*?\);\n/;
const inputDef = /const Input = [\s\S]*?\);\n/;
const fieldDef = /const Field = [\s\S]*?\);\n/;

code = code.replace(errDef, '');
code = code.replace(selectDef, '');
code = code.replace(inputDef, '');
code = code.replace(fieldDef, '');

const definitions = `

const Err = ({ name, errors }) => errors && errors[name]
  ? <span className="sp-error">{errors[name]}</span>
  : null;

const Select = ({ name, children, udetails, handleChange, ...rest }) => (
  <select name={name} value={udetails[name]} onChange={handleChange} className="sp-input" {...rest}>
    {children}
  </select>
);

const Input = ({ name, type = 'text', udetails, handleChange, ...rest }) => (
  <input
    type={type}
    name={name}
    value={udetails[name]}
    onChange={handleChange}
    className="sp-input"
    autoComplete="off"
    {...rest}
  />
);

const Field = ({ name, label, errors, children }) => (
  <div className="sp-field">
    <label className="sp-label">{label}</label>
    {children}
    <Err name={name} errors={errors} />
  </div>
);
`;

code = code.replace('const BG = process.env.PUBLIC_URL + "/bg.jpeg";', 'const BG = process.env.PUBLIC_URL + "/bg.jpeg";\n' + definitions);

code = code.replace(/<Field /g, '<Field errors={errors} ');
code = code.replace(/<Input /g, '<Input udetails={udetails} handleChange={handleChange} ');
code = code.replace(/<Select /g, '<Select udetails={udetails} handleChange={handleChange} ');
// Err is only explicitly used outside Field once, check if it's there
code = code.replace(/<Err name="description" \/>/g, '<Err name="description" errors={errors} />');

fs.writeFileSync('src/components/Signup.jsx', code);
console.log('Modified Signup.jsx successfully.');
