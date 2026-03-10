# Vitalis Mobile

Aplicativo mobile de **gerenciamento e acompanhamento de medicamentos**, desenvolvido para ajudar pacientes e cuidadores a organizar seus remédios, receber lembretes e monitorar a adesão ao tratamento.

> *Organizar remédios e cuidar com segurança.*

---

## Funcionalidades

- **Gestão de Medicamentos** — Cadastro com dosagem, horários e observações
- **Lembretes Inteligentes** — Geração automática com base no primeiro horário e intervalo de frequência
- **Acompanhamento de Adesão** — Confirmação diária de doses e monitoramento
- **Análise do Paciente** — Padrões de adesão, horários críticos e insights
- **Histórico Completo** — Registro de ingestões e alterações de medicamentos
- **Perfil e Configurações** — Gerenciamento de conta e preferências

---

## Telas

| Tela | Descrição |
|------|-----------|
| **Splash / Welcome** | Tela de onboarding com destaques do app |
| **Login / Cadastro** | Autenticação com e-mail e senha |
| **Home** | Dashboard com status de adesão semanal e atalhos rápidos |
| **Monitoramento** | Gráficos de confirmação por dia e tags de insight |
| **Histórico** | Linha do tempo de eventos (doses confirmadas, esquecidas, alterações) |
| **Perfil** | Dados do usuário, configurações e suporte |
| **Medicamento** | Formulário para adicionar/editar medicamentos com preview de horários |
| **Análise** | Nível de adesão, pontos críticos e recomendações |

---

## Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Framework** | React Native 0.81 · Expo 54 · React 19 |
| **Navegação** | Expo Router (file-based) · React Navigation 7 |
| **UI** | Design system próprio (Vitalis UI) · Reanimated 4 |
| **Linguagem** | TypeScript 5.9 (strict) |
| **Lint** | ESLint 9 com config Expo |

---

## Estrutura do Projeto

```
app/                  # Telas e roteamento (file-based routing)
  (tabs)/             # Navegação por abas (Home, Monitoramento, Histórico, Perfil)
components/           # Componentes reutilizáveis e design system
constants/            # Tokens de tema e cores
hooks/                # Hooks customizados
assets/               # Imagens e ícones
ios/                  # Código nativo iOS
android/              # Código nativo Android
scripts/              # Scripts utilitários
```

---

## Primeiros Passos

### Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd vitalis-mobile

# Instale as dependências
npm install
```

### Executando

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Rodar no iOS
npm run ios

# Rodar no Android
npm run android

# Rodar na Web
npm run web
```

### Outros Comandos

```bash
# Lint
npm run lint

# Resetar projeto (limpa o diretório app/)
npm run reset-project
```

---

## Design System

O app utiliza um design system próprio definido em `constants/vitalis-theme.ts` e implementado em `components/vitalis-ui.tsx`.

### Cores Principais

| Token | Cor | Uso |
|-------|-----|-----|
| `primary` | `#1565D8` | Cor principal da marca |
| `background` | `#F4F8FF` | Fundo do app |
| `success` | `#1F9D67` | Estados de sucesso |
| `danger` | `#CC4E4E` | Estados de erro |
| `text` | `#10324C` | Texto principal |

### Componentes

- **ScreenContainer** — Wrapper principal com efeitos decorativos
- **SectionCard** — Card para seções de conteúdo
- **PrimaryButton** — Botão estilizado (primary / secondary / danger)
- **InputField** — Campo de texto com label
- **LogoMark** — Logo "V" customizada
- **ScreenLabel** — Label em formato pill

---

## Licença

Projeto privado. Todos os direitos reservados.
