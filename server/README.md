ETAPA 1 – Teste técnico
O que você precisará saber:
● Ler especificações técnicas em inglês e entender requisitos de
negócios.
● Desenvolver uma API REST em Node.js com Type Script.
● Noção básica de modelagem de bancos de dados.
● Criar uma imagem e subir um container utilizando Docker.
● O básico do versionamento em um repositório usando Git.
No que você será avaliado:
Sua aplicação será submetida a uma bateria de testes que irão
verificar cada um dos critérios de aceite. Por isso é importante que você
leia atentamente e siga rigorosamente todas as instruções. Sua
aplicação deve cumprir integralmente os requisitos.
Pontos desejáveis, mas que não são eliminatórios:
● Uma arquitetura limpa (clean code).
● Testes unitários.
Como entregar seu projeto:
● Preencha esse formulário -
https://forms.gle/4dTxZxR4CuGVP8DH8.
● A aplicação deve ser completamente dockerizada.
● Deve conter um arquivo docker-compose.yml na raiz do seu
repositório.
Nosso script de teste irá criar um arquivo .env na raiz do
repositório no seguinte formato. Sua aplicação deve receber essa
variável de ambiente para a execução.
GOOGLE_API_KEY=<chave da API>
ATENÇÃO: NÃO compartilhe sua chave pessoal conosco.
● O docker-compose deve ser capaz de subir a aplicação e todos os
serviços necessários com o comando docker-compose up.
● O backend da aplicação deve ficar exposto na porta 8080.
● O frontend da aplicação deve ficar exposto na porta 80.
Como você deve usar LLMs (Copilot, ChatGPT, Gemini, Llama, etc..),
Gostamos e incentivamos quem busca a inovação para se tornar
mais produtivo, porém queremos avaliar você! Utilize a LLM como
ferramenta e não como a criadora do seu código.

Você NÃO deve fazer:
● Copiar esse teste, colar no GPT e apenas copiar o resultado.
LLMs geram códigos ruins.
Você pode fazer:
● Usar o GPT para melhorar o código que você criou ou estudar
melhores práticas.

CENÁRIO
Vamos desenvolver uma aplicação conceito onde o usuário poderá
solicitar uma viagem em carro particular de um ponto A até um ponto
B. Ele poderá escolher entre algumas opções de motoristas e valores e
confirmar a viagem. Depois também poderá listar o histórico das
viagens realizadas. O diagrama abaixo mostra a estrutura geral da
aplicação.

DEFINIÇÕES DO BACKEND
O backend deverá ser uma API Rest em NodeJS e Typescript, e terá os
seguintes endpoints:

POST /ride/estimate
Responsável por receber a origem e o destino da viagem e realizar os
cálculos dos valores da viagem.

Esse endpoint deve fazer as seguintes validações:
● Os endereços de origem e destino recebidos não podem estar
em branco.
● O id do usuário não pode estar em branco.
● Os endereços de origem e destino não podem ser o mesmo
endereço.
Após as validações, ele deve:
● Calcular a rota entre a origem e destino usando a API Routes do
Google Maps.
● Com base no retorno, deve listar os motoristas disponíveis para a
viagem de acordo com a quilometragem mínima que aceitam,
cada um com seu respectivo valor, usando como base a
seguinte tabela:
ID NOME DESCRIÇÃO CARRO AVALIAÇÃO TAXA KM
MÍNIM
O

1 Homer
Simpson

Olá! Sou o
Homer, seu
motorista
camarada!
Relaxe e
aproveite o
passeio, com
direito a
rosquinhas e
boas risadas (e
talvez alguns
desvios).

Plymouth
Valiant 1973
rosa e
enferrujado
2/5
Motorista simpático,
mas errou o caminho 3
vezes. O carro cheira a
donuts.

R$
2,50/
km
1

2 Dominic
Toretto

Ei, aqui é o Dom.
Pode entrar, vou
te levar com
segurança e
rapidez ao seu
destino. Só não
mexa no rádio, a
playlist é
sagrada.

Dodge
Charger
R/T 1970
modificado
4/5
Que viagem incrível! O
carro é um show à parte
e o motorista, apesar de
ter uma cara de poucos
amigos, foi super gente
boa. Recomendo!

R$
5,00/
km
5

3 James Bond Boa noite, sou
James Bond. À
seu dispor para
um passeio
suave e discreto.
Aperte o cinto e
aproveite a
viagem.

Aston
Martin DB5
clássico
5/5
Serviço impecável! O
motorista é a própria
definição de classe e o
carro é simplesmente
magnífico. Uma
experiência digna de
um agente secreto.

R$
10,00/
