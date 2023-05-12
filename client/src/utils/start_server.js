import { networkInterfaces } from 'os';
const interfaces = networkInterfaces();

export default () => {
  const stdin = process.openStdin();

  let selectableInterfaces = [];

  Object.keys(interfaces).forEach((intrfce, i) => {
    interfaces[intrfce].forEach((network, j) => {
      if (network && network.family === 'IPv4') {
        selectableInterfaces.push({ name: intrfce, address: network.address });
      }
    });
  });

  exitIfNoInterfaceFound();

  console.log('\x1b[36m%s\x1b[0m', '\n\nAvailable network interfaces:');
  console.log('\x1b[36m\x1b[4m%s\x1b[0m', `\n${'#'.padEnd(4)}${'Adress'.padEnd(21)}Network`);

  logInterfaceList();

  return new Promise((resolve, reject) => {
    stdin.addListener('data', (val) => {
      //give an error when input val not valid
      if (String(Number(val)) === String(NaN) || Number(val) < 0 || Number(val) > selectableInterfaces.length - 1) {
        logSelectInterface();
      } else {
        const selectedInterface = selectableInterfaces.at(val);
        if (selectedInterface) {
          stdin.removeAllListeners('data'); //dont listen console prompt
          console.clear();
          resolve(selectedInterface.address);
        } else {
          console.error('\x1b[31m%s\x1b[0m', "\n\nCan't start server on the given interface, please try other interface");
          logSelectInterface();
        }
      }
    });
  });

  function logInterfaceList() {
    selectableInterfaces.forEach((intrfce, index) => {
      console.log(`${index} - ${intrfce.address.padEnd(20, ' ')} ${intrfce.name}`);
    });
    console.log('\n');
    logSelectInterface();
  }

  function logSelectInterface() {
    process.stdout.write('\x1b[33m');
    process.stdout.write('Select your interface: ');
    process.stdout.write('\x1b[0m');
  }

  function exitIfNoInterfaceFound() {
    if (selectableInterfaces.length === 0) {
      console.log('\x1b[31m%s\x1b[0m', 'Did not find any available IPv4 network interface');
      process.exit(0);
    }
  }
};
