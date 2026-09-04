const dns = require('dns');

const host = 'cluster0.imsxkfd.mongodb.net';

console.log(`Resolving ${host}...`);

dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
  if (err) {
    console.error('❌ SRV Resolution Failed:');
    console.error(err);
  } else {
    console.log('✅ SRV Resolution Successful:');
    console.log(addresses);
  }
  
  dns.resolveTxt(host, (err, txt) => {
    if (err) {
      console.error('❌ TXT Resolution Failed:');
      console.error(err);
    } else {
      console.log('✅ TXT Resolution Successful:');
      console.log(txt);
    }
  });
});
