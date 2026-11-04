# Programação Web II — Exemplos para AWS EC2

Exemplos práticos do curso para execução em instância EC2.

## Instalação

### Opção 1 — Apenas PW2 (Apache2 + exemplos)

```bash
chmod +x setup.sh
sudo ./setup.sh
```



## Acesso

```
http://<IP-PUBLICO-DA-INSTANCIA>/
```

## Security Group

- **Porta 22 (SSH)** — obrigatória
- **Porta 80 (HTTP)** — para acessar os exemplos no navegador

## Estrutura dos exemplos

| Pasta | Conteúdo |
|---|---|
| `01_Renderizacao_Cliente/` | Comparação SSR vs CSR com React |
| `02_Reatividade/` | DOM manual vs React state |
| `03_Componentes/` | Componentes, props e composição |
| `04_Condicional_Listas/` | &&, ternário, map() e key |
| `05_Eventos_Formularios/` | Eventos, formulários e validação |
| `06_SPA_Rotas/` | SPA com navegação por hash |
| `07_Estado/` | useState, elevação de estado, useEffect |
| `08_Bootstrap/` | Grid, cards, navbar, modal |
| `09_Tailwind/` | Utilitários, grid responsivo, alertas |
| `10_Testes/` | Suite de testes simulada no navegador |
| `11_Projeto_Integrador/` | Lista de Tarefas (React + Bootstrap) |
| `12_Icones/` | Bootstrap Icons, React Icons, Heroicons |
| `13_Customizacao/` | Variáveis CSS, temas claro/escuro |
| `14_React_Router/` | React Router DOM (SPA com rotas) |
| `15_Testes_Jest/` | Testes unitários com Jest |
| `16_Testes_Interface/` | Testes de interface com RTL + userEvent |
| `17_Build_Releases/` | Build de produção com Vite |
| `18_Git_Versionamento/` | Guia completo de Git |
| `19_CI_CD/` | Pipeline GitHub Actions |
| `20_Cypress/` | Testes E2E com Cypress |
