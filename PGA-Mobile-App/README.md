# PGA Mobile App

Aplicação mobile para o Sistema de Plano de Gestão Anual (PGA) das FATECs, desenvolvida com React Native e Expo.

## 📱 Sobre o Projeto

Este aplicativo foi desenvolvido para facilitar o acesso e gestão dos projetos do PGA através de dispositivos móveis, oferecendo uma interface intuitiva e funcionalidades essenciais para acompanhamento de projetos.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Linguagem de programação
- **React Navigation** - Navegação entre telas
- **Expo SecureStore** - Armazenamento seguro de dados
- **Axios** - Cliente HTTP para comunicação com API

## 📋 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Login seguro com JWT
- **Dashboard**: Visão geral dos projetos e estatísticas
- **Projetos**: Listagem, busca e filtros de projetos
- **Configurações**: Gerenciamento de perfil e preferências

### 🔄 Em Desenvolvimento
- Criação e edição de projetos
- Sistema de notificações push
- Relatórios e exportação de dados
- Modo offline
- Sincronização automática

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI global
- Dispositivo móvel ou emulador

### Instalação

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd PGA-Mobile-App
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

4. **Inicie o projeto**
   ```bash
   npm start
   # ou
   yarn start
   ```

5. **Execute no dispositivo**
   - Use o aplicativo Expo Go no seu dispositivo móvel
   - Escaneie o QR code exibido no terminal
   - Ou execute no emulador com `npm run android` / `npm run ios`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── context/            # Contextos React (Auth, etc.)
├── navigation/         # Configuração de navegação
├── screens/           # Telas da aplicação
│   ├── auth/          # Telas de autenticação
│   ├── dashboard/     # Dashboard principal
│   ├── projects/      # Gestão de projetos
│   └── settings/      # Configurações
├── services/          # Serviços (API, auth, etc.)
├── types/             # Definições de tipos TypeScript
└── utils/             # Utilitários e helpers
```

## 🔧 Configuração da API

O aplicativo se comunica com o backend através de uma API REST. Configure a URL da API no arquivo de configuração:

- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://sua-api-producao.com`

## 📱 Compatibilidade

- **iOS**: 12.0+
- **Android**: API Level 21+ (Android 5.0+)

## 🧪 Testes

Para executar os testes:
```bash
npm test
# ou
yarn test
```

## 📦 Build e Deploy

### Build para desenvolvimento
```bash
npm run build
```

### Build para produção
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte técnico, entre em contato:
- **Email**: suporte@pga.fatec.sp.gov.br
- **Telefone**: (11) 4002-8300

## 🏢 Desenvolvido por

**FATEC - Centro Paula Souza**
- Sistema de Plano de Gestão Anual
- Versão Mobile 1.0.0

---

**Nota**: Este é um projeto em desenvolvimento ativo. Novas funcionalidades são adicionadas regularmente.
