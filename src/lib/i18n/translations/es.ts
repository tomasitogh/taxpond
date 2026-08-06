const es = {
  nav: {
    products: 'Productos',
    company: 'Empresa',
    productsList: {
      taxProcessor: 'Procesador de reportes fiscales',
      taxValidator: 'Validador de IDs fiscales',
      aiConciliation: 'Conciliación con IA',
      smartAudits: 'Auditorías inteligentes',
      taxCalendar: 'Calendario fiscal',
    },
    badges: {
      tryFree: '¡Pruébalo gratis!',
      aiPowered: 'Impulsado por IA',
      dontMiss: '¡No pierdas más ingresos!',
      notAvailable: 'No disponible',
    },
  },
  home: {
    badge: 'Ahora disponible en 12 países',
    hero: {
      title: 'Cumple con las regulaciones.',
      subtitle: 'Tus datos son tuyos.',
      description:
        'DuckDB ejecuta del lado del cliente — tu lado. Sube tus datos financieros, obtén reportes fiscales instantáneos y cumple con las regulaciones sin complicaciones. Construido para empresas que avanzan rápido.',
    },
    features: {
      label: 'Características',
      title: 'Todo lo que necesitas para cumplir',
      description:
        'Desde categorización automatizada hasta reportes en tiempo real, Taxpond se encarga del trabajo pesado para que puedas enfocarte en hacer crecer tu negocio.',
      items: [
        {
          title: 'Carga inteligente',
          desc: 'Arrastra y suelta archivos CSV o Excel. Nuestro parser maneja cualquier formato automáticamente.',
        },
        {
          title: 'Calendario fiscal',
          desc: 'Rastrea tus obligaciones fiscales a medida que evolucionan durante el año fiscal.',
        },
        {
          title: 'Soporte multi-país',
          desc: 'Regulaciones fiscales en muchos países, siempre actualizadas con los últimos cambios.',
        },
        {
          title: 'Validador de IDs fiscales',
          desc: 'Verifica el formato y valida identificadores fiscales como VAT, GST y números de CUIT.',
        },
      ],
    },
    cta: {
      title: '¿Listo para simplificar tus impuestos?',
      description: 'Tus datos son tuyos, cumple con Taxpond. Sin tarjeta de crédito.',
      button: 'Comienza gratis',
    },
  },
  company: {
    label: 'Sobre nosotros',
    title: 'Creemos que los reportes fiscales deberían ser sin esfuerzo.',
    story:
      'Taxpond fue fundada en 2026 por un ingeniero que tuvo la oportunidad de trabajar junto a contadores. Vio que sus colegas profesionales estaban cansados de luchar con herramientas fiscales obsoletas. Se propuso construir algo diferente: una plataforma que combina conocimiento profundo de regulaciones con diseño de software moderno. El problema más grande que identificó fue que si una empresa quería usar un servicio que compartiera datos comerciales, tenían que navegar por innumerables regulaciones y auditorías antes de poder usar esas herramientas. Con Taxpond, eso es diferente.',
    mission: {
      title: 'Nuestra Misión',
      description:
        'Existimos para eliminar la fricción del cumplimiento fiscal. Cada empresa, sin importar su tamaño o geografía, merece acceso a información fiscal precisa y en tiempo real. Construimos herramientas que convierten regulaciones complejas en datos claros y accionables.',
    },
    values: {
      title: 'Nuestros Valores',
      items: [
        {
          title: 'Precisión sobre todo',
          desc: 'Los datos fiscales son implacables. Invertimos mucho en validación, pruebas y manejo de casos extremos para asegurar que cada número sea correcto.',
        },
        {
          title: 'Transparencia radical',
          desc: 'Mostramos nuestro trabajo. Cálculo, fuente y auditoría visibles para nuestros usuarios. Sin cajas negras. Construyendo en público.',
        },
        {
          title: 'Mentalidad de constructor',
          desc: 'Entregamos rápido, iteramos seguido y escuchamos a nuestros usuarios. El mejor producto gana, no el mejor deck de presentación.',
        },
      ],
    },
    team: {
      title: 'El Equipo',
      description:
        'Somos un equipo remoto de 1 persona en Buenos Aires. Nuestros orígenes abarcan firmas de contabilidad Big Four y desarrollos en E-commerce.',
      members: [{ name: 'Tomás González Humphreys', role: 'CEO & Fundador' }],
    },
    contact: {
      title: 'Contáctanos',
      description:
        '¿Tienes una pregunta, consulta de partnership o solo quieres saludar? Escríbenos a',
    },
  },
  taxProcessor: {
    product: 'Producto',
    title: 'Procesador de reportes fiscales',
    description:
      'Sube tus datos financieros y genera reportes fiscales conformes al instante. Admite archivos CSV; próximamente más formatos.',
    howItWorks: 'Cómo funciona',
    threeSteps: 'Tres pasos para tu reporte fiscal',
    steps: {
      upload: 'Subir',
      uploadFile: 'Subir archivo',
      dragDrop: 'Arrastra y suelta o haz clic',
      step1: 'Paso 1 — Subir',
      configure: 'Configurar',
      step2: 'Paso 2 — Configurar',
      visualize: 'Visualizar',
      step3: 'Paso 3 — Visualizar',
      configHelp: 'Agrupar por Categoría (Texto) y sumar el Monto total (Número)',
    },
    recentReports: {
      title: 'Reportes recientes',
      description: 'Tus últimos reportes fiscales generados',
      status: 'Completado',
    },
    supportedFormats: {
      title: 'Formatos soportados',
      description: 'Aceptamos los formatos de datos financieros más comunes',
      comingSoon: '* Próximamente...',
    },
    tryNow: {
      title: 'Pruébalo ahora,',
      free: 'gratis',
      description: 'Sube cualquier dato, mira cómo funciona. Te gustará.',
      button: '¡Pruébalo ahora!',
      aboutUs: 'Sobre nosotros',
    },
    tryPage: {
      title: 'Comienza a subir tu reporte.',
      subtitle:
        'Recuerda, estos datos NO se comparten con nadie, esto se ejecuta en tu computadora.',
      loadingEngine: 'Cargando motor…',
      readingFile: 'Leyendo archivo…',
      onlyCsv: 'Por ahora solo se admiten archivos CSV.',
      fileTooLarge: 'El archivo es demasiado grande. El tamaño máximo es {size} MB.',
      failedLoad: 'Error al cargar el archivo',
      applyQuery: 'Aplicar consulta',
      exportCsv: 'Exportar CSV',
      rowsLoaded: 'filas cargadas',
      columnTypes: {
        string: 'Texto',
        date: 'Fecha',
        number: 'Número',
      },
      filterBy: 'Filtrar por',
      all: 'Todo',
      groupBy: 'Agrupar por',
      noRows: 'Ninguna fila coincide con la consulta actual.',
      rows: 'Filas',
      rowsCount: '{count} filas',
      showingRows: 'Mostrando {from}-{to} de {total} filas',
      pageOf: 'Página {page} de {pageCount}',
    },
  },
  taxIdValidator: {
    product: 'Producto',
    title: 'Validador de IDs fiscales',
    description:
      'Valida IDs fiscales individuales o sube un archivo CSV para validación masiva. Soporta CUIT (Argentina) y RUT (Chile).',
    loading: 'Cargando validador...',
    label: 'País / Tipo de ID fiscal',
    tabs: {
      single: 'Validar Código',
      file: 'Validar Archivo',
    },
    single: {
      enter: 'Ingresar {label}',
      valid: 'Dígito verificador válido',
      invalid: 'Dígito verificador inválido',
      example: 'Ejemplo:',
    },
    file: {
      uploadFile: 'Subir archivo',
      chooseFile: 'Seleccionar archivo CSV',
      rows: 'filas',
      selectColumn: 'Selecciona la columna con {label}',
      chooseColumn: 'Selecciona una columna...',
      validating: 'Validando...',
      validateBtn: 'Validar {label}',
      failedLoad: 'Error al cargar el archivo',
      validationFailed: 'Error de validación',
    },
    results: {
      totalRows: 'Total de filas',
      valid: 'Válidos',
      invalid: 'Inválidos',
      errors: 'Errores ({count})',
      all: 'Todos ({count})',
      exportCsv: 'Exportar CSV',
      status: 'Estado',
      showingRows: 'Mostrando 100 de {count} filas',
    },
  },
}

export default es
