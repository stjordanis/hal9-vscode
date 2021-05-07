
require = async function(lib) {
  // custom url require helper
  var requireUrl = async function (src) {
    var promise = new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.src = src;
        script.addEventListener('load', resolve);
        script.addEventListener('error', e => reject(e.error));
        document.head.appendChild(script);
    });

    return await promise;
  };

  if (lib.startsWith('http://') || lib.startsWith('https://') || lib.startsWith('//'))
    return await requireUrl(lib);
  else
    return await __d3.require(lib);
};
