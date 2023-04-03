function sigmoid(x, L, k, x0) {
    return L / (1 + Math.exp(-k * (x - x0)));
}

function hyperbolic_curve(x, a, b, c, d) {
    return a / (x - b) + c * x + d;
}

function exponential_curve(x, a, b, c) {
    return a * Math.exp(b * (x - 19)) + c;
}

function createScores(L, k, x0) {
    const levels = Array.from({ length: 60 }, (_, i) => i + 1);
    const scores = levels.map(level => Math.round(sigmoid(level, L, k, x0)));

    // 数据修正，使得等级1到19的分数按照设定值
    for (let i = 0; i < 19; i++) {
        scores[i] = initial_scores[i + 1];
    }

    // 使用指数函数调整19级到60级之间的分数
    const a = 12;
    const b = 0.1;
    const c = scores[18];
    for (let i = 19; i < 60; i++) {
        scores[i] = Math.round(exponential_curve(i, a, b, c));
    }
    scores[59] = 7000; // 设定60级的分数为7000分

    // 确保每个等级的分数都是递增的
    for (let i = 1; i < scores.length; i++) {
        if (scores[i] <= scores[i - 1]) {
            scores[i] = scores[i - 1] + 1;
        }
    }

    return scores;
}


const initial_scores = {
  19: 390,
  18: 370,
  17: 350,
  16: 310,
  15: 290,
  14: 270,
  13: 250,
  12: 230,
  11: 210,
  10: 190,
  9: 170,
  8: 150,
  7: 130,
  6: 110,
  5: 90,
  4: 70,
  3: 60,
  2: 40,
  1: 20
};

const L_input = document.getElementById('L');
const k_input = document.getElementById('k');
const x0_input = document.getElementById('x0');
const chart_canvas = document.getElementById('chart');

let chart;

function updateChart() {
    if (chart) {
        chart.destroy();
    }

    const L = parseFloat(L_input.value);
    const k = parseFloat(k_input.value);
    const x0 = parseFloat(x0_input.value);

    const scores = createScores(L, k, x0);
    const chartData = {
        labels: scores.map((_, i) => `Level ${i + 1}`),
        datasets: [{
            label: '分数',
            data: scores,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    };

    const config = {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '分数'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: '等级'
                    }
                }
            }
        }
    };

    chart = new Chart(chart_canvas, config);
}

L_input.addEventListener('change', updateChart);
k_input.addEventListener('change', updateChart);
x0_input.addEventListener('change', updateChart);

updateChart();