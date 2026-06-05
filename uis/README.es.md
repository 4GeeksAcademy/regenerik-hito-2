- Primero, dentro de "uis" crear la estructura de archivos pedida en : 

https://4geeks.com/es/main-cohort/latam-aie-pt-utec/syllabus/coding-fundamentals-with-typescript/project/ai-eng-milestone-coding-fundamentals?moduleId=6

src/
├── data/
│   └── sampleData.ts
├── types/
│   └── models.ts
├── utils/
│   ├── collections.ts
│   ├── search.ts
│   ├── transformations.ts
│   └── validations.ts
└── demo.ts

- Iniciarmos package.json ( parados en uis ):

    npm init -y
    npm install -D typescript tsx
    npm pkg set type="module"
    npm pkg set scripts.typecheck="tsc --noEmit"
    npm pkg set scripts.demo="tsx src/demo.ts"

- Iniciamos tsconfig.json ( tmb parados en uis ):

npx tsc --init

- Me posicioné en /uis

npm install
npm run typecheck
npm run demo

- En como iniciar el proyecto el punto 3 dice : 

"Lee completamente tu archivo CONTEXT-company.md antes de escribir código." Ahí están las funciones que se necesitan para cada archivo. Link : 

https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/02-coding-fundamentals/CONTEXT-brasaland.es.md

- Explico como sample Data importa y respeta los models.

- Voy archivo por archivo de utils explicando las funciones.