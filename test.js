import { apiToSpec } from './trasnform.js';
const testAPIData = `
import { Chart } from '@antv/g2';

const chart = new Chart({
  container: 'container',
  autoFit: true,
});

chart.coordinate({ transform: [{ type: 'transpose' }] });

chart
  .interval()
  .data({
    type: 'fetch',
    value:
      'https://gw.alipayobjects.com/os/bmw-prod/87b2ff47-2a33-4509-869c-dae4cdd81163.csv',
    transform: [
      {
        type: 'filter',
        callback: (d) => d.year === 2000,
      },
    ],
  })
  .encode('x', 'age')
  .encode('y', (d) => (d.sex === 1 ? -d.people : d.people))
  .encode('color', 'sex')
  .scale('color', { type: 'ordinal' })
  .scale('x', { range: [1, 0] })
  .axis('y', { labelFormatter: '~s' })
  .legend('color', { labelFormatter: (d) => (d === 1 ? 'Male' : 'Female') })
  .tooltip((d) => ({ value: d.people, name: d.sex === 1 ? 'Male' : 'Female' }));

chart.render();
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