// Referências dos elementos do DOM
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const capturedImage = document.getElementById('capturedImage');
const studentNameInput = document.getElementById('studentName');
const filterSelect = document.getElementById('filterSelect');
const btnStart = document.getElementById('btnStart');
const btnCapture = document.getElementById('btnCapture');
const btnStop = document.getElementById('btnStop');
const statusMessage = document.getElementById('statusMessage');
const cameraOffPlaceholder = document.getElementById('cameraOffPlaceholder');
const imagePlaceholder = document.getElementById('imagePlaceholder');

// Guardará a referência do stream ativo da câmera
let mediaStream = null;

// Exibe mensagens de orientação e erro (RF07)
function showStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

function clearStatus() {
  statusMessage.textContent = '';
  statusMessage.className = 'status-message';
}

/**
 * RF01 — Ligar a câmera com getUserMedia
 */
async function startCamera() {
  clearStatus();
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });

    video.srcObject = mediaStream;
    video.classList.remove('hidden');
    cameraOffPlaceholder.classList.add('hidden');

    btnStart.disabled = true;
    btnCapture.disabled = false;
    btnStop.disabled = false;

    showStatus('Câmera conectada com sucesso!', 'info');
  } catch (error) {
    console.error('Erro ao acessar a câmera:', error);

    // RF07 — Tratamento de permissão negada ou ausência de dispositivo
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      showStatus('Permissão para acessar a câmera foi negada. Permita o acesso nas configurações do seu navegador.', 'error');
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      showStatus('Nenhum dispositivo de câmera foi encontrado no sistema.', 'error');
    } else {
      showStatus('Erro ao iniciar câmera: ' + error.message, 'error');
    }
  }
}

/**
 * RF06 — Desligar Câmera (Encerra as tracks do stream)
 */
function stopCamera() {
  if (mediaStream) {
    // Percorre cada faixa (track) do stream para encerrar o hardware
    mediaStream.getTracks().forEach(track => {
      track.stop();
    });
    mediaStream = null;
  }

  video.srcObject = null;
  video.classList.add('hidden');
  cameraOffPlaceholder.classList.remove('hidden');

  btnStart.disabled = false;
  btnCapture.disabled = true;
  btnStop.disabled = true;

  showStatus('Câmera desligada e recursos liberados.', 'info');
}

/**
 * RF02, RF03, RF04, RF05 — Capturar foto, aplicar filtro e escrever dados no Canvas
 */
function capturePhoto() {
  clearStatus();

  // RF07 — Tratamento se tentar capturar sem câmera ativa
  if (!mediaStream || !video.srcObject) {
    showStatus('A câmera precisa estar ligada para fazer a captura!', 'error');
    return;
  }

  const context = canvas.getContext('2d');

  // Ajusta a resolução do canvas para corresponder ao vídeo real
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;
  canvas.width = width;
  canvas.height = height;

  // RF03 — Aplica o filtro visual via context.filter
  const selectedFilter = filterSelect.value;
  context.filter = selectedFilter;

  // Desenha a imagem do vídeo no canvas com o filtro
  context.drawImage(video, 0, 0, width, height);

  // Remove o filtro para não alterar o texto das informações
  context.filter = 'none';

  // RF04 — Captura dados dinâmicos (Nome + Data/Hora)
  const studentName = studentNameInput.value.trim() || 'Aluno Não Identificado';
  const now = new Date();
  const timestampText = `${now.toLocaleDateString('pt-BR')} - ${now.toLocaleTimeString('pt-BR')}`;

  // Tarja inferior para garantir a leitura do texto
  const barHeight = Math.max(50, height * 0.14);
  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  context.fillRect(0, height - barHeight, width, barHeight);

  // Inserção dos textos dinâmicos (context.fillText)
  const fontSize = Math.max(16, Math.floor(barHeight * 0.32));
  context.font = `bold ${fontSize}px sans-serif`;
  context.fillStyle = '#FFFFFF';
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  // Nome do aluno
  context.fillText(`Aluno: ${studentName}`, 15, height - (barHeight * 0.65));

  // Data e hora
  context.font = `${Math.floor(fontSize * 0.85)}px sans-serif`;
  context.fillStyle = '#00B37E';
  context.fillText(`Data/Hora: ${timestampText}`, 15, height - (barHeight * 0.25));

  // RF05 — Exibe a foto final na interface
  capturedImage.src = canvas.toDataURL('image/png');
  capturedImage.classList.remove('hidden');
  imagePlaceholder.classList.add('hidden');

  showStatus('Foto capturada e processada com sucesso!', 'info');
}

// Eventos dos botões
btnStart.addEventListener('click', startCamera);
btnStop.addEventListener('click', stopCamera);
btnCapture.addEventListener('click', capturePhoto);