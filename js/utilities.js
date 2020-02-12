let numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

document.getElementById('reset').onclick = function() {reset()};
let reset = () => {
  window.localStorage.clear();
  window.location.reload(false);
}


export {numberWithCommas, reset};