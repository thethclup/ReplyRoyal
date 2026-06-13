fetch('https://docs.base.org/apps/builder-codes/app-developers.md').then(res => res.text()).then(data => {
  console.log(data);
}).catch(console.error);
