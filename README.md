# 🧠 AZTEA BACK-END

Sistema back-end modular e escalável para gerenciamento de conteúdos, traduções, usuários, notificações, comentários, favoritos, séries e muito mais. Desenvolvido com foco em organização por entidade, boas práticas de arquitetura e extensibilidade.

---

## 📁 Estrutura do Projeto

Organizado em uma **arquitetura modular por entidade** ou **Modular MVC**, inspirada no padrão utilizado em projetos Go e aplicações escaláveis Node.js.

```bash
src/
├── category/              # Funcionalidades da entidade Categoria
├── comment/               # Funcionalidades de Comentários
├── content/               # Gerenciamento de Conteúdos
├── contentTranslation/    # Traduções dos Conteúdos
├── favorite/              # Sistema de Favoritos
├── media/                 # Uploads e gerenciamento de mídia
├── notification/          # Notificações dos usuários
├── report/                # Relatórios e denúncias
├── series/                # Séries de conteúdos
├── submissions/           # Submissões de usuários
├── tag/                   # Sistema de tags
├── user/                  # Registro, login e gerenciamento de usuários
├── shared/                # Utilitários e componentes reutilizáveis
│   ├── config/            # Configurações globais
│   ├── controllers/       # Controladores reutilizáveis
│   ├── middlewares/       # Autenticação, erros, etc.
│   ├── routes/            # Rotas globais
│   ├── services/          # Serviços genéricos (ex: email, token)
│   └── utils/             # Funções utilitárias
├── server.ts              # Ponto de entrada principal
````

---

## 🚀 Tecnologias Utilizadas

* **Node.js**
* **TypeScript**
* **Express**
* **Prisma ORM**
* **PostgreSQL**
* **JWT (Autenticação)**
* **Vercel (Deploy)**

---

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/aztea-back-end.git
cd aztea-back-end
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` com base no `.env.example` (caso haja).

4. **Rode as migrations do Prisma**

```bash
npx prisma migrate dev
```

5. **Inicie o servidor**

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3000`

---

## 🧪 Scripts úteis

| Comando                  | Descrição                                 |
| ------------------------ | ----------------------------------------- |
| `npm run dev`            | Inicia o servidor em modo desenvolvimento |
| `npm run build`          | Compila o projeto para produção           |
| `npx prisma studio`      | Abre o Prisma Studio (interface do banco) |
| `npx prisma migrate dev` | Aplica migrações do banco de dados        |

---

## 🧩 Organização por entidade

Cada pasta (ex: `report`, `user`, `content`) contém:

* `controller/`: Lida com as requisições HTTP
* `model/`: Define os modelos de dados (via Prisma ou interfaces)
* `route/`: Define as rotas da entidade
* `services/`: Contém a lógica de negócio específica da entidade

---

## 🔐 Autenticação

O projeto utiliza **JWT** para autenticação. As rotas protegidas exigem token no header:

```
Authorization: Bearer <seu_token>
```

---

## 📦 Deploy

O projeto está pronto para deploy na **Vercel**. Certifique-se de configurar as variáveis de ambiente corretamente no painel.

---

## 👥 Contribuição

Sinta-se à vontade para abrir issues ou pull requests. Feedbacks são sempre bem-vindos!

---

## 📄 Licença

Este projeto é licenciado sob a **MIT License**.
