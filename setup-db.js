const { Client } = require('pg');
const fs = require('fs');

const regions = [
  'ap-south-1', 'ap-southeast-1', 'us-east-1', 'us-west-1', 'us-west-2',
  'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-2', 'eu-west-1',
  'eu-west-2', 'eu-central-1', 'ca-central-1', 'sa-east-1'
];
const password = 'Valli123**@';
const project = 'uuksyxayeesamleqwacu';

async function tryConnect() {
  for (const r of regions) {
    const host = `aws-0-${r}.pooler.supabase.com`;
    const connString = `postgresql://postgres.${project}:${password}@${host}:6543/postgres`;
    console.log('Trying', r);
    const client = new Client({ connectionString: connString, connectionTimeoutMillis: 3000 });
    
    try {
      await client.connect();
      console.log('CONNECTED TO:', r);
      
      const schema = fs.readFileSync('database/supabase_schema.sql', 'utf8');
      await client.query(schema);
      console.log('Schema and Data executed successfully!');
      
      await client.end();
      return;
    } catch (e) {
      console.log('Failed:', e.message);
    }
  }
  console.log('All regions failed.');
}

tryConnect();
