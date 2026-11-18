/* ---------- Práctica: id de lección → [[pregunta, [opciones], índice de la correcta, explicación], …] ---------- */
const QUIZ={
red:[
 ['Tu aplicación debe seguir funcionando aunque un centro de datos entero se quede sin luz. ¿Qué haces?',['Desplegarla en dos zonas de disponibilidad de la misma región','Usar una instancia más grande','Crear dos VPC en la misma zona'],0,'Cada zona tiene energía y red propias. Estar en dos es la forma estándar de sobrevivir a la caída de una.'],
 ['¿Qué hace que una subred sea pública?',['Que sus instancias tengan un security group abierto','Que su tabla de rutas tenga una ruta hacia un Internet Gateway','Que esté en la primera zona de la región'],1,'Pública o privada lo decide la tabla de rutas. El security group controla después qué tráfico acepta cada recurso.'],
 ['Un servidor en una subred privada necesita descargar actualizaciones de internet. ¿Qué pieza lo permite sin exponerlo?',['Un Internet Gateway asociado a la instancia','Una IP pública','Un NAT Gateway en una subred pública'],2,'El NAT Gateway deja salir conexiones iniciadas dentro y bloquea las iniciadas fuera.']],
entrega:[
 ['Quieres enviar el 10 % de los usuarios a la versión nueva de tu web. ¿Qué servicio lo resuelve a nivel de dominio?',['CloudFront','Route 53 con enrutamiento ponderado','Un NAT Gateway'],1,'Route 53 puede repartir las respuestas DNS por pesos entre varios destinos.'],
 ['Tu juego en línea usa UDP y necesita una IP fija. ¿Qué balanceador eliges?',['Network Load Balancer','Application Load Balancer','API Gateway'],0,'El NLB trabaja con TCP y UDP y ofrece IP estática. El ALB solo entiende HTTP.'],
 ['¿Por qué CloudFront hace que una web cargue más rápido para usuarios lejanos?',['Porque comprime la base de datos','Porque aumenta la CPU del servidor','Porque sirve copias en caché desde un punto cercano al usuario'],2,'El contenido se entrega desde el punto de presencia más próximo, sin viajar hasta el origen en cada petición.']],
ec2:[
 ['Detienes una instancia EC2 durante el fin de semana. ¿Qué sigues pagando?',['Nada','El volumen EBS','La instancia a mitad de precio'],1,'Detenida no se cobra cómputo, pero el disco sigue existiendo y ocupando almacenamiento.'],
 ['Tienes un proceso de cálculo que puede interrumpirse y retomarse. ¿Qué opción de compra es la más barata?',['Bajo demanda','Savings Plan a 3 años','Spot'],2,'Spot ofrece los mayores descuentos a cambio de que AWS pueda reclamar la instancia con dos minutos de aviso.'],
 ['¿Cómo debe obtener una instancia EC2 permiso para leer de un bucket de S3?',['Asumiendo un rol de IAM','Con claves de acceso guardadas en un archivo','Abriendo el puerto 443 en su security group'],0,'El rol entrega credenciales temporales que se renuevan solas. Nunca se guardan claves en el disco.']],
autoscaling:[
 ['Una instancia del grupo deja de responder a las comprobaciones de salud. ¿Qué hace el Auto Scaling group?',['Avisa y espera a que alguien la reinicie','La da de baja y lanza otra igual','Reduce el mínimo del grupo'],1,'El grupo mantiene la capacidad deseada reemplazando las instancias que fallan.'],
 ['¿Qué tipo de política es «mantén la CPU media en el 60 %»?',['Seguimiento de objetivo','Programada','Por pasos'],0,'En el seguimiento de objetivo fijas un valor para una métrica y el grupo añade o quita instancias para mantenerlo.'],
 ['¿Cuánto cuesta usar Auto Scaling?',['Un porcentaje del coste de las instancias','Una cuota por grupo','Nada: solo pagas las instancias encendidas'],2,'El servicio no tiene coste propio.']],
lambda:[
 ['Una función tarda 25 minutos en procesar un vídeo. ¿Encaja en una función Lambda normal?',['Sí, si le das más memoria','No: el máximo son 15 minutos por ejecución','Sí, si se invoca de forma asíncrona'],1,'El límite de tiempo no depende de la memoria. Para trabajos largos encajan mejor Fargate o Batch.'],
 ['Llegan 500 peticiones a la vez a una función. ¿Qué ocurre?',['Se ejecutan 500 copias en paralelo','Se encolan y se atienden una a una','Se rechazan 499'],0,'Cada copia atiende un evento a la vez; Lambda crea tantas como peticiones simultáneas haya, hasta el límite de concurrencia.'],
 ['¿Qué reduce el arranque en frío a cambio de pagar por copias que están esperando?',['Aumentar el tiempo máximo','Usar una cola SQS','Concurrencia aprovisionada'],2,'La concurrencia aprovisionada mantiene entornos ya inicializados.']],
ecs:[
 ['En ECS, ¿qué es una definición de tarea?',['Un contenedor en ejecución','La receta: imagen, CPU, memoria, puertos y rol','El grupo de instancias del clúster'],1,'La tarea es la definición puesta en marcha; la definición es solo la descripción.'],
 ['Quieres que siempre haya 3 copias de tu API y que se repongan si mueren. ¿Qué creas?',['Un servicio de ECS','Tres tareas sueltas','Una definición de tarea con tres contenedores'],0,'El servicio mantiene el número deseado de tareas y las registra en el balanceador.'],
 ['¿Cómo recibe permisos de AWS un contenedor en ECS?',['Hereda los del usuario que lo desplegó','Con claves en variables de entorno','Con un rol de IAM asignado a la tarea'],2,'Cada tarea tiene su propio rol, así cada contenedor accede solo a lo suyo.']],
fargate:[
 ['¿Qué es Fargate?',['Un orquestador que sustituye a ECS','Cómputo sin servidores sobre el que ECS o EKS ejecutan contenedores','Un registro de imágenes'],1,'Fargate no decide qué se lanza: pone la capacidad para lo que el orquestador decida.'],
 ['Tu contenedor necesita una GPU. ¿Puedes usar Fargate?',['No: hay que usar instancias EC2','Sí, eligiendo la tarea más grande','Sí, con Fargate Spot'],0,'Fargate no admite GPU. Para eso el clúster necesita instancias EC2 con GPU.'],
 ['¿Por qué se paga en Fargate?',['Por instancia y hora','Por petición recibida','Por la vCPU y la memoria de cada tarea, por segundo'],2,'Se factura lo que pide cada tarea mientras está en marcha.']],
eks:[
 ['En EKS, ¿quién opera el plano de control de Kubernetes?',['Tú, en instancias EC2','AWS','El proveedor de Kubernetes que elijas'],1,'EKS gestiona el plano de control; tú decides la versión y cuándo actualizar.'],
 ['Tu equipo es pequeño, nunca ha usado Kubernetes y solo desplegará en AWS. ¿Qué es más razonable?',['ECS con Fargate','EKS con nodos autogestionados','EKS con Auto Mode'],0,'Kubernetes aporta ecosistema y portabilidad, pero exige conocerlo. ECS resuelve lo mismo con menos piezas.'],
 ['¿Qué es un pod?',['Una instancia EC2 del clúster','Un balanceador creado por Kubernetes','La unidad mínima: uno o varios contenedores que viven juntos'],2,'Los pods se ejecutan sobre nodos o sobre Fargate.']],
batch:[
 ['¿Qué pasa en Batch cuando la cola de trabajos se queda vacía?',['Las instancias siguen encendidas','El entorno de cómputo se reduce, hasta cero si lo configuras así','Se borra la cola'],1,'Un entorno gestionado escala según los trabajos pendientes.'],
 ['¿Por qué Batch encaja bien con instancias Spot?',['Porque un trabajo interrumpido se puede reintentar','Porque Spot es más rápido','Porque Batch solo funciona con Spot'],0,'Un trabajo por lotes tolera reintentos, así que la interrupción solo cuesta tiempo.'],
 ['Necesitas ejecutar 10 000 simulaciones independientes de 40 minutos cada una. ¿Qué servicio encaja?',['Lambda','API Gateway','Batch'],2,'Superan los 15 minutos de Lambda y son trabajos que empiezan y terminan.']],
beanstalk:[
 ['¿Qué crea Elastic Beanstalk al desplegar tu aplicación?',['Solo una función Lambda','Balanceador, Auto Scaling group, instancias EC2 y alarmas','Un clúster de Kubernetes'],1,'Son recursos normales en tu cuenta, creados y conectados por Beanstalk.'],
 ['¿Qué estrategia de despliegue lanza instancias nuevas y solo retira las viejas si las nuevas están sanas?',['Inmutable','Todo a la vez','Por tandas'],0,'Con el despliegue inmutable, si la versión nueva falla las instancias antiguas siguen atendiendo.'],
 ['¿Cuánto cuesta Beanstalk?',['Una cuota mensual por entorno','Un porcentaje sobre EC2','Nada: pagas los recursos que crea'],2,'El servicio no añade coste.']],
lightsail:[
 ['¿Qué distingue a Lightsail de EC2?',['Es más potente','Tiene un precio mensual fijo que incluye máquina, disco y tráfico','No permite instalar software'],1,'Cambia flexibilidad por sencillez y coste previsible.'],
 ['Tu blog en Lightsail crece y ahora necesitas escalado automático. ¿Qué haces?',['Exportar una instantánea y pasar a EC2','Activar Auto Scaling en Lightsail','Contratar un plan mayor'],0,'Lightsail no tiene escalado automático; sus instantáneas se pueden exportar a EC2.'],
 ['¿Para qué caso NO encaja Lightsail?',['Un sitio pequeño','Un entorno de pruebas','Una plataforma con picos fuertes e impredecibles'],2,'Sin escalado automático ni tipos de instancia a medida, no absorbe bien cargas variables.']],
elegircomputo:[
 ['Una tarea se dispara cada vez que llega un archivo a S3 y tarda 3 segundos. ¿Qué eliges?',['EC2','Lambda','EKS'],1,'Trabajo corto, por eventos y de frecuencia irregular: el caso típico de Lambda.'],
 ['Una API en contenedor debe estar siempre activa y el equipo no quiere administrar servidores.',['ECS con Fargate','EC2 con Auto Scaling','Batch'],0,'Servicio permanente en contenedor, sin máquinas que gestionar.'],
 ['Necesitas instalar un controlador del kernel y usar software con licencia por máquina.',['Lambda','Fargate','EC2'],2,'Solo EC2 da control del sistema operativo.']],
almacenamiento:[
 ['Diez servidores deben leer y escribir los mismos archivos con rutas normales. ¿Qué usas?',['Un volumen EBS compartido','EFS','Glacier'],1,'EFS es un sistema de archivos que montan muchos clientes a la vez. EBS es, en general, para una sola instancia.'],
 ['¿Cómo se accede a un objeto de S3?',['Por una API HTTP','Montando el bucket como disco de bloques','Por SQL'],0,'S3 es almacenamiento de objetos: se lee y escribe con peticiones HTTP.'],
 ['Unos registros deben guardarse 7 años y casi nunca se consultan. ¿Qué reduce más el coste?',['Dejarlos en S3 Standard','Guardarlos en EBS','Una regla de ciclo de vida que los pase a Glacier'],2,'Las clases de archivo cuestan mucho menos por GB a cambio de una recuperación más lenta.']],
rds:[
 ['¿Para qué sirve Multi-AZ en RDS?',['Para acelerar las lecturas','Para tener una copia en espera que toma el relevo si la principal cae','Para repartir escrituras'],1,'Es una medida de disponibilidad, no de rendimiento.'],
 ['Los informes pesados ralentizan la base de datos principal. ¿Qué añades?',['Una réplica de lectura','Más copias de seguridad','Otra zona en espera'],0,'Las consultas de solo lectura se pueden desviar a una réplica.'],
 ['Cientos de funciones Lambda agotan las conexiones de tu base de datos. ¿Qué lo resuelve?',['Aumentar la retención de copias','Activar Multi-AZ','RDS Proxy'],2,'El proxy mantiene un grupo de conexiones y las comparte entre muchos clientes.']],
aurora:[
 ['¿Por qué crear una réplica en Aurora es rápido?',['Porque copia los datos comprimidos','Porque lee del mismo volumen que la escritora','Porque usa S3'],1,'Las instancias no guardan datos: comparten el volumen distribuido.'],
 ['¿Cuántas copias de los datos guarda Aurora, y dónde?',['Seis, en tres zonas','Dos, en una zona','Tres, en tres regiones'],0,'Por eso tolera la pérdida de una zona entera.'],
 ['Tienes un entorno de pruebas que se usa unas horas al día. ¿Qué modalidad encaja?',['Una instancia grande reservada','Global Database','Aurora Serverless, que puede bajar hasta cero'],2,'La capacidad sigue a la carga y no pagas cómputo cuando nadie lo usa.']],
dynamodb:[
 ['¿Qué decide en qué partición se guarda un ítem?',['Su tamaño','Su clave de partición','El orden de inserción'],1,'DynamoDB reparte los ítems según la clave de partición.'],
 ['Necesitas consultar los pedidos por «estado», que no forma parte de la clave. ¿Qué haces?',['Crear un índice secundario global con esa clave','Hacer un Scan cada vez','Cambiar a lecturas fuertes'],0,'El índice mantiene una copia reorganizada por la nueva clave y permite hacer Query.'],
 ['¿Por qué conviene evitar los Scan en tablas grandes?',['Porque devuelven datos antiguos','Porque bloquean la tabla','Porque recorren todos los ítems y pagas por todo lo leído'],2,'El coste y el tiempo de un Scan crecen con el tamaño de la tabla.']],
elasticache:[
 ['¿Qué es lo primero que hace la aplicación en el patrón de caché?',['Escribir en la base de datos','Preguntar a la caché','Borrar la clave'],1,'Solo si la caché no tiene el dato se consulta la base de datos, y se guarda el resultado.'],
 ['¿Qué decisión de diseño es la más delicada al usar una caché?',['Cuándo caduca o se invalida cada dato','El tamaño de la clave','El color del panel'],0,'Una caducidad mal elegida sirve datos viejos o no ahorra nada.'],
 ['El nodo primario cae justo después de una escritura. ¿Qué puede pasar en ElastiCache?',['Nada, siempre es duradera','Se corrompe la base de datos','Esa última escritura puede perderse'],2,'La réplica va un instante por detrás. Para una caché es aceptable.']],
memorydb:[
 ['¿Qué añade MemoryDB frente a una caché en memoria?',['Más velocidad de lectura','Un registro duradero en varias zonas antes de confirmar cada escritura','Consultas SQL'],1,'Por eso sirve como base de datos principal.'],
 ['¿Cuándo eliges ElastiCache en lugar de MemoryDB?',['Cuando los datos son una copia que se puede regenerar','Cuando no puedes perder ninguna escritura','Cuando necesitas grafos'],0,'Para una caché no hace falta pagar la durabilidad.'],
 ['¿Qué interfaz ofrece MemoryDB?',['La de MongoDB','La de Cassandra','La de Valkey y Redis'],2,'Las aplicaciones usan los mismos clientes y estructuras.']],
documentdb:[
 ['¿Con qué interfaz es compatible DocumentDB?',['Cassandra','MongoDB','PostgreSQL'],1,'Sirven los drivers y herramientas de MongoDB.'],
 ['Antes de migrar una aplicación de MongoDB a DocumentDB, ¿qué conviene comprobar?',['Que las operaciones que usa estén soportadas','Que la región tenga seis zonas','Que no use JSON'],0,'DocumentDB implementa la interfaz sobre un motor propio y no cubre todas las funciones.'],
 ['¿Qué tipo de dato encaja mejor?',['Series de mediciones por segundo','Relaciones entre millones de personas','Fichas de catálogo con campos distintos por producto'],2,'El modelo de documentos tolera estructuras variables y anidadas.']],
neptune:[
 ['¿Qué guarda una base de datos de grafos como elementos principales?',['Filas y columnas','Nodos y relaciones','Archivos'],1,'Las relaciones son datos de primera clase, con sus propias propiedades.'],
 ['¿Cuál es un caso típico para Neptune?',['Detectar cuentas que comparten tarjeta o dispositivo','Guardar sesiones web','Servir vídeo'],0,'Recorrer conexiones entre entidades es lo que mejor hace un grafo.'],
 ['¿Qué lenguajes de consulta admite?',['Solo SQL','CQL','Gremlin, openCypher y SPARQL'],2,'Cubre los dos modelos habituales: grafos de propiedades y RDF.']],
keyspaces:[
 ['¿Con qué base de datos es compatible Keyspaces?',['MongoDB','Apache Cassandra','MySQL'],1,'Usa el lenguaje CQL y los drivers de Cassandra.'],
 ['¿Cuál es su principal ventaja frente a tu propio clúster de Cassandra?',['No hay nodos que mantener','Es más rápido en lecturas','Admite JOIN'],0,'Es un servicio sin servidores: creas tablas y las usas.'],
 ['Empiezas un proyecto nuevo en AWS sin código previo de Cassandra. ¿Qué alternativa natural tienes?',['Timestream','Neptune','DynamoDB'],2,'Cubre un terreno parecido y se integra mejor con el resto de AWS.']],
timestream:[
 ['¿Qué caracteriza a una serie temporal?',['Datos muy relacionados entre sí','Puntos con marca de tiempo que se escriben sin parar y se consultan por rangos','Documentos anidados'],1,'Casi nunca se modifican y se analizan por ventanas de tiempo.'],
 ['¿Qué motor ofrece hoy Timestream a clientes nuevos?',['InfluxDB','Cassandra','MySQL'],0,'El motor original, LiveAnalytics, dejó de admitir clientes nuevos en 2025.'],
 ['¿Para qué sirve resumir los datos antiguos?',['Para cifrarlos','Para poder modificarlos','Para guardar menos puntos de lo que ya no necesita detalle'],2,'Pasar de un punto por segundo a uno por minuto reduce almacenamiento y acelera las consultas.']],
elegirbd:[
 ['Pedidos con clientes, líneas y pagos que deben cuadrar siempre. ¿Qué tipo eliges?',['Clave-valor','Relacional','Series temporales'],1,'Relaciones y transacciones son el terreno de RDS y Aurora.'],
 ['Un carrito de compra que se lee y escribe por identificador, con picos enormes en campañas.',['DynamoDB','Neptune','Redshift'],0,'Acceso por clave, mucha escala y sin administración.'],
 ['¿Cuándo conviene añadir una segunda base de datos al sistema?',['Desde el primer día, por si acaso','Nunca','Cuando la actual te limita en algo concreto'],2,'Cada motor más es otra cosa que operar, copiar y pagar.']],
mensajeria:[
 ['El servicio de envíos estará caído una hora. ¿Qué evita que se pierdan los pedidos?',['Llamarlo directamente con reintentos','Una cola SQS entre los dos servicios','Un tema SNS sin suscriptores'],1,'Los mensajes esperan en la cola hasta que el consumidor vuelve.'],
 ['Tres servicios distintos deben enterarse de cada pedido nuevo. ¿Qué patrón usas?',['Un tema SNS con una cola por suscriptor','Una sola cola compartida','Tres llamadas directas'],0,'En una cola compartida cada mensaje llegaría a un solo consumidor. SNS entrega una copia a cada suscriptor.'],
 ['¿Por qué tu consumidor de SQS debe tolerar mensajes repetidos?',['Porque SQS cifra los mensajes','Porque las colas FIFO desordenan','Porque la cola estándar entrega al menos una vez'],2,'A veces el mismo mensaje llega dos veces; procesarlo de nuevo no debe causar daño.']],
datos:[
 ['¿Por qué importa guardar los datos en Parquet y con particiones para Athena?',['Porque Athena solo lee Parquet','Porque lee menos datos, y se paga por lo escaneado','Porque cifra mejor'],1,'Leer solo las columnas y fechas necesarias baja el coste y el tiempo.'],
 ['¿Qué hace Firehose?',['Entrega datos en streaming por lotes a S3, Redshift u OpenSearch','Ejecuta consultas SQL','Dibuja paneles'],0,'Se ocupa de agrupar y entregar, sin que mantengas consumidores.'],
 ['Los mismos paneles se consultan cientos de veces al día sobre miles de millones de filas. ¿Qué encaja?',['Athena','Lambda','Redshift'],2,'Un data warehouse está pensado para consultas frecuentes y rápidas sobre grandes volúmenes.']],
bedrock:[
 ['El modelo no conoce tu política de devoluciones. ¿Cuál es la forma habitual de resolverlo?',['Reentrenar el modelo desde cero','Darle los fragmentos relevantes de tus documentos en cada pregunta (RAG)','Subir la temperatura'],1,'Knowledge Bases recupera el contexto y lo añade a la petición.'],
 ['¿Por qué se paga al usar un modelo en Bedrock bajo demanda?',['Por tokens de entrada y de salida','Por hora de GPU','Por usuario'],0,'El precio por token depende del modelo elegido.'],
 ['¿Qué hace Guardrails?',['Acelera las respuestas','Entrena modelos','Filtra lo que entra y lo que sale según tus reglas'],2,'Temas vetados, contenido dañino y datos personales, con cualquier modelo.']],
agentcore:[
 ['¿Qué distingue a un agente de un chat?',['Usa un modelo más grande','Decide pasos y usa herramientas hasta completar una tarea','No necesita modelo'],1,'Trabaja en bucle: piensa, actúa, observa.'],
 ['¿Qué hace Gateway en AgentCore?',['Convierte tus APIs y funciones en herramientas para el agente','Guarda el historial','Factura por token'],0,'Así el agente puede descubrirlas y llamarlas de forma estándar.'],
 ['Los pasos de tu proceso son siempre los mismos y en el mismo orden. ¿Qué suele ser mejor?',['Un agente con más herramientas','Dos agentes','Un flujo fijo, por ejemplo con Step Functions'],2,'Un flujo determinista es más barato y predecible que dejar decidir a un modelo.']],
sagemaker:[
 ['¿Qué ocurre con las instancias de un trabajo de entrenamiento al terminar?',['Quedan encendidas','Se apagan solas','Pasan a ser un endpoint'],1,'Se paga por el tiempo que dura el entrenamiento.'],
 ['Necesitas puntuar a todos los clientes una vez cada noche. ¿Qué forma de inferencia encaja?',['Transformación por lotes','Endpoint en tiempo real','Endpoint asíncrono con GPU'],0,'No hace falta respuesta inmediata, así que no tiene sentido un endpoint encendido todo el día.'],
 ['¿Cuál suele ser el gasto que sorprende en SageMaker AI?',['El registro de modelos','Los notebooks apagados','Un endpoint en tiempo real encendido todo el mes'],2,'Se cobra por hora de instancia, haya o no peticiones.']],
rekognition:[
 ['¿Qué acompaña a cada resultado de Rekognition?',['Un vídeo explicativo','Un porcentaje de confianza','El nombre del autor'],1,'Tú decides el umbral a partir del cual aceptas un resultado.'],
 ['Quieres detectar los defectos propios de tus piezas de fábrica. ¿Qué usas?',['Etiquetas personalizadas, entrenadas con tus imágenes','La detección de caras','Moderación de contenido'],0,'Con unos cientos de ejemplos enseñas categorías que el modelo general no conoce.'],
 ['Una coincidencia de caras va a decidir si alguien accede a un servicio. ¿Qué es imprescindible?',['Bajar el umbral al mínimo','Usar vídeo','Revisión humana y cumplir la regulación de datos biométricos'],2,'Es una coincidencia probable, no una certeza.']],
textract:[
 ['¿Qué aporta Textract frente a un OCR sencillo?',['Traduce el documento','Entiende formularios y tablas, no solo el texto','Genera imágenes'],1,'Empareja etiquetas con valores y reconstruye tablas.'],
 ['¿Cómo se procesa un PDF de 200 páginas?',['Como trabajo asíncrono que avisa al terminar','En una sola llamada inmediata','Página a página a mano'],0,'Los documentos largos se envían como trabajo y se recoge el resultado después.'],
 ['¿Qué haces con los campos extraídos con poca confianza?',['Aceptarlos igualmente','Descartar el documento','Enviarlos a revisión humana'],2,'El umbral de confianza separa lo automático de lo que necesita una persona.']],
transcribe:[
 ['¿Qué permite saber qué dijo el agente y qué dijo el cliente?',['El vocabulario personalizado','La identificación de hablantes','La traducción'],1,'Separa las voces o, si vienen en canales distintos, los transcribe por separado.'],
 ['Transcribe falla siempre con el nombre de tus productos. ¿Qué haces?',['Añadir un vocabulario personalizado','Subir el volumen','Cambiar de región'],0,'Le enseñas los términos propios del negocio.'],
 ['¿Qué permite el modo en streaming?',['Transcribir sin audio','Guardar más barato','Subtítulos mientras se habla'],2,'Devuelve texto con un retraso de menos de un segundo.']],
polly:[
 ['¿Qué unidad se cobra en Polly?',['Segundos de audio','Caracteres convertidos','Peticiones'],1,'El precio por carácter cambia según el motor de voz.'],
 ['¿Para qué sirve SSML?',['Para indicar pausas, énfasis y pronunciación dentro del texto','Para cifrar el audio','Para traducir'],0,'Son marcas que controlan cómo se lee.'],
 ['El mismo aviso se reproduce miles de veces al día. ¿Qué conviene?',['Generarlo en cada reproducción','Usar el motor más caro','Generarlo una vez y guardarlo en S3'],2,'Evitas pagar la conversión repetida.']],
comprehend:[
 ['¿Qué devuelve el análisis de sentimiento?',['Un resumen','Positivo, negativo, neutro o mixto, con su confianza','La traducción'],1,'Aplicado a muchas reseñas se convierte en una métrica.'],
 ['Antes de guardar transcripciones de clientes quieres tachar correos y teléfonos. ¿Qué función usas?',['Detección de datos personales','Frases clave','Detección de idioma'],0,'Localiza y puede ocultar datos personales.'],
 ['Necesitas clasificar tiques en categorías propias de tu empresa.',['No es posible','Hay que usar Rekognition','Entrenar un clasificador personalizado con ejemplos'],2,'Comprehend aprende tus categorías a partir de ejemplos etiquetados.']],
translate:[
 ['¿Cómo evitas que Translate traduzca el nombre de tu producto?',['No se puede','Con una terminología personalizada','Escribiéndolo en mayúsculas'],1,'Fijas cómo se tratan términos concretos.'],
 ['Tienes 50 000 documentos Word en S3 para traducir. ¿Qué usas?',['Un trabajo por lotes','Una llamada en tiempo real por documento, a mano','Polly'],0,'El trabajo por lotes procesa carpetas enteras conservando el formato.'],
 ['¿Qué texto conviene que revise una persona tras la traducción automática?',['Los tiques de soporte','Las reseñas de usuarios','Los textos de marca y marketing'],2,'Ahí importan el tono y los matices.']],
lex:[
 ['En Lex, ¿qué es una intención?',['La voz del bot','Lo que el usuario quiere conseguir, como «cambiar una cita»','Una función Lambda'],1,'Cada intención tiene frases de ejemplo y los datos que necesita.'],
 ['El usuario dice «quiero cambiar mi cita» sin indicar el día. ¿Qué hace Lex?',['Pregunta por el dato que falta','Termina la conversación','Elige una fecha al azar'],0,'Va pidiendo los datos requeridos uno a uno.'],
 ['¿Dónde se ejecuta la acción real, como modificar la cita en tu sistema?',['En Polly','En el navegador','En una función Lambda tuya'],2,'Lex reúne la intención y los datos y los pasa a tu lógica.']],
personalize:[
 ['¿De qué aprende principalmente Personalize?',['De las descripciones de marketing','Del historial de interacciones de los usuarios','De las imágenes'],1,'Qué vio, compró o valoró cada usuario.'],
 ['Quieres ordenar los resultados de una búsqueda según los gustos de cada persona. ¿Qué receta usas?',['Reordenar','Tendencias','Similares'],0,'La receta de reordenación toma una lista y la ordena para ese usuario.'],
 ['Tu tienda tiene 200 visitas al día y poco historial. ¿Qué suele rendir casi igual?',['Entrenar más recetas','Un modelo propio','Reglas sencillas como «lo más vendido»'],2,'Sin datos suficientes, la personalización aporta poco.']],
elegiria:[
 ['Necesitas extraer los importes de miles de facturas escaneadas.',['SageMaker AI','Textract','AgentCore'],1,'Es una tarea conocida con un servicio especializado.'],
 ['Quieres un asistente que responda con tu documentación interna.',['Bedrock con Knowledge Bases','Polly','Personalize'],0,'Modelo generativo más recuperación de tus documentos.'],
 ['Quieres predecir qué clientes se darán de baja a partir de tu historial.',['Translate','Lex','SageMaker AI'],2,'La respuesta está en tus datos: toca entrenar un modelo propio.']],
seguridad:[
 ['¿Qué ocurre si ninguna política permite una acción?',['Se permite','Se deniega','Se pide confirmación'],1,'En IAM todo está denegado por defecto.'],
 ['¿Cómo debe acceder una función Lambda a una tabla?',['Con un rol de ejecución con los permisos justos','Con las claves del administrador','Con una contraseña en el código'],0,'Rol, credenciales temporales y mínimo privilegio.'],
 ['Tras un incidente quieres saber quién borró un recurso. ¿Dónde miras?',['CloudWatch Metrics','WAF','CloudTrail'],2,'CloudTrail registra cada llamada a la API con su identidad.']],
despliegue:[
 ['¿Qué hace CloudFormation cuando modificas la plantilla?',['Borra todo y lo crea de nuevo','Calcula la diferencia y aplica solo los cambios','Nada hasta reiniciar'],1,'Y si algo falla, deshace los cambios.'],
 ['¿Qué genera CDK a partir de tu código?',['Una plantilla de CloudFormation','Una imagen de contenedor','Un panel'],0,'CDK es una forma más cómoda de escribir la misma plantilla.'],
 ['¿Qué hace CodeDeploy si saltan las alarmas durante un despliegue gradual?',['Continúa igual','Borra el entorno','Vuelve a la versión anterior'],2,'El despliegue gradual limita el daño y permite revertir solo.']],
todo:[
 ['¿Por qué el envío se procesa tras un evento y no dentro de la petición de compra?',['Porque Lambda no puede llamar a otros servicios','Para responder rápido al cliente y que un fallo de envíos no tumbe la compra','Para ahorrar en DynamoDB'],1,'Lo lento y lo que puede fallar se saca del camino del usuario.'],
 ['En esa arquitectura, ¿dónde vive la web estática?',['En S3, servida por CloudFront','En una instancia EC2','En DynamoDB'],0,'No hay servidor web que mantener.'],
 ['¿Qué autoriza cada llamada entre piezas del diagrama?',['El security group','CloudWatch','Un rol de IAM con permisos concretos'],2,'Cada pieza solo puede hacer lo que su rol permite.']],
vpcfondo:[
 ['¿Cuántas direcciones utilizables tiene una subred /24 en AWS?',['256','251','254'],1,'AWS reserva cinco direcciones en cada subred.'],
 ['Tus servidores privados descargan muchos datos de S3 y el NAT sale caro. ¿Qué haces?',['Añadir un endpoint de gateway para S3','Poner un segundo NAT','Mover los servidores a la subred pública'],0,'El endpoint de gateway no tiene coste y evita que ese tráfico pase por el NAT.'],
 ['La VPC A tiene peering con B, y B con C. ¿Puede A hablar con C a través de B?',['Sí, siempre','Sí, si comparten región','No: el peering no es transitivo'],2,'Para conectar muchas redes entre sí se usa un Transit Gateway.']],
ec2fondo:[
 ['¿Qué métrica NO ves en CloudWatch sin instalar el agente?',['Uso de CPU','Memoria libre','Tráfico de red'],1,'La memoria y el espacio en disco se miden desde dentro del sistema operativo.'],
 ['¿Qué necesita una instancia para que puedas entrar con Session Manager?',['Un rol con la política de Systems Manager y el agente','El puerto 22 abierto','Una IP pública y un par de claves'],0,'No hace falta abrir puertos de entrada ni gestionar claves.'],
 ['Una instancia t3 lleva horas con la CPU al 100 % y va cada vez más lenta. ¿Qué pasa probablemente?',['El disco está lleno','Falla la red','Ha agotado sus créditos de CPU'],2,'La familia T está pensada para ráfagas; con carga sostenida conviene otra familia.']],
lambdafondo:[
 ['¿Dónde conviene crear el cliente de la base de datos?',['Dentro de la función, en cada invocación','Fuera de la función, para reutilizarlo entre invocaciones','En una capa aparte por invocación'],1,'El código de inicialización se ejecuta una vez por copia.'],
 ['Tu función tarda 30 segundos como máximo. ¿Qué tiempo de invisibilidad pones en la cola?',['Unos 180 segundos','30 segundos','5 segundos'],0,'La recomendación es unas seis veces el tiempo máximo de la función.'],
 ['Una función se dispara al crear objetos en un bucket y escribe su resultado en ese mismo bucket. ¿Qué ocurre?',['Nada especial','Se bloquea el bucket','Un bucle de invocaciones sin fin'],2,'Cada objeto escrito dispara la función otra vez. Usa otro bucket u otro prefijo.']],
fargatefondo:[
 ['Una tarea en subred privada se queda en PENDING y luego se detiene. ¿Cuál es la causa más probable?',['Falta memoria','No puede descargar la imagen: no tiene camino hasta ECR','El balanceador está caído'],1,'Hace falta un NAT Gateway o VPC endpoints para ECR, S3 y logs.'],
 ['¿Qué rol usa tu código para leer de una tabla de DynamoDB?',['El rol de tarea','El rol de ejecución','El rol del balanceador'],0,'El rol de ejecución es el que usa Fargate para preparar la tarea, no tu aplicación.'],
 ['¿Qué modo de red usan siempre las tareas de Fargate?',['bridge','host','awsvpc, con una interfaz de red por tarea'],2,'Cada tarea tiene su propia IP privada y su security group.']],
s3fondo:[
 ['Quieres servir imágenes al público sin hacer público el bucket. ¿Cómo?',['Con una política que permita a todo el mundo','Con CloudFront delante y una política que solo permita leer a esa distribución','No se puede'],1,'El bucket sigue cerrado y el contenido se entrega desde la CDN.'],
 ['¿Qué te protege de un borrado accidental?',['El versionado','La clase Standard','El cifrado'],0,'Borrar deja una marca y la versión anterior se puede recuperar.'],
 ['En una factura de S3 con mucho tráfico hacia internet, ¿qué suele pesar más?',['Los GB guardados','El número de buckets','La salida de datos'],2,'Sacar datos a internet cuesta varias veces más por GB que guardarlos un mes.']],
rdsfondo:[
 ['¿Qué permite un despliegue azul/verde en RDS?',['Leer más rápido','Probar una versión nueva en una copia sincronizada y cambiar en alrededor de un minuto','Reducir el coste a la mitad'],1,'Si algo va mal antes del cambio, se descarta la copia.'],
 ['¿Qué pasa si una instancia de RDS se queda sin espacio en disco?',['La base de datos deja de funcionar','Se borra lo más antiguo','Nada'],0,'Por eso se vigila el espacio libre y se activa el crecimiento automático.'],
 ['Restauras una copia de ayer. ¿Qué obtienes?',['La instancia original sobrescrita','Una réplica de lectura','Una instancia nueva con otra dirección'],2,'La restauración nunca modifica la base de datos original.']],
dynamodbfondo:[
 ['¿Por dónde empieza el diseño de una tabla?',['Por normalizar los datos','Por la lista de consultas que hará la aplicación','Por elegir los índices'],1,'Las claves se eligen para servir esos accesos.'],
 ['Haces un Scan con un filtro que devuelve 10 ítems de un millón. ¿Qué se cobra?',['La lectura del millón de ítems','Solo los 10 devueltos','Nada, los filtros son gratis'],0,'El filtro se aplica después de leer.'],
 ['¿Qué consigue attribute_not_exists(PK) como condición al crear un ítem?',['Que se cifre','Que caduque','Que no se sobrescriba ni se duplique uno existente'],2,'La escritura falla si ya existe un ítem con esa clave.']],
mensajeriafondo:[
 ['¿Cuántas peticiones a SQS cuesta procesar un mensaje, sin lotes?',['Una','Tres: enviar, recibir y borrar','Diez'],1,'Agrupar en lotes de diez divide ese coste por diez.'],
 ['Necesitas que los eventos de cada cliente se procesen en orden. ¿Qué usas?',['Una cola FIFO con el cliente como grupo de mensajes','Una cola estándar','Un tema SNS'],0,'El orden se garantiza dentro de cada grupo y los grupos se procesan en paralelo.'],
 ['¿Qué métrica indica que el consumidor no da abasto?',['El número de colas','El tamaño medio del mensaje','La edad del mensaje más antiguo'],2,'Si crece, los mensajes esperan cada vez más.']],
bedrockfondo:[
 ['El modelo decide que necesita consultar un pedido. ¿Quién ejecuta la herramienta?',['El propio modelo','Tu código, que luego le devuelve el resultado','Bedrock automáticamente, siempre'],1,'El modelo solo pide la llamada con sus parámetros.'],
 ['Todas tus llamadas llevan las mismas instrucciones largas. ¿Qué reduce el coste?',['La caché de prompt','Subir el máximo de tokens','Cambiar de región'],0,'La parte repetida se cobra a una fracción del precio.'],
 ['Tus peticiones empiezan a ser rechazadas en horas punta. ¿Cuál es la causa habitual?',['El modelo se ha retirado','Falta de memoria','Has superado la cuota de tokens o peticiones por minuto'],2,'Se resuelve con reintentos con espera, repartiendo entre regiones o pidiendo más cuota.']],
iamfondo:[
 ['Una política permite una acción y otra la deniega de forma explícita. ¿Qué ocurre?',['Se permite','Se deniega','Depende del orden'],1,'Un Deny explícito gana siempre.'],
 ['¿Qué dice la política de confianza de un rol?',['Quién puede asumirlo','Qué acciones permite','Cuándo caduca'],0,'Sin ella nadie puede usar el rol, tenga los permisos que tenga.'],
 ['¿Cómo deben entrar las personas a AWS?',['Con un usuario de IAM y claves permanentes','Con el usuario raíz','Con Identity Center y credenciales temporales'],2,'Sesión única con segundo factor y sin claves guardadas.']]
};
