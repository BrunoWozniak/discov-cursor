const fs = require('fs');
const summary = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

function percent(n, d) {
  return d === 0 ? 'N/A' : ((n / d) * 100).toFixed(1) + '%';
}

let md = '| File | Lines | Statements | Functions | Branches |\n';
md += '|------|-------|------------|-----------|----------|\n';

for (const [file, data] of Object.entries(summary)) {
  if (file === 'total') continue;
  md += `| ${file} | ${percent(data.lines.covered, data.lines.total)} | ${percent(data.statements.covered, data.statements.total)} | ${percent(data.functions.covered, data.functions.total)} | ${percent(data.branches.covered, data.branches.total)} |\n`;
}

const t = summary.total;
md += `| **Total** | **${percent(t.lines.covered, t.lines.total)}** | **${percent(t.statements.covered, t.statements.total)}** | **${percent(t.functions.covered, t.functions.total)}** | **${percent(t.branches.covered, t.branches.total)}** |\n`;

console.log(md); 