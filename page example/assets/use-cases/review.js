/* Only the standalone image library is controlled here. */
(function () {
  'use strict';
  const section = document.currentScript.closest('#industrial-images');
  if (!section) return;
  const tabs = Array.from(section.querySelectorAll('[role="tab"]'));
  const panel = section.querySelector('[role="tabpanel"]');
  const images = Array.from(section.querySelectorAll('[data-image-industry]'));
  function select(tab) {
    const category = tab.dataset.imageCategory;
    tabs.forEach(button => {
      const active = button === tab;
      button.setAttribute('aria-selected',String(active));
      button.tabIndex = active ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby',tab.id);
    images.forEach(image => { image.hidden = category !== 'All' && image.dataset.imageIndustry !== category; });
  }
  tabs.forEach((tab,index) => {
    tab.addEventListener('click',() => select(tab));
    tab.addEventListener('keydown',event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(tabs[next]);
      tabs[next].focus();
    });
  });
})();
