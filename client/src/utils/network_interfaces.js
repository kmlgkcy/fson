import { networkInterfaces } from 'os';

export const availableInterfaces = () => {
  const interfaces = networkInterfaces();

  let selectableInterfaces = [];

  Object.keys(interfaces).forEach((intrfc, i) => {
    interfaces[intrfc].forEach((network, j) => {
      if (network && network.family === 'IPv4') {
        selectableInterfaces.push({ name: intrfc, address: network.address });
      }
    });
  });
  return selectableInterfaces;
};

export const interfaceExists = (network) => {
  let exists = false;
  availableInterfaces().forEach((n, i) => {
    if (n.address === network) {
      exists = true;
    }
  });
  return exists;
};
