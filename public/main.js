// Archivo JS principal (Vanilla JS)

console.log('AWS SBG Plaza Vespucio Console Initialized');

document.addEventListener('DOMContentLoaded', () => {
  // --- Intro Splash Screen Logic ---
  const introSplash = document.getElementById('intro-splash');
  if (introSplash) {
    // Evitar scroll durante el splash
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      introSplash.classList.add('splash-fade-out');
      document.body.style.overflow = '';
      setTimeout(() => {
        introSplash.style.display = 'none';
      }, 900);
    }, 1600);
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

  // Asignar posiciones y velocidades iniciales
  const shapeData = Array.from(shapes).map((shape) => {
    const rect = shape.getBoundingClientRect();
    const startX = rect.left + window.scrollX;
    const startY = rect.top + window.scrollY;

    // Desvincular de su anclaje CSS original para controlar con transform desde (0,0)
    shape.style.top = '0px';
    shape.style.left = '0px';
    shape.style.right = 'auto';
    shape.style.bottom = 'auto';

    // Algunos horizontales, otros verticales
    const isHorizontal = Math.random() > 0.5;
    const dir = Math.random() > 0.5 ? 1 : -1;
    const speed = Math.random() * 1.5 + 0.3;

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

      // Envolver horizontalmente
      if (data.vx > 0 && data.x > docWidth) {
        data.x = -data.width;
      } else if (data.vx < 0 && data.x + data.width < 0) {
        data.x = docWidth;
      }

      // Envolver verticalmente
      if (data.vy > 0 && data.y > docHeight) {
        data.y = -data.height;
      } else if (data.vy < 0 && data.y + data.height < 0) {
        data.y = docHeight;
      }

      data.el.style.transform = `translate3d(${data.x}px, ${data.y}px, 0)`;
    });

    requestAnimationFrame(animateShapes);
  }

  // Iniciar el bucle de animación
  requestAnimationFrame(animateShapes);

  // --- Efecto Terminal Typing ---

  // --- Window Control Buttons ---
  const btnClose = document.getElementById('btn-close-terminal');
  const errorScreen = document.getElementById('terminal-error-screen');
  const reopenBtn = document.getElementById('reopen-terminal-btn');

  if (btnClose && errorScreen) {
    btnClose.addEventListener('click', () => {
      const win = document.querySelector('.terminal-window');
      if (win) win.style.setProperty('display', 'none', 'important');
      if (errorScreen) errorScreen.style.display = 'flex';
    });

    reopenBtn.addEventListener('click', () => {
      const win = document.querySelector('.terminal-window');
      if (errorScreen) errorScreen.style.display = 'none';
      if (win) {
        win.style.setProperty('display', 'flex', 'important');
      }
      if (typeof window.resetTerminal === 'function') {
        window.resetTerminal();
      }
    });
  }
  // --------------------------------

  const terminalSection = document.querySelector('#join');
  const lines = document.querySelectorAll('.typing-line');
  let terminalStarted = false;

  function getPromptHTML() {
    if (window.innerWidth <= 768 || 'ontouchstart' in window) {
      return `<span style="color: var(--aws-mint);">❯</span>`;
    }
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-CL', { hour12: false });
    return `<span style="color: var(--aws-orange);">(${timeString})</span> <span style="color: var(--aws-mint);">git:(SBG-PlazaVespucio:main)</span><span style="color: white;">:</span>`;
  }

  function formatCommand(cmd) {
    const parts = cmd.split(' ');
    if (parts.length === 0) return '';
    const base = `<span style="color: white;">${parts[0]}</span>`;
    const args = parts
      .slice(1)
      .map((arg) => {
        if (arg.startsWith('-')) {
          return `<span style="color: #6c757d;">${arg}</span>`;
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
    }, 300);
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
        promptSpan.innerHTML = getPromptHTML();

        const cmdSpan = document.createElement('span');

        line.appendChild(promptSpan);
        line.appendChild(cmdSpan);

        let currentStr = '';
        for (let char of textToType) {
          if (currentSessionId !== sessionId) return;
          currentStr += char;
          cmdSpan.innerHTML = formatCommand(currentStr);
          await new Promise((r) => setTimeout(r, 40));
        }
      } else {
        for (let char of textToType) {
          if (currentSessionId !== sessionId) return;
          line.innerHTML += char;
          await new Promise((r) => setTimeout(r, 5));
        }
      }

      line.classList.remove('typing-cursor');

      const terminalContent = document.querySelector('.terminal-content');
      if (terminalContent) {
        requestAnimationFrame(() => {
          terminalContent.scrollTop = terminalContent.scrollHeight;
        });
      }

      await new Promise((r) => setTimeout(r, 50));
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
      const cursorContainer = customCursor.parentElement;
      let lastCursorX = 8;

      function getCursorOffset() {
        const span = document.createElement('span');
        span.style.fontFamily = "'Space Mono', monospace";
        span.style.fontSize = '0.9rem';
        span.style.visibility = 'hidden';
        span.style.whiteSpace = 'pre';
        span.textContent = terminalInput.value.substring(0, terminalInput.selectionStart);
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
      }

      function updateKittyCursor() {
        if (!customCursor || !terminalInput) return;
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

      const terminalBody = document.querySelector('.terminal-body');
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
<span style="color: var(--aws-mint);">help</span>       - Muestra esta lista de comandos
<span style="color: var(--aws-mint);">links</span>      - Muestra todos los enlaces oficiales
<span style="color: var(--aws-mint);">whoami</span>     - Muestra el usuario actual
<span style="color: var(--aws-mint);">clear</span>      - Limpia la pantalla
<span style="color: var(--aws-mint);">exit</span>       - Reinicia la animación
<span style="color: var(--aws-mint);">info</span>       - Muestra información sobre SBG Plaza Vespucio`,
        links: () => `<span style="color: var(--aws-orange);">--- ENLACES OFICIALES ---</span>
• <span style="color: var(--aws-mint);">WhatsApp:</span> https://chat.whatsapp.com/K5fZKAhGUkjGcPiIHY8PK5
• <span style="color: var(--aws-blue);">LinkedIn:</span> https://www.linkedin.com/company/aws-sbg-duoc-uc-pv
• <span style="color: var(--aws-purple);">Instagram:</span> https://www.instagram.com/aws.sbg.duocpv/
• <span style="color: var(--aws-magenta);">Meetup:</span> https://www.meetup.com/aws-sbg-at-duoc-uc-plaza-vespucio/
• <span style="color: var(--aws-orange);">IBM SkillsBuild:</span> https://www.yourbigyear.com/ibm-skillsbuild-ambassador-program`,
        whoami: () => `builder@plaza-vespucio`,
        info: (args) => {
          if (args.includes('--ALL') || args.includes('--all')) {
            return `<span style="color: var(--aws-orange);">--- AWS SBG PLAZA VESPUCIO ---</span>
<b>Organización:</b> AWS Student Builder Group at Duoc UC Plaza Vespucio
<b>Misión:</b> Fomentar el desarrollo de habilidades Cloud, IA, metodologías ágiles y certificaciones técnicas.
<b>Comunidad:</b> Abierta a todos los apasionados por la tecnología y la innovación en la nube.
<br>
<span style="color: var(--aws-blue);"><b>Programas & Alianzas:</b></span>
 • AWS Student Builder Groups
 • IBM SkillsBuild Ambassador Program
 • Talleres prácticos y preparación para exámenes AWS`;
          }
          return `AWS Student Builder Group Plaza Vespucio. Usa 'info --ALL' o 'links' para más datos.`;
        },
        sudo: () => `<span style="color: red;">Acceso concedido con privilegios de Builder 🚀</span>`,
        rm: () => `<span style="color: red;">rm: operación denegada en modo seguro.</span>`,
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
                output = `<span style="color: red;">comando no encontrado: ${baseCmd}. Escribe 'help' para ver la lista.</span>`;
              }

              newEntry.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    ${interactivePrompt.innerHTML} <span>${formatCommand(commandStr)}</span>
                </div>
                <div style="color: #a1aab5; margin-top: 2px; line-height: 1.4; white-space: pre-line; font-size: 0.9rem; font-family: 'Space Mono', monospace;">${output}</div>
              `;
              terminalHistory.appendChild(newEntry);
            }
          }

          terminalInput.value = '';
          interactivePrompt.innerHTML = getPromptHTML();
          terminalInput.dispatchEvent(new Event('input'));

          const terminalContent = document.querySelector('.terminal-content');
          if (terminalContent) {
            requestAnimationFrame(() => {
              terminalContent.scrollTop = terminalContent.scrollHeight;
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
    { threshold: 0.5 }
  );

  if (terminalSection) {
    observer.observe(terminalSection);
  }
});
