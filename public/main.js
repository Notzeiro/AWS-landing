// Archivo JS principal (Vanilla JS)

console.log('AWS SBG Plaza Vespucio Console Initialized');

document.addEventListener('DOMContentLoaded', () => {
  // --- Intro Splash Screen Logic ---
  const introSplash = document.getElementById('intro-splash');
  if (introSplash) {
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      introSplash.classList.add('splash-fade-out');
      document.body.style.overflow = '';
      setTimeout(() => {
        introSplash.style.display = 'none';
      }, 750);
    }, 1400);
  }

  // --- Modal System ---
  const modalTriggers = document.querySelectorAll('[data-modal]');
  const modalCloseBtns = document.querySelectorAll('[data-close]');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  function openModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      const content = modal.querySelector('.modal-content');
      if (content) content.scrollTop = 0;
    }
  }

  function closeModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  modalOverlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach((overlay) => {
        overlay.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  // Efecto Animación Infinita para las capas geométricas (Shapes)
  const shapes = document.querySelectorAll('.bg-shape');

  const shapeData = Array.from(shapes).map((shape) => {
    const rect = shape.getBoundingClientRect();
    const startX = rect.left + window.scrollX;
    const startY = rect.top + window.scrollY;

    shape.style.top = '0px';
    shape.style.left = '0px';
    shape.style.right = 'auto';
    shape.style.bottom = 'auto';

    const isHorizontal = Math.random() > 0.5;
    const dir = Math.random() > 0.5 ? 1 : -1;
    const speed = Math.random() * 1.2 + 0.3;

    return {
      el: shape,
      x: startX,
      y: startY,
      vx: isHorizontal ? dir * speed : 0,
      vy: !isHorizontal ? dir * speed : 0,
      width: shape.offsetWidth,
      height: shape.offsetHeight,
    };
  });

  function animateShapes() {
    const docWidth = document.documentElement.scrollWidth;
    const docHeight = document.documentElement.scrollHeight;

    shapeData.forEach((data) => {
      data.x += data.vx;
      data.y += data.vy;

      if (data.vx > 0 && data.x > docWidth) {
        data.x = -data.width;
      } else if (data.vx < 0 && data.x + data.width < 0) {
        data.x = docWidth;
      }

      if (data.vy > 0 && data.y > docHeight) {
        data.y = -data.height;
      } else if (data.vy < 0 && data.y + data.height < 0) {
        data.y = docHeight;
      }

      data.el.style.transform = `translate3d(${data.x}px, ${data.y}px, 0)`;
    });

    requestAnimationFrame(animateShapes);
  }

  requestAnimationFrame(animateShapes);

  // --- MAC Window Control Buttons ---
  const btnClose = document.getElementById('btn-close-terminal');
  const errorScreen = document.getElementById('terminal-error-screen');
  const reopenBtn = document.getElementById('reopen-terminal-btn');

  if (btnClose && errorScreen) {
    btnClose.addEventListener('click', () => {
      const win = document.querySelector('.mac-terminal-window');
      if (win) win.style.setProperty('display', 'none', 'important');
      if (errorScreen) errorScreen.style.display = 'flex';
    });

    reopenBtn.addEventListener('click', () => {
      const win = document.querySelector('.mac-terminal-window');
      if (errorScreen) errorScreen.style.display = 'none';
      if (win) {
        win.style.setProperty('display', 'flex', 'important');
      }
      if (typeof window.resetTerminal === 'function') {
        window.resetTerminal();
      }
    });
  }

  // --- Terminal Typing Logic ---
  const terminalSection = document.querySelector('#terminal-section');
  const lines = document.querySelectorAll('.typing-line');
  let terminalStarted = false;

  function getPromptHTML() {
    if (window.innerWidth <= 768 || 'ontouchstart' in window) {
      return `<span style="color: var(--aws-mint);">➜</span> <span style="color: var(--aws-blue);">~</span>`;
    }
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-CL', { hour12: false });
    return `<span style="color: var(--aws-orange);">[${timeString}]</span> <span style="color: var(--aws-mint);">builder@pv</span>:<span style="color: var(--aws-blue);">~/workspace</span> <span style="color: var(--text-light);">$</span>`;
  }

  function formatCommand(cmd) {
    const parts = cmd.split(' ');
    if (parts.length === 0) return '';
    const base = `<span style="color: #fff; font-weight: 600;">${parts[0]}</span>`;
    const args = parts
      .slice(1)
      .map((arg) => {
        if (arg.startsWith('-')) {
          return `<span style="color: var(--aws-orange);">${arg}</span>`;
        }
        return `<span style="color: #a1aab5;">${arg}</span>`;
      })
      .join(' ');
    return args ? `${base} ${args}` : base;
  }

  let currentSessionId = 0;

  window.resetTerminal = function () {
    currentSessionId++;
    const terminalHistory = document.getElementById('terminal-history');
    const terminalInput = document.getElementById('terminal-input');
    const interactiveSection = document.getElementById('terminal-interactive');

    if (terminalHistory) terminalHistory.innerHTML = '';
    if (terminalInput) terminalInput.value = '';
    if (interactiveSection) interactiveSection.style.display = 'none';

    document.querySelectorAll('.typing-line').forEach((el) => {
      el.style.display = 'flex';
      if (!el.hasAttribute('data-is-cmd')) el.style.display = 'block';
      el.innerHTML = '';
      el.classList.remove('typing-cursor');
    });

    setTimeout(() => {
      typeLines();
    }, 200);
  };

  async function typeLines() {
    const sessionId = ++currentSessionId;
    for (let i = 0; i < lines.length; i++) {
      if (currentSessionId !== sessionId) return;

      const line = lines[i];
      let textToType = line.getAttribute('data-text');
      const isCmd = line.getAttribute('data-is-cmd') === 'true';

      line.innerHTML = '';
      line.classList.add('typing-cursor');

      if (isCmd) {
        const promptSpan = document.createElement('div');
        promptSpan.style.display = 'flex';
        promptSpan.style.alignItems = 'center';
        promptSpan.style.gap = '8px';
        promptSpan.innerHTML = getPromptHTML();

        const cmdSpan = document.createElement('span');

        line.appendChild(promptSpan);
        line.appendChild(cmdSpan);

        let currentStr = '';
        for (let char of textToType) {
          if (currentSessionId !== sessionId) return;
          currentStr += char;
          cmdSpan.innerHTML = formatCommand(currentStr);
          await new Promise((r) => setTimeout(r, 35));
        }
      } else {
        for (let char of textToType) {
          if (currentSessionId !== sessionId) return;
          line.innerHTML += char;
          await new Promise((r) => setTimeout(r, 4));
        }
      }

      line.classList.remove('typing-cursor');

      const terminalBody = document.querySelector('.mac-terminal-body');
      if (terminalBody) {
        requestAnimationFrame(() => {
          terminalBody.scrollTop = terminalBody.scrollHeight;
        });
      }

      await new Promise((r) => setTimeout(r, 40));
    }

    if (currentSessionId !== sessionId) return;

    const interactiveSection = document.getElementById('terminal-interactive');
    const interactivePrompt = document.getElementById('interactive-prompt');
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');

    if (interactiveSection && interactivePrompt && terminalInput) {
      interactivePrompt.innerHTML = getPromptHTML();
      interactiveSection.style.display = 'flex';

      if (window.innerWidth <= 768 || 'ontouchstart' in window) {
        terminalInput.readOnly = true;
        terminalInput.placeholder = 'Modo lectura en móvil';
        terminalInput.blur();
      } else {
        terminalInput.focus();
      }

      if (terminalInput.hasAttribute('data-listeners-attached')) return;
      terminalInput.setAttribute('data-listeners-attached', 'true');

      // --- Cursor Trail Logic ---
      const customCursor = document.getElementById('custom-cursor');
      const cursorContainer = customCursor ? customCursor.parentElement : null;
      let lastCursorX = 8;

      function getCursorOffset() {
        const span = document.createElement('span');
        span.style.fontFamily = "'Fira Code', monospace";
        span.style.fontSize = '0.95rem';
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'pre';
        span.textContent = terminalInput.value.substring(0, terminalInput.selectionStart);
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
      }

      function updateKittyCursor() {
        if (!customCursor || !terminalInput || !cursorContainer) return;
        const width = getCursorOffset();
        const newX = 8 + width;

        if (Math.abs(newX - lastCursorX) > 0.5) {
          customCursor.classList.remove('blink');

          const trail = document.createElement('div');
          trail.className = 'kitty-trail-block';
          trail.style.left = lastCursorX + 'px';
          cursorContainer.appendChild(trail);

          setTimeout(() => trail.remove(), 400);

          clearTimeout(customCursor.blinkTimeout);
          customCursor.blinkTimeout = setTimeout(() => {
            customCursor.classList.add('blink');
          }, 300);
        }

        customCursor.style.left = newX + 'px';
        lastCursorX = newX;
      }

      terminalInput.addEventListener('input', updateKittyCursor);
      terminalInput.addEventListener('keydown', () => setTimeout(updateKittyCursor, 10));
      terminalInput.addEventListener('keyup', () => setTimeout(updateKittyCursor, 10));
      terminalInput.addEventListener('click', updateKittyCursor);

      const terminalBody = document.querySelector('.mac-terminal-body');
      if (terminalBody) {
        terminalBody.addEventListener('click', () => {
          if (window.getSelection().toString() === '') {
            if (!(window.innerWidth <= 768 || 'ontouchstart' in window)) {
              terminalInput.focus();
            }
          }
        });
      }

      const commands = {
        help: () => `Comandos disponibles:
<span style="color: var(--aws-mint);">help</span>       - Lista todos los comandos
<span style="color: var(--aws-mint);">links</span>      - Enlaces a nuestras redes oficiales
<span style="color: var(--aws-mint);">free</span>       - Beneficios y cursos 100% gratuitos
<span style="color: var(--aws-mint);">whoami</span>     - Información de usuario
<span style="color: var(--aws-mint);">clear</span>      - Limpia la pantalla
<span style="color: var(--aws-mint);">exit</span>       - Reinicia la consola`,
        free: () => `<span style="color: var(--aws-orange);">🎁 RECURSOS Y CURSOS GRATIS DISPONIBLES:</span>
• <span style="color: var(--aws-purple);">IBM SkillsBuild:</span> Credenciales oficiales gratis en IA, Cloud y Ciberseguridad
• <span style="color: var(--aws-mint);">AWS Skill Builder:</span> +600 cursos gratuitos de Amazon Web Services
• <span style="color: var(--aws-blue);">Workshops SBG:</span> Talleres y guías de estudio para la sede Plaza Vespucio`,
        links: () => `<span style="color: var(--aws-orange);">--- CANALES OFICIALES AWS SBG PLAZA VESPUCIO ---</span>
• <span style="color: var(--aws-mint);">WhatsApp:</span> https://chat.whatsapp.com/K5fZKAhGUkjGcPiIHY8PK5
• <span style="color: var(--aws-orange);">Meetup:</span> https://www.meetup.com/aws-sbg-at-duoc-uc-plaza-vespucio/
• <span style="color: var(--aws-blue);">LinkedIn:</span> https://www.linkedin.com/company/aws-sbg-duoc-uc-pv
• <span style="color: var(--aws-purple);">Instagram:</span> https://www.instagram.com/aws.sbg.duocpv/
• <span style="color: var(--aws-magenta);">IBM Ambassador:</span> https://www.yourbigyear.com/ibm-skillsbuild-ambassador-program`,
        whoami: () => `builder@plaza-vespucio (AWS SBG Community Member)`,
        sudo: () => `<span style="color: var(--aws-mint);">Acceso concedido. ¡A construir en la nube! 🚀</span>`,
        rm: () => `<span style="color: var(--mac-red);">Operación cancelada: el entorno está protegido.</span>`,
      };

      let commandHistory = [];
      let historyIndex = -1;

      terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const commandStr = terminalInput.value.trim();

          if (commandStr) {
            commandHistory.push(commandStr);
            historyIndex = commandHistory.length;
          }

          const newEntry = document.createElement('div');
          newEntry.style.marginBottom = '8px';

          if (!commandStr) {
            newEntry.innerHTML = `<div style="display: flex; align-items: center; gap: 8px;">${interactivePrompt.innerHTML}</div>`;
            terminalHistory.appendChild(newEntry);
          } else {
            const cmdParts = commandStr.split(' ');
            const baseCmd = cmdParts[0].toLowerCase();
            const args = cmdParts.slice(1);

            if (baseCmd === 'clear') {
              terminalHistory.innerHTML = '';
              document
                .querySelectorAll('.typing-line')
                .forEach((el) => (el.style.display = 'none'));
              newEntry.innerHTML = '';
            } else if (baseCmd === 'exit') {
              if (typeof window.resetTerminal === 'function') {
                window.resetTerminal();
              }
              return;
            } else {
              let output;
              if (commands[baseCmd]) {
                output = commands[baseCmd](args);
              } else {
                output = `<span style="color: var(--mac-red);">comando no encontrado: ${baseCmd}. Escribe 'help' para ver la lista.</span>`;
              }

              newEntry.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${interactivePrompt.innerHTML} <span>${formatCommand(commandStr)}</span>
                </div>
                <div style="color: #a1aab5; margin-top: 3px; line-height: 1.5; white-space: pre-line; font-size: 0.92rem;">${output}</div>
              `;
              terminalHistory.appendChild(newEntry);
            }
          }

          terminalInput.value = '';
          interactivePrompt.innerHTML = getPromptHTML();
          terminalInput.dispatchEvent(new Event('input'));

          const terminalBody = document.querySelector('.mac-terminal-body');
          if (terminalBody) {
            requestAnimationFrame(() => {
              terminalBody.scrollTop = terminalBody.scrollHeight;
            });
          }
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            terminalInput.value = commandHistory[historyIndex];
            terminalInput.dispatchEvent(new Event('input'));
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            terminalInput.value = commandHistory[historyIndex];
            terminalInput.dispatchEvent(new Event('input'));
          } else {
            historyIndex = commandHistory.length;
            terminalInput.value = '';
            terminalInput.dispatchEvent(new Event('input'));
          }
        } else if (e.key === 'Tab') {
          e.preventDefault();
          const currentVal = terminalInput.value.trim();
          if (!currentVal) return;

          const availableCommands = Object.keys(commands).concat(['clear', 'exit']);
          const matches = availableCommands.filter((cmd) =>
            cmd.startsWith(currentVal.toLowerCase())
          );

          if (matches.length === 1) {
            terminalInput.value = matches[0] + ' ';
            terminalInput.dispatchEvent(new Event('input'));
          }
        }
      });
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !terminalStarted) {
          terminalStarted = true;
          typeLines();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (terminalSection) {
    observer.observe(terminalSection);
  }
});
