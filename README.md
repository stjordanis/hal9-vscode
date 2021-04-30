# Hal9 VSCode

This README describes the hal9 VSCode extension, which provides an interactive JavaScript panel to send commands line-by-line with a keyboard shortcut.

This workflow is ideal to execute long-running commands characteristic of Data Science, Machine Learning and Artificial Intelligence workflows -- Training a `tensorflow.js` model might take minutes to train.

## Getting Started

To use this extension, open the "Command Palette" and enable `hal9: Interactive JavaScript` which will open an "Output" window. You can then open a JavaScript file and send commands to this output window using `shift + alt + enter`.

This extension is ideal to perform interactive JavaScript commands; for instance, try sending the following command to write "Hello world!" in teh JavaScript output window:

```js
document.body.innerText = 'Hello world!';
```

This extension makes use of [d3-require](https://github.com/d3/d3-require) to easily require dependencies, try sending the following example:

```js

d3 = await require('d3@6')

document.body.innerHTML = '';

d3.select(document.body).append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .selectAll('circle')
  .data([1,2,3,4,5,6,7,8,9,10])
  .enter()
  .append('circle')
    .attr('r', e => 4 * e)
    .attr('cx', e => 30 * e)
    .attr('cy', 40)
    .attr('fill', 'yellow')
```

You can log commands back in your console using simply use `console.log`, which has been overriden in the output window to write back to VSCode. Try sending the following line:

```js
console.log('Tada!');
```
