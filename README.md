# Capturador de Câmera com Canvas

**Curso:** Programação Front-End  
**Professora:** Andreza Quintas  

---

## Integrantes
* **Miguel Araújo de Godoi Freitas**


---

##  Descrição da Aplicação
Aplicação web construída com HTML5, CSS3 e JavaScript nativo que acessa a câmera do dispositivo, realiza capturas e processa imagens no navegador utilizando a API do HTML Canvas.

### Destaques das Funcionalidades:
- **Acesso em Tempo Real:** Solicita permissão e exibe o vídeo ao vivo (`getUserMedia`).
- **Filtros Visuais:** Aplica efeitos como Sépia, Grayscale e Invertido diretamente no Canvas (`context.filter`).
- **Marca D'água Dinâmica:** Renderiza o nome do aluno e o carimbo de data e hora sobre a fotografia capturada (`context.fillText`).
- **Gerenciamento de Hardware:** Encerra corretamente todas as faixas (*tracks*) da câmera (`track.stop()`) ao clicar em "Desligar Câmera".
- **Tratamento de Erros:** Orienta o usuário caso a permissão seja negada ou o dispositivo não seja encontrado.