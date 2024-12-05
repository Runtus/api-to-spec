import { apiToSpec } from './trasnform.js';
const testAPIData = `
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

const data = [
  { time: '10:10', call: 4, waiting: 2, people: 2 },
  { time: '10:15', call: 2, waiting: 6, people: 3 },
  { time: '10:20', call: 13, waiting: 2, people: 5 },
  { time: '10:25', call: 9, waiting: 9, people: 1 },
  { time: '10:30', call: 5, waiting: 2, people: 3 },
  { time: '10:35', call: 8, waiting: 2, people: 1 },
  { time: '10:40', call: 13, waiting: 1, people: 2 },
];

chart.data(data);

chart
  .interval()
  .encode('x', 'time')
  .encode('y', 'waiting')
  .encode('color', () => 'waiting')
  .encode('series', () => 'waiting')
  .axis('y', { title: 'Waiting' });

chart
  .interval()
  .encode('x', 'time')
  .encode('y', 'people')
  .encode('color', () => 'people')
  .encode('series', () => 'people')
  .scale('y', { independent: true })
  .axis('y', { position: 'right', grid: null, title: 'People' });

chart.render();
;

`;


let Chart;

const debounce = (func, time) => {
    let timeout;
    return function (...args) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, time)
        } else {
            timeout = setTimeout(() => {
                func.apply(this, args);
            }, time)
        }
    }
}

const onTextareaChange = debounce((value) => {
    const input = value.target.value;
    if (!input.length) {
        return;
    }
    
    console.log(input)
    eval(input);

}, 500)

const onButtonClick = () => {
    const options = apiToSpec(testAPIData);
    console.log(options)
    const chart = new Chart(options.options);
    chart.options(options.newOptions);
    chart.render()
}

document.addEventListener('DOMContentLoaded', function () {
    const textareaDom = document.getElementById('input');
    const transformButton = document.getElementById('transform');
    textareaDom.addEventListener("input", onTextareaChange);
    transformButton.addEventListener("click", onButtonClick);
    Chart = G2.Chart;
})