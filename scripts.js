const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let companies;
  let result;

  function empty(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function el(company) {
    const dl = document.createElement('dl');
    // Lén
    const lenName = document.createElement('dt');
    lenName.appendChild(document.createTextNode('Lén'));
    dl.appendChild(lenName);

    const lenValue = document.createElement('dd');
    lenValue.appendChild(document.createTextNode(company.name));
    dl.appendChild(lenValue);
    // Kennitala
    const snName = document.createElement('dt');
    snName.appendChild(document.createTextNode('Kennitala'));
    dl.appendChild(snName);

    const snValue = document.createElement('dd');
    snValue.appendChild(document.createTextNode(company.sn));
    dl.appendChild(snValue);

    const element = document.createElement('div');
    if (company.active === 1) {
      // Heimilisfang
      const addrName = document.createElement('dt');
      addrName.appendChild(document.createTextNode('Heimilsfang'));
      dl.appendChild(addrName);

      const addrValue = document.createElement('dd');
      addrValue.appendChild(document.createTextNode(company.address));
      dl.appendChild(addrValue);

      element.classList.remove();
      element.classList.add('company');
      element.classList.add('company--active');
    } else {
      element.classList.remove();
      element.classList.add('company');
      element.classList.add('company--inactive');
    }
    element.appendChild(dl);
    return element;
  }

  function showLoading() {
    empty(result);
    const loading = document.createElement('div');
    loading.classList.add('loading');

    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    loading.appendChild(img);
    loading.appendChild(document.createTextNode('Leita af fyrirtækjum...'));
    result.appendChild(loading);
  }

  function displayError(error) {
    empty(result);
    result.appendChild(document.createTextNode(error));
  }

  function syna(companyList) {
    if (companyList.results.length === 0) {
      displayError('Ekkert fyrirtæki fannst fyrir leitarstreng.');
      return;
    }
    empty(result);
    for (let i = 0; i < companyList.results.length; i += 1) {
      const div = el(companyList.results[i]);
      result.appendChild(div);
    }
  }

  function saekja(comp) {
    showLoading();
    fetch(API_URL + comp)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Villa kom upp');
        }
        return response.json();
      })
      .then((jsonResponse) => {
        syna(jsonResponse);
      })
      .catch((err) => {
        displayError('Villa við að sækja gögn.');
        // eslint-disable-next-line no-console
        console.error('Þú fékkst villu', err);
      });
  }

  function onSubmit(e) {
    e.preventDefault();
    if (input.value.length === 0) {
      displayError('Lén verður að vera strengur.');
    } else {
      saekja(input.value);
    }
  }

  function init(_companies) {
    companies = _companies;
    const form = companies.querySelector('form');
    input = form.querySelector('input');
    result = companies.querySelector('.results');

    form.addEventListener('submit', onSubmit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
