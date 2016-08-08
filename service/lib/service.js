'use strict';

const trafficMeister = require('../index.js');

const Service = (() => {
  const nodes = {
    'errorBlock': document.querySelector('.error'),
    'loaderBlock': document.querySelector('.loader'),
    'resultBlock': document.querySelector('.result'),
    'containerBlock': document.querySelector('.container'),
    'typeSelector': document.querySelector('#type'),
    'brandSelector': document.querySelector('#brand'),
    'colorSelector': document.querySelector('#color')
  };
  const _maxTries = 3;
  let _tries = 0;
  let _data;
  let _selectedItem = {
    type: '',
    brand: '',
    color: ''
  };
  let _defaultTypeList = {
    value: '',
    label: 'Select the type'
  };
  let _defaultBrandList = {
    value: '',
    label: 'Select the brand'
  };
  let _defaultColorList = {
    value: '',
    label: 'Select the color'
  };

  const getData = () => {
    return trafficMeister.fetchData(function(err, data) {
      _tries++;

      if (err) {
        if (_tries === _maxTries) {
          console.error('getData error:', err);

          hideLoader();
          return showError();
        }

        return getData();
      }

      hideLoader();
      return showData(data);
    });
  }

  const showError = () => {
    nodes.errorBlock.style.display = 'block';
  };

  const hideLoader = () => {
    nodes.loaderBlock.style.display = 'none';
  };

  const showData = (data) => {
    _data = data;
    nodes.containerBlock.style.display = 'block';
    renderTypes();
  };

  const renderTypes = () => {
    let options = [];
    let renderedTypes = [];

    if (_data) {
      _data.forEach((item, index) => {
        if (renderedTypes.indexOf(item.type) === -1) {
          options.push({
            value: item.type,
            label: item.type
          });

          renderedTypes.push(item.type);
        }
      });

      options.unshift(_defaultTypeList);

      options.forEach((item) => {
        let option = document.createElement('option');
        option.value = item.value;
        option.innerText = item.label
        nodes.typeSelector.appendChild(option);
      });
    }
  };

  const renderBrands = (type) => {
    const selector = nodes.brandSelector;
    let options = [];

    if (_data) {
      options = _data.filter((item) => {
        if (item.type === type) {
          return item;
        }
      });

      options.unshift(_defaultBrandList);

      options.forEach((item) => {
        let option = document.createElement('option');
        option.value = item.value || item.brand;
        option.innerText = item.label || item.brand;
        selector.appendChild(option);
      });

      enableSelector(selector);
    }
  };

  const renderColors = (brand) => {
    const selector = nodes.colorSelector;
    let options = [];

    if (_data) {
      _data.forEach((item) => {
        if (item.brand === brand) {
          options = options.concat(item.colors);
        }
      });

      options.unshift(_defaultColorList);

      options.forEach((item) => {
        let option = document.createElement('option');
        option.value = item.value || item;
        option.innerText = item.label || item;
        selector.appendChild(option);
      });

      enableSelector(selector);
    }
  };

  const processType = (type) => {
    disableSelector(nodes.brandSelector);
    disableSelector(nodes.colorSelector);

    clearResult();

    _selectedItem = {
      type,
      brand: '',
      color: ''
    };

    if (!type) {
      return;
    }
    return renderBrands(type);
  };

  const processBrand = (brand) => {
    disableSelector(nodes.colorSelector);

    clearResult();

    _selectedItem.brand = brand;
    _selectedItem.color = '';

    if (!brand) {
      return;
    }

    return renderColors(brand);
  };

  const processColor = (color) => {
    _selectedItem.color = color;

    if (!color) {
      return;
    }

    return renderResult();
  };

  const clearResult = () => {
    nodes.resultBlock.innerHTML = '';
  };

  const renderResult = () => {
    nodes.resultBlock.innerHTML = `
      <span class='result-type'><strong>Type</strong>: ${_selectedItem.type}</span>
      <span class='result-brand'><strong>Brand</strong>: ${_selectedItem.brand}</span>
      <span class='result-color'><strong>Color</strong>: ${_selectedItem.color}</span>
    `;
  };

  const disableSelector = (selector) => {
    selector.innerHTML = '';
    selector.disabled = 'disabled';
  };

  const enableSelector = (selector) => {
    selector.removeAttribute('disabled');
  };

  return {
    init() {
      getData();

      this.setEventListeners();
    },

    setEventListeners() {
      if (nodes.typeSelector && nodes.brandSelector && nodes.colorSelector) {
        nodes.typeSelector.addEventListener('change', this.typeChangeHandler);
        nodes.brandSelector.addEventListener('change', this.brandChangeHandler);
        nodes.colorSelector.addEventListener('change', this.colorChangeHandler);
      }
    },

    typeChangeHandler(event) {
      const value = event.target.value;

      processType(value);
    },

    brandChangeHandler(event) {
      const value = event.target.value;

      processBrand(value);
    },

    colorChangeHandler(event) {
      const value = event.target.value;

      processColor(value);
    }
  };
})();

Service.init();

module.exports = Service;
