Monedas = {
  USD: 'dolar',
  EUR: 'euro',
};

async function get_price() {
  var Amount = document.getElementById('amount');
  Amount_Value = Amount.value;
  var Moneda = document.getElementById('Moneda');
  Moneda_value = Moneda.value;
  var Resulatado_F = document.getElementById('Resultado');
  if (Moneda_value == '') {
    alert('Seleciona la moneda a convertir');
  } else if (Amount_Value == '') {
    alert('Ingresa una cantidad a evaluar');
  } else {
    try {
      const res = await fetch('https://mindicador.cl/api/');
      const data = await res.json();
      const valor = data[Monedas[Moneda_value]]['valor'];
      Amount_Value = Amount.value;
      tipo_cambio = Amount_Value * (1 / valor);
      Resulatado_F.innerHTML = `El Resultado es: $${tipo_cambio.toFixed(2)}`;
      renderGrafica(Moneda_value);
    } catch {
      console.log('error');
    }
  }
}

var Endpoints = {
  USD: 'https://mindicador.cl/api/dolar',
  EUR: 'https://mindicador.cl/api/euro',
};

async function getMonedas(Moneda_value) {
  const endpoint = Endpoints[Moneda_value];
  const res = await fetch(endpoint);
  const monedas = await res.json();
  console.log(monedas);
  return monedas;
}

function prepararConfiguracionParaLaGrafica(monedas) {
  // Creamos las variables necesarias para el objeto de configuración
  const tipoDeGrafica = 'line';
  const nombresDeLasMonedas = monedas['serie'].map((moneda) => moneda.fecha);
  const titulo = 'Tipo de cambio';
  const colorDeLinea = 'red';
  const valores = monedas['serie'].map((moneda) => {
    const valor = moneda.valor;
    return Number(valor);
  });
  // Creamos el objeto de configuración usando las variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombresDeLasMonedas.slice(nombresDeLasMonedas.length - 10),
      datasets: [
        {
          label: titulo,
          backgroundColor: colorDeLinea,
          data: valores.slice(valores.length - 10),
        },
      ],
    },
  };
  return config;
}

async function renderGrafica(Moneda_value) {
  const monedas = await getMonedas(Moneda_value);
  const config = prepararConfiguracionParaLaGrafica(monedas);
  const chartDOM = document.getElementById('myChart');
  new Chart(chartDOM, config);
}
