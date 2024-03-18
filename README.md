
> More information about the architecture of the API can be found in this Medium story :
> https://medium.com/@phcollignon/node-rest-api-jwt-in-typescript-e6a8ae5cd8f8

# Node Rest API + Express in TypeScript

# Como trabaja las rutas

- La api despacha consultas a travez de los **routes**.
- Todas las rutas usan **controllers** para implementar urls apis.
- Controllers usa  **models** para persistencia en mongodb.
- Las rutas quedan protegidas con **JWT authentification middelwares** :
```typescript
import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { AuthController } from "../controllers/authController";


export class ProductRoutes {

    public router: Router;
    public productController: ProductController = new ProductController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/", this.productController.getProducts);
        this.router.get("/:id", this.productController.getProduct);
        // The following routes are protected
        this.router.post("/", this.authController.authenticateJWT, this.productController.createProduct);
        this.router.put("/:id", this.authController.authenticateJWT, this.productController.updateProduct);
        this.router.delete("/:id", this.authController.authenticateJWT, this.productController.deleteProduct);
    }
}
```
# Justificación de uso de Mongodb
 
Usar MongoDB para un proyecto puede ser una excelente opción por varias razones:

Escalabilidad: MongoDB ofrece escalabilidad tanto vertical como horizontal, lo que significa que puede adaptarse al crecimiento de la información y del número de usuarios1.
Flexibilidad: Al ser una base de datos sin esquema (Schemaless), permite una mayor flexibilidad en el almacenamiento de datos, lo que es ideal para estructuras de datos dinámicas1.
Alta disponibilidad: MongoDB está diseñado para ofrecer alta disponibilidad, lo que es crucial para aplicaciones con un gran volumen de acceso1.
Proyectos Big Data: Es ideal para proyectos de Big Data, ya que se integra bien con datos de estructuras no conocidas o dispares1.
Modelamiento de datos: Es especialmente útil si estás utilizando NodeJS, ya que los datos se almacenan en estructuras parecidas a un JSON, facilitando el flujo de datos dentro de la aplicación2.
Poderosa sintaxis para consultas: MongoDB tiene una sintaxis de consulta robusta y operadores que permiten crear consultas complejas con poco código2.
Código abierto: MongoDB es de código abierto, lo que permite una gran comunidad de soporte y desarrollo continuo2.

# Justificación de uso Mongoose

Mongoose es una herramienta muy útil cuando trabajas con MongoDB en aplicaciones Node.js por varias razones:

Modelado de Datos: Mongoose proporciona una solución de modelado de datos que facilita la definición de esquemas para tus datos. Esto te permite estructurar tus datos de manera más organizada y predecible1.
Validación: Ofrece un sistema de validación incorporado que te permite asegurarte de que los datos que ingresan a tu base de datos cumplen con ciertos criterios antes de ser guardados1.
Consultas: Mejora la experiencia de realizar consultas a la base de datos, permitiendo escribir consultas de una manera más sencilla y legible2.
Middleware: Mongoose permite el uso de middleware, lo que significa que puedes ejecutar código antes o después de ciertas operaciones de la base de datos, como guardar o buscar documentos2.
Conversión de Tipos: Automáticamente maneja la conversión de tipos de datos, lo que es especialmente útil cuando los datos provienen de diferentes fuentes y necesitan ser convertidos a un tipo específico antes de ser almacenados2.
Gestión de Relaciones: Aunque MongoDB es una base de datos NoSQL, Mongoose te permite manejar relaciones entre documentos con una sintaxis similar a las bases de datos relacionales1.
Plugins: Puedes extender la funcionalidad de Mongoose con una amplia variedad de plugins disponibles, lo que te permite añadir características adicionales según las necesidades de tu proyecto3.

# Justificación de uso de Passport-Jwt
Passport-JWT es una estrategia de autenticación para Node.js muy popular y útil por varias razones:

Autenticación Basada en Tokens: Permite autenticar endpoints usando un JSON Web Token (JWT), lo cual es ideal para asegurar endpoints RESTful sin necesidad de sesiones1.
Seguridad: Los JWT son firmados digitalmente, lo que garantiza la integridad y la autenticidad de los datos transmitidos entre las partes2.
Flexibilidad: Passport-JWT es flexible y permite configurar cómo se extrae el token de la solicitud o cómo se verifica1.
Simplicidad: Simplifica el proceso de autenticación y autorización en aplicaciones Node.js, haciendo que el código sea más limpio y fácil de mantener2.
Estandarización: JWT es un estándar abierto (RFC 7519) que define una forma compacta y autónoma de transmitir información de forma segura como un objeto JSON2.
Interoperabilidad: Al ser un estándar, los JWT pueden ser utilizados en diferentes plataformas y lenguajes, lo que facilita la integración con otros sistemas3.
Sin Estado: Al no requerir sesiones, Passport-JWT es ideal para aplicaciones distribuidas y microservicios, ya que no depende del estado del servidor1.
Estas características hacen de Passport-JWT una opción sólida para manejar la autenticación en aplicaciones modernas que utilizan Node.js.

# Instalación
 
- Instalar dependencias
```
cd rest-api
npm install
npm run build
```
-Crear container demo
```
docker-compose build
docker-compose up
```
( *Alternatively, you can run and configure your local or cloud Mongo server and start Node server with
`npm run build && npm start`*)

# Como iniciar

## Step1 : Registrar un usuario
Send a POST request to `http://localhost:3000/api/user/register` 
with the following payload ** :
```json
{
	"username": "me",
	"password": "pass"
}
```
You should get a JWT token in the response :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lMiIsImlhdCI6MTU1MDU4MTA4NH0.WN5D-BFLypnuklvO3VFQ5ucDjBT68R2Yc-gj8AlkRAs"
}
```

> **Note  - Please protect your registration API if you do not use any third-party identity provider !!.

## Step2 : Create a Product
Send a POST request to `http://localhost:3000/api/products` 
with the following payload :
```json
{
  "productId": "13",
  "name": "Orange",
  "price": 5,
  "quantity": 6
}
``` 
You should get an authorization **denied** !
```json
{
  "status": "error",
  "code": "unauthorized"
}
```
Add the JWT token to the Authorization header :
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1lMiIsImlhdCI6MTU1MDU4MTA4NH0.WN5D-BFLypnuklvO3VFQ5ucDjBT68R2Yc-gj8AlkRAs
```
You should have created the product !!
```json
{
  "data": {
    "_id": "5c6c0845e3eb8302ffd168c0",
    "productId": "13",
    "name": "Orange",
    "price": 5,
    "quantity": 6,
    "__v": 0
  }
}
```
## Step2 : Get a Product
You can get the product with or without token because the Get route of Product router is not protected with the JWT authentification middelware.
Send a GET request to `http://localhost:3000/api/products/13`

You should get :
```json

  {
    "_id": "5c6bfc97e3eb8302ffd168be",
    "productId": "13",
    "name": "Orange",
    "price": 5,
    "quantity": 6,
    "__v": 0
  }

```
 
