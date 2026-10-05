    const tabs = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.tab-panel');
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');
    const menuToggle = document.getElementById('menu-toggle');
    const menuList = document.getElementById('menu-list');
    const forgotPasswordLink = document.getElementById('forgot-password');
    const profileArea = document.getElementById('profile-area');
    const profileUser = document.getElementById('profile-user');
    const profileRole = document.getElementById('profile-role');
    const offersForm = document.getElementById('offers-form');
    const offersMessage = document.getElementById('offers-message');
    const offersTableBody = document.getElementById('offers-table-body');
    const newOfferButton = document.getElementById('btn-nueva-vacante');

    const knownUsers = [
      { username: 'admin', password: 'admin123', role: 'administrador' },
      { username: 'empleador', password: 'empleo123', role: 'empleador' },
      { username: 'empleado', password: 'empleo456', role: 'empleado' }
    ];
    const offerRecords = [];

    function activateTab(targetId) {
      tabs.forEach(button => {
        const isActive = button.dataset.target === targetId;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
      });
      panels.forEach(panel => {
        const shouldShow = panel.id === targetId;
        panel.hidden = !shouldShow;
        panel.classList.toggle('active', shouldShow);
      });
      profileArea.hidden = true;
      menuList.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab.dataset.target));
    });

    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      loginMessage.textContent = '';
      const username = loginForm.username.value.trim();
      const password = loginForm.password.value;

      if (!username || !password) {
        loginMessage.textContent = 'Por favor completa todos los campos.';
        loginMessage.className = 'message warning';
        return;
      }

      const user = knownUsers.find(u => u.username === username && u.password === password);
      if (user) {
        loginMessage.textContent = `Bienvenido ${user.username}, has iniciado sesión como ${user.role}.`;
        loginMessage.className = 'message success';
        profileUser.textContent = user.username;
        profileRole.textContent = user.role;
      } else {
        loginMessage.textContent = 'Credenciales inválidas. Verifica usuario, contraseña y tipo de usuario.';
        loginMessage.className = 'message error';
      }
    });

    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuList.hidden = expanded;
    });

    menuList.addEventListener('click', event => {
      if (!(event.target instanceof HTMLButtonElement)) return;
      const action = event.target.dataset.action;
      if (action === 'profile') {
        profileArea.hidden = false;
        activateTab('menu-panel');
      } else if (action === 'settings') {
        profileArea.hidden = true;
        alert('Función de configuración próximamente.');
      } else if (action === 'logout') {
        profileArea.hidden = true;
        alert('Sesión cerrada. Vuelve a iniciar sesión si lo deseas.');
      }
      menuList.hidden = true;
      menuToggle.setAttribute('aria-expanded', 'false');
    });

    newOfferButton.addEventListener('click', () => {
      offersForm.offerName.focus();
      offersForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    offersForm.addEventListener('submit', event => {
      event.preventDefault();
      offersMessage.textContent = '';
      offersMessage.className = 'message';

      const offerName = offersForm.offerName.value.trim();
      const shortDescription = offersForm.shortDescription.value.trim();
      const keywords = offersForm.keywords.value.trim();
      const profileDescription = offersForm.profileDescription.value.trim();

      if (!offerName || !shortDescription || !keywords || !profileDescription) {
        offersMessage.textContent = 'Completa todos los campos antes de guardar la oferta.';
        offersMessage.className = 'message warning';
        return;
      }

      const newOffer = {
        offerName,
        shortDescription,
        keywords,
        profileDescription
      };

      offerRecords.push(newOffer);
      console.log('Registro de ofertas actual:', offerRecords);
      for (let i = 0; i < offerRecords.length; i += 1) {
        console.log(`Oferta ${i + 1}:`, offerRecords[i]);
      }

      renderOffersTable();
      offersMessage.textContent = 'Oferta guardada correctamente.';
      offersMessage.className = 'message success';
      offersForm.reset();
    });

    function renderOffersTable() {
      offersTableBody.innerHTML = '';

      if (offerRecords.length === 0) {
        offersTableBody.innerHTML = '<tr><td colspan="4">No hay ofertas registradas aún.</td></tr>';
        return;
      }

      for (let index = 0; index < offerRecords.length; index += 1) {
        const offer = offerRecords[index];
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${offer.offerName}</td>
          <td>${offer.shortDescription}</td>
          <td>${offer.keywords}</td>
          <td>${offer.profileDescription}</td>
          <td>
            <button class="secondary-button delete-button" type="button" data-index="${index}">Borrar</button>
          </td>
        `;
        offersTableBody.appendChild(row);
      }
    }

    offersTableBody.addEventListener('click', event => {
      const button = event.target.closest('button.delete-button');
      if (!button) return;
      const index = Number(button.dataset.index);
      if (Number.isNaN(index)) return;
      offerRecords.splice(index, 1);
      console.log('Oferta eliminada. Registro de ofertas:', offerRecords);
      renderOffersTable();
    });

    forgotPasswordLink.addEventListener('click', event => {
      event.preventDefault();
      alert('Se ha enviado un enlace de recuperación a tu correo electrónico registrado.');
    });

    document.addEventListener('click', event => {
      if (!menuToggle.contains(event.target) && !menuList.contains(event.target)) {
        menuList.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });