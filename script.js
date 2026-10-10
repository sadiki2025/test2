function googleTranslateElementInit() {
  const translateContainer = document.getElementById('google_translate_element');
  const languageObserver = new MutationObserver(() => {
    const languageSelect = translateContainer.querySelector('.goog-te-combo');
    if (!languageSelect) return;

    let arabicOption = Array.from(languageSelect.options).find((option) => option.value === 'ar');
    if (!arabicOption) {
      arabicOption = new Option('العربية', 'ar');
      languageSelect.add(arabicOption);
    }

    const defaultOption = Array.from(languageSelect.options).find((option) => option.value === '');
    languageSelect.insertBefore(arabicOption, defaultOption ? defaultOption.nextSibling : languageSelect.firstChild);
    languageObserver.disconnect();
  });
  languageObserver.observe(translateContainer, { childList: true, subtree: true });

  new google.translate.TranslateElement({
    pageLanguage: 'ar',
    includedLanguages: 'ar,en,fr,es,de,it,pt,tr,ru,zh-CN,ja',
    autoDisplay: false
  }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const productDetailsModal = document.getElementById('productDetailsModal');
  const productDetailsClose = document.querySelector('.product-details-close');
  const productDetailImage = document.querySelector('.product-detail-image');
  const productDetailName = document.querySelector('.product-detail-name');
  const productDetailDescription = document.querySelector('.product-detail-description');
  const productDetailTotal = document.querySelector('.product-detail-total');
  const productDetailQuantityValue = document.querySelector('.product-detail-quantity-value');
  const productDetailAddButton = document.querySelector('.product-detail-add');
  const deliveryModal = document.getElementById('deliveryModal');
  const pickupModal = document.getElementById('pickupModal');
  const deliveryCloseBtn = document.querySelector('.delivery-close');
  const pickupCloseBtn = document.querySelector('.pickup-close');
  const pickupSearchInput = document.querySelector('.pickup-search-input');
  const pickupStoreCards = document.querySelectorAll('.pickup-store-card');
  const pickupNoResults = document.querySelector('.pickup-no-results');
  const pickupOrderBtn = document.querySelector('.pickup-order-btn');
  const deliverySubmitBtn = document.querySelector('.delivery-submit-btn');
  const locationInput = document.querySelector('.delivery-location-input');
  const deliveryMapLink = document.querySelector('.delivery-map-link');
  const deliveryMapFrame = document.querySelector('.delivery-map-frame');
  const regionSuggestions = document.querySelector('.region-suggestions');
  const categoryButtons = document.querySelectorAll('.category-item');
  const categorySections = document.querySelectorAll('.category-section');
  const categoryImageSources = [
    'images/pasta2.png',
    'images/pasta1.png',
    'images/pasta3.png',
    'images/pasta4.png',
    'images/pasta5.png'
  ];
  const categoriesScroller = document.querySelector('.categories-scroller');
  const categorySliderArrows = document.querySelectorAll('.categories-slider-arrow');
  const cartItemsContainer = document.querySelector('.cart-items');
  const emptyState = document.querySelector('.cart-empty-state');
  const cartSummary = document.querySelector('.cart-summary');
  const cartCount = document.querySelector('.cart-item-count');
  const totalPrice = document.querySelector('.cart-total-price');
  const cartFooterTotal = document.querySelector('.cart-footer-total');
  const cartFooterView = document.querySelector('.cart-footer-view');
  const headerCartButton = document.querySelector('.header-icon');
  const sidebarCart = document.querySelector('.sidebar-cart');
  const fullCartItems = document.querySelector('.full-cart-items');
  const fullCartEmpty = document.querySelector('.full-cart-empty');
  const fullCartItemCount = document.querySelector('.full-cart-item-count');
  const checkoutSubtotal = document.querySelector('.checkout-subtotal');
  const checkoutTotal = document.querySelector('.checkout-total');
  const cartRecommendations = document.querySelector('.cart-recommendations-grid');
  const cartStorageKey = 'sadiki-cart';
  const whatsappOrderNumber = document.body.dataset.whatsappOrderNumber;
  let mapUpdateTimer;

  const promoSlider = document.querySelector('.promo-slider');
  const promoSlides = promoSlider ? Array.from(promoSlider.querySelectorAll('.promo-slide')) : [];
  const promoIndicators = promoSlider ? Array.from(promoSlider.querySelectorAll('.promo-indicator')) : [];
  let promoTimer;
  let activePromoIndex = 0;

  function showPromoSlide(index) {
    if (!promoSlides.length) return;

    activePromoIndex = (index + promoSlides.length) % promoSlides.length;
    promoSlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activePromoIndex;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    promoIndicators.forEach((indicator, indicatorIndex) => {
      const isActive = indicatorIndex === activePromoIndex;
      indicator.classList.toggle('active', isActive);
      indicator.setAttribute('aria-current', String(isActive));
    });
  }

  function stopPromoAutoplay() {
    window.clearInterval(promoTimer);
  }

  function startPromoAutoplay() {
    stopPromoAutoplay();
    if (promoSlides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (document.hidden) return;
    promoTimer = window.setInterval(() => showPromoSlide(activePromoIndex + 1), 5000);
  }

  if (promoSlider && promoSlides.length > 1) {
    const previousPromoButton = promoSlider.querySelector('.promo-arrow-previous');
    const nextPromoButton = promoSlider.querySelector('.promo-arrow-next');

    previousPromoButton?.addEventListener('click', () => {
      showPromoSlide(activePromoIndex - 1);
      startPromoAutoplay();
    });
    nextPromoButton?.addEventListener('click', () => {
      showPromoSlide(activePromoIndex + 1);
      startPromoAutoplay();
    });
    promoIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showPromoSlide(index);
        startPromoAutoplay();
      });
    });

    promoSlider.addEventListener('mouseenter', stopPromoAutoplay);
    promoSlider.addEventListener('mouseleave', startPromoAutoplay);
    promoSlider.addEventListener('focusin', stopPromoAutoplay);
    promoSlider.addEventListener('focusout', (event) => {
      if (!promoSlider.contains(event.relatedTarget)) startPromoAutoplay();
    });
    document.addEventListener('visibilitychange', startPromoAutoplay);
    startPromoAutoplay();
  }

  categorySections.forEach((section) => {
    if (section.id === 'offers' || section.id === 'half-half') return;

    const productsGrid = section.querySelector('.products-grid');
    const productTemplate = productsGrid?.querySelector('.product-card');
    if (!productsGrid || !productTemplate) return;

    const productName = productTemplate.querySelector('.product-name')?.textContent.trim() || 'منتج';
    categoryImageSources.forEach((imageSource, index) => {
      const productCard = index === 0 ? productTemplate : productTemplate.cloneNode(true);
      const productImage = productCard.querySelector('.product-img-wrapper img');
      if (!productImage) return;

      productImage.src = imageSource;
      productImage.alt = `${productName} ${index + 1}`;
      if (index > 0) productsGrid.append(productCard);
    });
  });

  const casablancaRegions = [
    'عين الحمراء',
    'عين السبع',
    'عين الشق',
    'عين الذئاب',
    'عين الله',
    'الدار البيضاء',
    'الحي الحسني',
    'حي المحمدي',
    'درب السلطان',
    'سيدي معروف',
    'المعاريف',
    'الوازيس',
    'بوركون',
    'أنفا',
    'المدينة القديمة',
    'سباتة',
    'سيدي البرنوصي',
    'الفداء',
    'كاليفورنيا',
    'غوتييه'
  ];

  function updateDeliveryMapLink() {
    const region = locationInput ? locationInput.value.trim() : '';
    const query = region ? `${region}, Casablanca, Morocco` : 'Casablanca, Morocco';

    if (deliveryMapLink) {
      deliveryMapLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    if (deliveryMapFrame) {
      deliveryMapFrame.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;
    }
  }

  function scheduleMapUpdate() {
    window.clearTimeout(mapUpdateTimer);
    mapUpdateTimer = window.setTimeout(updateDeliveryMapLink, 500);
  }

  function hideRegionSuggestions() {
    if (!regionSuggestions) return;
    regionSuggestions.replaceChildren();
    regionSuggestions.classList.remove('visible');
    locationInput?.setAttribute('aria-expanded', 'false');
  }

  function showRegionSuggestions(query) {
    if (!regionSuggestions || !locationInput) return;

    const normalizedQuery = query.trim().toLocaleLowerCase('ar');
    if (!normalizedQuery) {
      hideRegionSuggestions();
      return;
    }

    const matches = casablancaRegions.filter((region) =>
      region.toLocaleLowerCase('ar').startsWith(normalizedQuery)
    );

    regionSuggestions.replaceChildren();
    matches.forEach((region) => {
      const option = document.createElement('li');
      option.className = 'region-suggestion';
      option.setAttribute('role', 'option');

      const title = document.createElement('strong');
      title.textContent = region;
      const city = document.createElement('span');
      city.textContent = 'الدار البيضاء، المغرب';

      option.append(title, city);
      option.addEventListener('click', () => {
        locationInput.value = region;
        updateDeliveryMapLink();
        hideRegionSuggestions();
      });
      regionSuggestions.append(option);
    });

    regionSuggestions.classList.toggle('visible', matches.length > 0);
    locationInput.setAttribute('aria-expanded', String(matches.length > 0));
  }

  function openDeliveryModal() {
    if (!deliveryModal) return;
    deliveryModal.classList.add('active');
    deliveryModal.setAttribute('aria-hidden', 'false');
    updateDeliveryMapLink();
  }

  function closeDeliveryModal() {
    if (!deliveryModal) return;
    deliveryModal.classList.remove('active');
    deliveryModal.setAttribute('aria-hidden', 'true');
  }

  function openPickupModal() {
    if (!pickupModal) return;
    pickupModal.classList.add('active');
    pickupModal.setAttribute('aria-hidden', 'false');
  }

  function closePickupModal() {
    if (!pickupModal) return;
    pickupModal.classList.remove('active');
    pickupModal.setAttribute('aria-hidden', 'true');
  }

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
  }

  function closeProductDetails() {
    if (!productDetailsModal) return;
    productDetailsModal.classList.remove('active');
    productDetailsModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  let selectedProduct = null;
  let selectedProductQuantity = 1;

  function updateProductDetailQuantity() {
    if (!selectedProduct) return;
    if (productDetailQuantityValue) productDetailQuantityValue.textContent = String(selectedProductQuantity);
    if (productDetailTotal) {
      productDetailTotal.textContent = `${(selectedProduct.price * selectedProductQuantity).toFixed(2)} م د`;
    }
  }

  document.addEventListener('click', (event) => {
    const productImage = event.target.closest('.product-img-wrapper img');
    if (!productImage || !productDetailsModal) return;

    const productCard = productImage.closest('.product-card');
    const name = productCard?.querySelector('.product-name')?.textContent.trim() || productImage.alt || 'بيتزا كبيرة';
    const description = productCard?.querySelector('.product-desc')?.textContent.trim() || '';
    const priceText = productCard?.querySelector('.product-price')?.textContent.trim() || '0';
    selectedProduct = {
      name,
      price: Number(priceText.replace(/[^\d.]/g, '')) || 0
    };
    selectedProductQuantity = 1;
    if (productDetailImage) {
      productDetailImage.src = productImage.currentSrc || productImage.src;
      productDetailImage.alt = productImage.alt;
    }
    if (productDetailName) productDetailName.textContent = name;
    if (productDetailDescription) productDetailDescription.textContent = description;
    updateProductDetailQuantity();
    productDetailsModal.querySelectorAll('.product-detail-tab').forEach((tab, index) => {
      const isActive = index === 1;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    productDetailsModal.classList.add('active');
    productDetailsModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    productDetailsClose?.focus();
  });

  productDetailsModal?.querySelectorAll('.product-detail-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      productDetailsModal.querySelectorAll('.product-detail-tab').forEach((option) => {
        const isSelected = option === tab;
        option.classList.toggle('active', isSelected);
        option.setAttribute('aria-selected', String(isSelected));
      });
    });
  });

  document.querySelector('.product-detail-quantity-decrease')?.addEventListener('click', () => {
    selectedProductQuantity = Math.max(1, selectedProductQuantity - 1);
    updateProductDetailQuantity();
  });
  document.querySelector('.product-detail-quantity-increase')?.addEventListener('click', () => {
    selectedProductQuantity += 1;
    updateProductDetailQuantity();
  });
  productDetailAddButton?.addEventListener('click', () => {
    if (!selectedProduct) return;
    addProductToCart(selectedProduct, selectedProductQuantity);
    closeProductDetails();
  });

  if (productDetailsClose) {
    productDetailsClose.addEventListener('click', closeProductDetails);
  }

  if (productDetailsModal) {
    productDetailsModal.addEventListener('click', (event) => {
      if (event.target === productDetailsModal) closeProductDetails();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeProductDetails();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navLinks.forEach((item) => item.classList.toggle('active', item === link));

      const selectedService = link.textContent.trim();
      if (selectedService === 'توصيل') {
        closePickupModal();
        openDeliveryModal();
      } else {
        closeDeliveryModal();
        openPickupModal();
      }
    });
  });

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu?.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (
      mobileMenu?.classList.contains('active') &&
      !mobileMenu.contains(event.target) &&
      !mobileMenuToggle?.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  if (deliveryCloseBtn) {
    deliveryCloseBtn.addEventListener('click', closeDeliveryModal);
  }

  if (pickupCloseBtn) {
    pickupCloseBtn.addEventListener('click', closePickupModal);
  }

  if (pickupSearchInput) {
    pickupSearchInput.addEventListener('input', () => {
      const query = pickupSearchInput.value.trim().toLocaleLowerCase();
      let visibleCount = 0;

      pickupStoreCards.forEach((card) => {
        const matches = card.dataset.store.toLocaleLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });

      if (pickupNoResults) pickupNoResults.hidden = visibleCount !== 0;
    });
  }

  pickupStoreCards.forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.pickup-directions')) return;

      pickupStoreCards.forEach((storeCard) => storeCard.classList.toggle('selected', storeCard === card));
      if (pickupOrderBtn) {
        pickupOrderBtn.disabled = false;
        pickupOrderBtn.textContent = `ابدأ الطلب من ${card.dataset.store}`;
      }
    });
  });

  if (pickupOrderBtn) {
    pickupOrderBtn.addEventListener('click', () => {
      const selectedStore = document.querySelector('.pickup-store-card.selected');
      if (!selectedStore) return;

      localStorage.setItem('sadiki-pickup-store', selectedStore.dataset.store);
      closePickupModal();
      alert(`تم اختيار فرع ${selectedStore.dataset.store}. أضف المنتجات إلى السلة لإكمال طلبك.`);
    });
  }

  if (locationInput) {
    locationInput.addEventListener('input', () => {
      scheduleMapUpdate();
      showRegionSuggestions(locationInput.value);
    });

    locationInput.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hideRegionSuggestions();
    });

    locationInput.addEventListener('blur', () => {
      window.setTimeout(hideRegionSuggestions, 150);
    });
  }

  if (deliverySubmitBtn) {
    deliverySubmitBtn.addEventListener('click', () => {
      const region = locationInput ? locationInput.value.trim() : '';

      if (!region) {
        alert('يرجى إدخال منطقتك أولاً.');
        if (locationInput) locationInput.focus();
        return;
      }

      if (!deliveryMapLink) return;
      updateDeliveryMapLink();
      window.open(deliveryMapLink.href, '_blank', 'noopener,noreferrer');
      hideRegionSuggestions();
      closeDeliveryModal();
    });
  }

  if (deliveryModal) {
    deliveryModal.addEventListener('click', (event) => {
      if (event.target === deliveryModal) {
        closeDeliveryModal();
      }
    });
  }

  if (pickupModal) {
    pickupModal.addEventListener('click', (event) => {
      if (event.target === pickupModal) closePickupModal();
    });
  }

  function loadCart() {
    try {
      const storedCart = localStorage.getItem(cartStorageKey);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('فشل في تحميل السلة:', error);
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  }

  let cart = loadCart();

  function filterCategory(categoryId, clickedButton) {
    categoryButtons.forEach((button) => {
      button.classList.toggle('active', button === clickedButton);
    });

    categorySections.forEach((section) => {
      section.classList.toggle('active', section.id === categoryId);
    });
  }

  categoryButtons.forEach((button) => {
    const categoryId = button.dataset.category;
    if (!categoryId) return;

    button.addEventListener('click', () => filterCategory(categoryId, button));
  });

  categorySliderArrows.forEach((arrow) => {
    arrow.addEventListener('click', () => {
      if (!categoriesScroller) return;

      const direction = getComputedStyle(categoriesScroller).direction === 'rtl' ? -1 : 1;
      const scrollDirection = arrow.dataset.scroll === 'next' ? direction : -direction;
      categoriesScroller.scrollBy({
        left: scrollDirection * categoriesScroller.clientWidth * 0.8,
        behavior: 'smooth'
      });
    });
  });

  function getProductFromButton(button) {
    if (!button) return null;
    const card = button.closest('.product-card');
    if (!card) return null;

    const name = card.querySelector('.product-name')?.textContent?.trim() || 'منتج';
    const priceText = card.querySelector('.product-price')?.textContent?.trim() || '0';
    const price = Number(priceText.replace(/[^\d.]/g, '')) || 0;

    return { name, price };
  }

  function addProductToCart(product, quantity = 1) {
    const existingProduct = cart.find((item) => item.name === product.name);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    updateCartView();
    showFullCart();
  }

  function showFullCart() {
    document.body.classList.add('cart-page-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateCartView() {
    if (!cartItemsContainer || !emptyState || !cartSummary || !cartCount || !totalPrice) {
      return;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formattedTotal = `${total.toFixed(2)} م د`;

    cartCount.textContent = String(totalItems);
    if (fullCartItemCount) fullCartItemCount.textContent = String(totalItems);
    document.querySelectorAll('.print-cart-btn').forEach((button) => {
      button.disabled = cart.length === 0;
    });
    if (cartFooterTotal) cartFooterTotal.textContent = formattedTotal;
    if (checkoutSubtotal) checkoutSubtotal.textContent = formattedTotal;
    if (checkoutTotal) checkoutTotal.textContent = formattedTotal;
    totalPrice.textContent = formattedTotal;

    if (fullCartItems) {
      fullCartItems.replaceChildren();
      cart.forEach((item, index) => {
        const row = document.createElement('article');
        row.className = 'full-cart-item';

        const details = document.createElement('div');
        details.className = 'full-cart-item-details';
        const name = document.createElement('p');
        name.className = 'full-cart-item-name';
        name.textContent = item.name;
        const price = document.createElement('p');
        price.className = 'full-cart-item-price';
        price.textContent = `${item.price.toFixed(2)} م د`;
        details.append(name, price);

        const controls = document.createElement('div');
        controls.className = 'cart-quantity-controls';
        controls.innerHTML = `
          <button class="qty-btn qty-decrease" data-index="${index}" aria-label="نقص الكمية">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-increase" data-index="${index}" aria-label="زيادة الكمية">+</button>
        `;
        const remove = document.createElement('button');
        remove.className = 'cart-remove-btn';
        remove.dataset.index = String(index);
        remove.setAttribute('aria-label', 'حذف المنتج');
        remove.textContent = 'حذف';
        const actions = document.createElement('div');
        actions.className = 'cart-item-actions';
        actions.append(controls, remove);

        row.append(details, actions);
        fullCartItems.append(row);
      });
    }

    fullCartEmpty?.classList.toggle('visible', cart.length === 0);

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '';
      emptyState.style.display = 'block';
      cartSummary.style.display = 'none';
      saveCart(cart);
      return;
    }

    emptyState.style.display = 'none';
    cartSummary.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price.toFixed(2)} م د</div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-quantity-controls">
            <button class="qty-btn qty-decrease" data-index="${index}" aria-label="نقص الكمية">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn qty-increase" data-index="${index}" aria-label="زيادة الكمية">+</button>
          </div>
          <button class="cart-remove-btn" data-index="${index}" aria-label="حذف المنتج">حذف</button>
        </div>
      </div>
    `).join('');

    saveCart(cart);
  }

  function openCartPrintWindow() {
    if (cart.length === 0) {
      alert('السلة فارغة، أضف منتجات قبل الطباعة.');
      return;
    }

    const printWindow = window.open('', '_blank', 'popup,width=800,height=700');
    if (!printWindow) {
      alert('تعذر فتح نافذة الطباعة. اسمح بالنوافذ المنبثقة لهذا الموقع ثم أعد المحاولة.');
      return;
    }

    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const rows = cart.map((item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toFixed(2)} م د</td>
        <td>${(item.price * item.quantity).toFixed(2)} م د</td>
      </tr>
    `).join('');

    printWindow.document.open();
    printWindow.document.write(`<!doctype html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>سلة التسوق</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 32px; color: #111; font-family: Arial, sans-serif; }
            main { width: min(760px, 100%); margin: 0 auto; }
            header { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 2px solid #ed1c2a; padding-bottom: 12px; }
            h1 { margin: 0; font-size: 24px; }
            button { border: 0; border-radius: 6px; padding: 10px 16px; background: #ed1c2a; color: white; font-size: 14px; cursor: pointer; }
            table { width: 100%; margin-top: 20px; border-collapse: collapse; }
            th, td { padding: 12px 8px; border-bottom: 1px solid #ddd; text-align: right; }
            th { background: #f4f4f4; }
            tfoot td { border-top: 2px solid #222; border-bottom: 0; font-weight: 700; }
            @media print { body { padding: 0; } .print-action { display: none; } }
          </style>
        </head>
        <body>
          <main>
            <header>
              <h1>سلة التسوق</h1>
              <button class="print-action" type="button" onclick="window.print()">طباعة</button>
            </header>
            <table>
              <thead><tr><th>العنصر</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th></tr></thead>
              <tbody>${rows}</tbody>
              <tfoot><tr><td colspan="3">الإجمالي الكلي</td><td>${total.toFixed(2)} م د</td></tr></tfoot>
            </table>
          </main>
        </body>
      </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => printWindow.print(), 250);
  }

  function sendCartOrderToWhatsApp() {
    if (cart.length === 0) {
      alert('السلة فارغة، أضف منتجات أولاً.');
      return;
    }

    const customerPhoneInputs = document.querySelectorAll('.checkout-customer-phone');
    const customerPhoneInput = Array.from(customerPhoneInputs).find((input) => input.value.trim()) || customerPhoneInputs[0];
    const customerPhone = customerPhoneInput?.value.trim() || '';
    const normalizedCustomerPhone = customerPhone.replace(/[\s()+.-]/g, '');
    if (!/^\+?\d{8,15}$/.test(normalizedCustomerPhone)) {
      alert('أدخل رقم هاتف صحيحًا للتواصل معك قبل إرسال الطلب.');
      customerPhoneInput?.focus();
      return;
    }

    const orderLines = cart.map((item) =>
      `- ${item.name} × ${item.quantity} — ${(item.price * item.quantity).toFixed(2)} م د`
    );
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const notes = Array.from(document.querySelectorAll('.checkout-notes'))
      .map((input) => input.value.trim())
      .find(Boolean) || '';
    const message = [
      'مرحباً، أود إرسال هذا الطلب:',
      `رقم الزبون: ${customerPhone}`,
      '',
      ...orderLines,
      '',
      `الإجمالي: ${total.toFixed(2)} م د`,
      ...(notes ? ['', `ملاحظات: ${notes}`] : [])
    ].join('\n');
    const whatsappUrl = `https://wa.me/${whatsappOrderNumber}?text=${encodeURIComponent(message)}`;
    window.location.assign(whatsappUrl);
  }

  document.querySelectorAll('.checkout-customer-phone, .checkout-notes').forEach((input) => {
    input.addEventListener('input', () => {
      document.querySelectorAll(`.${input.classList[0]}`).forEach((matchingInput) => {
        if (matchingInput !== input) matchingInput.value = input.value;
      });
    });
  });

  cartFooterView?.addEventListener('click', () => {
    showFullCart();
  });

  headerCartButton?.addEventListener('click', showFullCart);

  document.querySelectorAll('.continue-shopping-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.body.classList.remove('cart-page-active');
      document.querySelector('.menu-page-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (cartRecommendations) {
    document.querySelectorAll('.products-section .product-card').forEach((card, index) => {
      if (index >= 4) return;
      const recommendation = card.cloneNode(true);
      recommendation.classList.add('cart-recommendation-card');
      cartRecommendations.append(recommendation);
    });
  }

  document.addEventListener('click', (event) => {
    const printCartButton = event.target.closest('.print-cart-btn');
    if (printCartButton) {
      openCartPrintWindow();
      return;
    }

    const addButton = event.target.closest('.add-to-cart-btn');
    if (addButton) {
      const product = getProductFromButton(addButton);
      if (!product) return;

      addProductToCart(product);
      return;
    }

    const quantityButton = event.target.closest('.qty-btn');
    if (quantityButton) {
      const index = Number(quantityButton.dataset.index);
      if (Number.isNaN(index) || !cart[index]) return;

      const direction = quantityButton.classList.contains('qty-increase') ? 1 : -1;
      cart[index].quantity += direction;

      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }

      updateCartView();
      return;
    }

    const removeButton = event.target.closest('.cart-remove-btn');
    if (removeButton) {
      const index = Number(removeButton.dataset.index);
      if (!Number.isNaN(index) && cart[index]) {
        cart.splice(index, 1);
      }
      updateCartView();
      return;
    }

    const submitButton = event.target.closest('.view-cart-btn');
    if (submitButton) {
      sendCartOrderToWhatsApp();
    }
  });

  updateCartView();

  const firstActiveButton = document.querySelector('.category-item.active');
  if (firstActiveButton) {
    const firstCategory = firstActiveButton.dataset.category;
    if (firstCategory) {
      filterCategory(firstCategory, firstActiveButton);
    }
  }
});
