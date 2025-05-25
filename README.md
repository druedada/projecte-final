# Gestor de Tasques

Un gestor de tasques simple desenvolupat amb Node.js, Express, MongoDB i Vue.js.

## Estructura del projecte

```
projecte-final/
    backend/
        models/ (ModelPrincipal.js)
        routes/ (api.js)
        controllers/ (controller.js)
        config/ (db.js)
        server.js (servidor Express)
        package.json (gestió de dependències)
    frontend/
        src/
            App.vue (component principal)
            main.js (punt d'entrada)
            components/ (components Vue)
            models/ (models de dades)
            services/ (serveis i lògica de negoci)
            assets/ (recursos estàtics)
        index.html
        package.json
        vite.config.js
    README.md
    .gitignore
```

## Tecnologies utilitzades

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Vue.js 3, Vite, HTML5, CSS3, JavaScript (ES6+)

### Organització del MVVM en el projecte

#### Model
- **Task.js** (`/frontend/src/models/Task.js`):
  - Encapsula les dades d'una tasca i implementa la lògica de negoci.
  - Conté propietats com `title`, `description`, `status`, `priority`, `dueDate`.
  - Implementa mètodes de comportament: `complete()`, `isCompleted()`, `isPending()`, `isHighPriority()`.
  - Proporciona getters per a formats específics: `statusLabel`, `priorityLabel`, `formattedDate`.
  - Mètode `toJSON()` per a serialitzar els objectes per a l'API.

- **TaskModel.js** (`/frontend/src/services/TaskModel.js`):
  - Gestiona la comunicació amb l'API REST.
  - Implementa mètodes CRUD: `getAllTasks()`, `getTaskById()`, `createTask()`, `updateTask()`, `deleteTask()`.
  - Converteix les dades rebudes de l'API en instàncies de `Task` mitjançant `Task.fromApiData()`.
  - Gestiona els errors de comunicació amb el backend.

#### View
- **TaskCard.vue** (`/frontend/src/components/TaskCard.vue`):
  - Component de presentació que mostra les dades d'una tasca individual.
  - Utilitza propietats del model per visualitzar la informació: `task.title`, `task.statusLabel`, etc.
  - Emet esdeveniments (`@emit`) per a accions de l'usuari: `edit`, `complete`, `delete`.
  - No conté lògica de negoci, només presentació.

- **Secció template d'App.vue** (`/frontend/src/App.vue`):
  - Defineix l'estructura principal de l'aplicació.
  - Utilitza directiva `v-for` per mostrar la llista de tasques.
  - Implementa formularis amb enllaç de dades bidireccional via `v-model`.

#### ViewModel
- **Secció script d'App.vue** (`/frontend/src/App.vue`):
  - Manté l'estat de l'aplicació: `tasks`, `currentTask`, `loading`, `error`, etc.
  - Defineix propietats computades: `filteredTasks`.
  - Implementa mètodes que responen als esdeveniments: `saveTask()`, `editTask()`, `deleteTask()`.
  - Gestiona el cicle de vida dels components: mounted() per carregar les dades inicials.
  - Coordina la comunicació entre la vista i el model mitjançant `taskModel`.

### Flux de dades en MVVM
1. L'usuari interactua amb la Vista (components Vue).
2. Els events són capturats pel ViewModel (script dels components).
3. El ViewModel utilitza el Model per accedir/modificar dades (TaskModel).
4. El Model comunica canvis al ViewModel.
5. El ViewModel actualitza la Vista per reflectir els canvis.

### Avantatges d'utilitzar MVVM en el projecte
- **Testeig**: Facilita les proves unitàries per separar la lògica de la interfície.
- **Mantenibilitat**: Codi més organitzat i fàcil de mantenir.
- **Reutilització**: Components i lògica reutilitzables.
- **Separació de responsabilitats**: Cada part del patró té responsabilitats ben definides.

## Arquitectura tècnica

L'aplicació segueix una arquitectura client-servidor:

### Backend (Servidor)
- **Express.js**: Framework per crear l'API RESTful
- **MongoDB**: Base de dades NoSQL per emmagatzemar les tasques
- **Mongoose**: ODM (Object-Document Mapper) per modelar i validar dades

#### Estructura API RESTful:
- `GET /api/tasks`: Obtenir totes les tasques
- `GET /api/tasks/:id`: Obtenir una tasca específica
- `POST /api/tasks`: Crear una nova tasca
- `PUT /api/tasks/:id`: Actualitzar una tasca existent
- `DELETE /api/tasks/:id`: Eliminar una tasca

### Frontend (Client)
- **Vue.js 3**: Framework progressiu per construir interfícies d'usuari
- **Vite**: Bundler i dev server modern
- **Sistema de components**: Estructura modular i reutilitzable
- **Comunicació asíncrona**: Fetch API per comunicar-se amb el backend

### Diagrama UML

El projecte inclou un diagrama UML (`Gestor de Tasques - Diagrama UML.png`) que mostra les relacions entre les diferents classes i components del sistema, il·lustrant l'arquitectura MVVM implementada.

## Funcionalitats

- Crear tasques
- Llistar tasques
- Filtrar tasques per estat (Pendents, En progrés, Completades)
- Actualitzar tasques
- Eliminar tasques
- Marcar tasques com a completades

## Com iniciar el projecte

### Requisits previs
- Node.js (versió 16 o superior)
- MongoDB (local o remot)

### Backend

```bash
cd backend
npm install
npm start
```

El servidor s'iniciarà a `http://localhost:3009`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'aplicació s'obrirà automàticament al navegador a `http://localhost:8082`.

### Variables d'entorn

#### Backend
Crear un arxiu `.env` a la carpeta `backend` amb:

```
MONGO_URI=mongodb://localhost:27017/task-manager
PORT=3009
```

#### Frontend
El frontend utilitza l'arxiu `.env.development` amb:

```
VITE_API_URL=http://localhost:3009/api
```
