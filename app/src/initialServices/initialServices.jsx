import router from 'next/router';

export default function redirectTo(address, req, res) {
  console.log(address);
  if (req === undefined) {
    router.push(address);
  } else {
    res.writeHead(302, {
      Location: address,
    });
    res.end();
  }
}
