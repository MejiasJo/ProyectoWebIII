# Pets History API
Pets History API es una solución tecnológica diseñada para digitalizar, organizar y centralizar la información médica de animales domésticos atendidos en una clínica veterinaria.
El sistema permite administrar:
- Información general de animales.
- Registros de citas veterinarias.
- Historiales médicos detallados.
- Tratamientos prescritos.
- Usuarios con roles diferenciados (cliente, veterinario, administrador).

## Objetivo
Ofrecer una API eficiente, segura y escalable que facilite el manejo del historial médico de mascotas, permitiendo un control más riguroso de diagnósticos, medicamentos y seguimientos clínicos.

## Tecnologías utilizadas
- Node.js
- Express.js
- MariaDB
- JWT para autenticación
- Middlewares personalizados
- Dotenv para información sensible
- Postman para pruebas
- GitHub para control de versiones

## Pasos de instalación y ejecución
1. Clona el repositorio:
    git clone <url-del-repositorio>
2. Accede a la carpeta 'data':
    cd data
3. Levanta los contenedores de Docker:
    docker-compose up -d
4. Accede a la carpeta `server`:
    cd server
5. Instala las dependencias del proyecto:
    npm install
6. Corre el servidor en modo desarrollo:
    npm run dev

## Integrantes y roles

- **Johel Mejias Matarrita**: Desarrollo endpoints de la API, para las rutas de Usuarios y Tratamientos.
- **Zulay Rojas Cordero**: Desarrollo endpoints de la API, para las rutas de Animales.
- **Dashly Obando Somarribas**: Desarrollo endpoints de la API, para las rutas de Historial.
- **Daniel Delgado Alvarado**: Desarrollo endpoints de la API, para las rutas de Citas.

