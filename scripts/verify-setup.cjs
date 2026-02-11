#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const checks = [];

console.log('🔍 Verifying Development Setup...\n');

// Check Node.js
try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    if (majorVersion >= 18) {
        checks.push({ name: 'Node.js', status: 'PASS', detail: nodeVersion });
    } else {
        checks.push({ name: 'Node.js', status: 'WARN', detail: `${nodeVersion} (18+ recommended)` });
    }
} catch (error) {
    checks.push({ name: 'Node.js', status: 'FAIL', detail: 'Not installed' });
}

// Check PostgreSQL
try {
    execSync('psql --version', { encoding: 'utf8' });
    checks.push({ name: 'PostgreSQL', status: 'PASS', detail: 'Installed' });
} catch (error) {
    checks.push({ name: 'PostgreSQL', status: 'FAIL', detail: 'Not installed' });
}

// Check frontend .env
if (fs.existsSync(path.join(__dirname, '..', '.env'))) {
    checks.push({ name: 'Frontend .env', status: 'PASS', detail: 'File exists' });
} else {
    checks.push({ name: 'Frontend .env', status: 'FAIL', detail: 'Missing' });
}

// Check backend .env
if (fs.existsSync(path.join(__dirname, '..', 'backend', '.env'))) {
    checks.push({ name: 'Backend .env', status: 'PASS', detail: 'File exists' });
} else {
    checks.push({ name: 'Backend .env', status: 'FAIL', detail: 'Missing' });
}

// Check frontend node_modules
if (fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
    checks.push({ name: 'Frontend dependencies', status: 'PASS', detail: 'Installed' });
} else {
    checks.push({ name: 'Frontend dependencies', status: 'FAIL', detail: 'Run: npm install' });
}

// Check backend node_modules
if (fs.existsSync(path.join(__dirname, '..', 'backend', 'node_modules'))) {
    checks.push({ name: 'Backend dependencies', status: 'PASS', detail: 'Installed' });
} else {
    checks.push({ name: 'Backend dependencies', status: 'FAIL', detail: 'Run: cd backend && npm install' });
}

// Check database
try {
    // Use psql with simpler, cross-platform approach
    const dbList = execSync('psql -U postgres -l', { encoding: 'utf8', stdio: 'pipe' });
    if (dbList.includes('home_builder_db')) {
        checks.push({ name: 'Database', status: 'PASS', detail: 'home_builder_db exists' });
    } else {
        checks.push({ name: 'Database', status: 'WARN', detail: 'home_builder_db not found' });
    }
} catch (error) {
    checks.push({ name: 'Database', status: 'WARN', detail: 'Cannot connect to PostgreSQL' });
}

// Print results
console.log('┌─────────────────────────────┬────────┬──────────────────────────┐');
console.log('│ Component                   │ Status │ Details                  │');
console.log('├─────────────────────────────┼────────┼──────────────────────────┤');

checks.forEach(check => {
    const statusIcon = check.status === 'PASS' ? '✅' : check.status === 'WARN' ? '⚠️ ' : '❌';
    const name = check.name.padEnd(27);
    const status = `${statusIcon} ${check.status}`.padEnd(6);
    const detail = check.detail.padEnd(24);
    console.log(`│ ${name} │ ${status} │ ${detail} │`);
});

console.log('└─────────────────────────────┴────────┴──────────────────────────┘\n');

const failures = checks.filter(c => c.status === 'FAIL');
const warnings = checks.filter(c => c.status === 'WARN');

if (failures.length === 0 && warnings.length === 0) {
    console.log('🎉 All checks passed! You\'re ready to start development.\n');
    console.log('Run: npm run dev:all    (or manually start backend and frontend)');
} else if (failures.length > 0) {
    console.log('❌ Setup incomplete. Please fix the failed checks.\n');
    console.log('Run: ./setup-dev.sh  (or setup-dev.bat on Windows)');
    process.exit(1);
} else {
    console.log('⚠️  Setup mostly complete but has warnings.\n');
    console.log('You can proceed but may encounter issues.');
}
