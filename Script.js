if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js')
      .then(reg => console.log('Registro de SW exitosoo', reg))
      .catch(err => console.warn('Error al tratar de registrar el sw', err))
  }