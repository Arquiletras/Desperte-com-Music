# 🎵 Desperte com Música

Despertador musical inteligente — PWA instalável no Android via GitHub Pages.

## ✦ Funcionalidades

- ⏰ Alarmes programáveis com nome personalizado
- 🎶 6 sons de alarme (Piano, Pássaros, Sino Zen, Harpa, Oceano, Trompete)
- 🔔 Sino periódico a cada 15, 30, 60 ou 120 minutos
- 🎚️ Controle de volume
- 🔁 Opção de repetição diária
- 💤 Soneca de 5 minutos
- 📲 Instalável como app no Android
- 🔔 Notificações em segundo plano (via Service Worker)

---

## 📲 Como hospedar no GitHub Pages e instalar no Android

### Passo 1 — Criar repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login (ou crie uma conta gratuita)
2. Clique em **"New repository"** (botão verde)
3. Dê o nome: `desperte-com-musica`
4. Marque como **Public**
5. Clique em **"Create repository"**

### Passo 2 — Fazer upload dos arquivos

1. Na página do repositório, clique em **"uploading an existing file"**
2. Arraste os 3 arquivos de uma vez:
   - `index.html`
   - `manifest.json`
   - `sw.js`
3. Clique em **"Commit changes"**

### Passo 3 — Ativar o GitHub Pages

1. No repositório, clique em **Settings** (engrenagem)
2. No menu lateral, clique em **Pages**
3. Em "Branch", selecione **main** e clique em **Save**
4. Aguarde 1-2 minutos — o link aparecerá:
   ```
   https://SEU_USUARIO.github.io/desperte-com-musica/
   ```

### Passo 4 — Instalar no Android

1. Abra o link acima no **Chrome para Android**
2. Toque em **"Ativar notificações"** (banner amarelo)
3. Toque em **"Instalar como App"** (banner roxo) — ou use Menu ⋮ → "Adicionar à tela inicial"
4. O app aparecerá na sua tela inicial como qualquer outro aplicativo! 🎉

---

## ⚠️ Observações

- Os sons são gerados pela **Web Audio API** — sem arquivos de áudio externos
- Os alarmes em **segundo plano** funcionam via notificações do sistema (requer permissão)
- Quando o app estiver aberto, o alarme toca diretamente com animação na tela
- Os alarmes ficam salvos no dispositivo (localStorage)

---

Feito com ❤️ usando HTML, CSS e Web Audio API pura.
